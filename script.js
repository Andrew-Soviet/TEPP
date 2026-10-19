// ============================================================
// ЧАСТИЦЫ
// ============================================================
(function initParticles() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile || prefersReduced) return;
    if (typeof particlesJS === 'undefined') return;

    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true }
        },
        retina_detect: true
    });
})();

// ============================================================
// ОПРЕДЕЛЕНИЕ ТИПА СТРАНИЦЫ
// ============================================================
function isMainPage() {
    const hasStandardBlocks = document.querySelector('.standard-block') !== null;
    const hasGallery = document.getElementById('gallery') !== null;
    return hasStandardBlocks && !hasGallery;
}

// ============================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    initSettings();
    initTheme();
    initMode();
    animateCounters();
    setupSmoothScroll();
    setupScrollTop();
    setupParallax();
    setupSectionAnimation();
    setupSearch();
    setupRandomRecommendations();
    setupEscapeKey();
    setupGallery();
    setupHideHeaderOnScroll();
});

// ============================================================
// НАСТРОЙКИ
// ============================================================
function initSettings() {
    const isMain = isMainPage();

    const modeButtons = isMain
        ? `
            <button class="settings-btn mode-btn" data-mode="standard" onclick="setMode('standard')">📖 Познавательный</button>
            <button class="settings-btn mode-btn" data-mode="random" onclick="setMode('random')">🎲 Случайный + Поиск</button>
        `
        : `
            <button class="settings-btn mode-btn" data-mode="standard" onclick="setMode('standard')">📖 Познавательный</button>
            <button class="settings-btn mode-btn" data-mode="gallery" onclick="setMode('gallery')">🖼️ Фотогалерея</button>
        `;

    const settingsHTML = `
        <div class="settings-panel" id="settingsPanel">
            <button class="settings-toggle" id="settingsToggle" onclick="toggleSettings()" aria-label="Настройки сайта">⚙️</button>
            <div class="settings-dropdown" id="settingsDropdown">
                <div class="settings-section">
                    <span class="settings-label">🌈 Тема</span>
                    <div class="settings-options" id="themeOptions">
                        <button class="theme-btn" data-theme="light" onclick="setTheme('light')" title="Светлая">☀️</button>
                        <button class="theme-btn" data-theme="dark" onclick="setTheme('dark')" title="Тёмная">🌙</button>
                        <button class="theme-btn" data-theme="poster" onclick="setTheme('poster')" title="Советский плакат">☭</button>
                        <button class="theme-btn" data-theme="night" onclick="setTheme('night')" title="Ночной поезд">👨‍💻</button>
                    </div>
                </div>
                <div class="settings-section">
                    <span class="settings-label">📋 Режим</span>
                    <div class="settings-options" id="modeOptions">
                        ${modeButtons}
                    </div>
                    <div class="mode-hint" id="modeHint">Текущий режим: Познавательный</div>
                </div>
            </div>
        </div>
    `;

    if (!document.getElementById('settingsPanel')) {
        document.body.insertAdjacentHTML('beforeend', settingsHTML);
    }

    loadSettings();
}

function toggleSettings() {
    const dropdown = document.getElementById('settingsDropdown');
    if (dropdown) dropdown.classList.toggle('active');
}

function closeSettings() {
    const dropdown = document.getElementById('settingsDropdown');
    if (dropdown) dropdown.classList.remove('active');
}

document.addEventListener('click', function(e) {
    const panel = document.getElementById('settingsPanel');
    if (panel && !panel.contains(e.target)) closeSettings();
});

function setupEscapeKey() {
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
            closeSettings();
        }
    });
}

// ============================================================
// ТЕМЫ
// ============================================================
const THEMES = ['light', 'dark', 'poster', 'night'];

function setTheme(theme) {
    if (!THEMES.includes(theme)) theme = 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tepp_theme', theme);
    updateThemeButtons(theme);
}

function initTheme() {
    const saved = localStorage.getItem('tepp_theme') || 'light';
    setTheme(saved);
}

function updateThemeButtons(activeTheme) {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === activeTheme);
    });
}

// ============================================================
// РЕЖИМЫ
// ============================================================
function setMode(mode) {
    if (isMainPage()) {
        localStorage.setItem('tepp_main_mode', mode);
        applyMainMode(mode);
    } else {
        localStorage.setItem('tepp_page_mode', mode);
        applyPageMode(mode);
    }
    updateModeButtons(mode);
}

function initMode() {
    if (isMainPage()) {
        const saved = localStorage.getItem('tepp_main_mode') || 'standard';
        applyMainMode(saved);
        updateModeButtons(saved);
    } else {
        const saved = localStorage.getItem('tepp_page_mode') || 'standard';
        applyPageMode(saved);
        updateModeButtons(saved);
    }
}

function applyMainMode(mode) {
    const standardBlocks = document.querySelectorAll('.standard-block');
    const randomBlocks = document.querySelectorAll('.random-block');

    if (mode === 'standard') {
        standardBlocks.forEach(el => el.style.display = '');
        randomBlocks.forEach(el => el.style.display = 'none');
    } else {
        standardBlocks.forEach(el => el.style.display = 'none');
        randomBlocks.forEach(el => el.style.display = '');
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) searchContainer.style.display = 'flex';
        if (typeof updateRandomRecommendations === 'function') {
            updateRandomRecommendations();
        }
    }

    document.documentElement.setAttribute('data-main-mode', mode);

    const modeHint = document.getElementById('modeHint');
    if (modeHint) {
        modeHint.textContent = mode === 'standard'
            ? 'Текущий режим: Познавательный'
            : 'Текущий режим: Случайный + Поиск';
    }

    const footerHint = document.getElementById('modeHintFooter');
    if (footerHint) {
        footerHint.innerHTML = mode === 'standard'
            ? '💡 Хотите больше рекомендаций? Зайдите в <span onclick="document.getElementById(\'settingsToggle\')?.click()">⚙️ Настройки</span> и переключите режим на «Случайный + Поиск»'
            : '💡 Хотите вернуться к разделам? Зайдите в <span onclick="document.getElementById(\'settingsToggle\')?.click()">⚙️ Настройки</span> и переключите режим на «Познавательный»';
    }
}

function applyPageMode(mode) {
    const gallery = document.getElementById('gallery');

    if (mode === 'gallery') {
        document.querySelectorAll('.section-card:not(#gallery)').forEach(el => {
            el.style.display = 'none';
        });
        document.querySelectorAll('.hero, .quote-section, .mode-hint-footer').forEach(el => {
            if (el) el.style.display = 'none';
        });
        if (gallery) {
            gallery.style.display = '';
            gallery.style.maxWidth = '100%';
            const cardContent = gallery.querySelector('.card-content');
            if (cardContent) cardContent.style.padding = '1rem';
        }
    } else {
        document.querySelectorAll('.section-card, .hero, .quote-section, .mode-hint-footer').forEach(el => {
            if (el) el.style.display = '';
        });
        if (gallery) {
            gallery.style.maxWidth = '';
            const cardContent = gallery.querySelector('.card-content');
            if (cardContent) cardContent.style.padding = '';
        }
    }

    document.documentElement.setAttribute('data-page-mode', mode);

    const modeHint = document.getElementById('modeHint');
    if (modeHint) {
        modeHint.textContent = mode === 'standard'
            ? 'Текущий режим: Познавательный'
            : 'Текущий режим: Фотогалерея';
    }
}

function updateModeButtons(activeMode) {
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === activeMode);
    });
}

function loadSettings() {
    const savedTheme = localStorage.getItem('tepp_theme') || 'light';
    updateThemeButtons(savedTheme);

    if (isMainPage()) {
        const savedMainMode = localStorage.getItem('tepp_main_mode') || 'standard';
        updateModeButtons(savedMainMode);
    } else {
        const savedPageMode = localStorage.getItem('tepp_page_mode') || 'standard';
        updateModeButtons(savedPageMode);
    }
}

// ============================================================
// СЧЁТЧИКИ
// ============================================================
function animateCounters() {
    setTimeout(() => {
        const counters = { pagesStat: 120, photosStat: 288, sectionsStat: 5 };
        for (const [id, target] of Object.entries(counters)) {
            const el = document.getElementById(id);
            if (el) {
                let current = 0;
                const timer = setInterval(() => {
                    current += Math.ceil(target / 50);
                    if (current >= target) { 
                        el.textContent = target.toLocaleString(); 
                        clearInterval(timer); 
                    } else { 
                        el.textContent = current.toLocaleString(); 
                    }
                }, 30);
            }
        }
    }, 100); // Небольшая задержка
}

function animateCounter(element, target, duration) {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// ============================================================
// UI
// ============================================================
function setupSmoothScroll() {
    document.querySelectorAll('.main-nav a, .footer-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    // Вычисляем позицию с учетом высоты шапки (примерно 80-90px)
                    const headerOffset = 90; 
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth' // Можно поменять на 'auto', если всё равно глючит
                    });
                }
            }
        });
    });
}

function setupScrollTop() {
    const btn = document.querySelector('.scroll-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.pageYOffset > 300);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ============================================================
// СКРЫТИЕ ШАПКИ ПРИ ПРОКРУТКЕ (только на самом верху)
// ============================================================
function setupHideHeaderOnScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', function() {
        // Если прокрутка больше 50 пикселей — прячем шапку
        if (window.scrollY > 50) {
            header.classList.add('header-hidden');
        } 
        // Если вернулись в самый верх (меньше 50 пикселей) — показываем
        else {
            header.classList.remove('header-hidden');
        }
    }, { passive: true }); 
}

function setupParallax() {
    const bg = document.querySelector('.gradient-bg');
    if (!bg) return;
    document.addEventListener('mousemove', e => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        bg.style.transform = `translate(${x * 20}px, ${y * 20}px) rotate(${x * 360}deg) scale(1.1)`;
    });
}

function setupSectionAnimation() {
    // Если пользователь только что кликнул по меню, отключаем анимацию на 1 секунду
    let isScrollingViaMenu = false;
    window.addEventListener('menuScrollStarted', () => {
        isScrollingViaMenu = true;
        setTimeout(() => { isScrollingViaMenu = false; }, 1000);
    });

    const observer = new IntersectionObserver(entries => {
        if (isScrollingViaMenu) return; // Не анимируем во время клика по меню

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.section-card, .hero').forEach(s => observer.observe(s));
}

function setupGallery() {
    const modal = document.getElementById('galleryModal');
    if (!modal) return;
    const content = document.getElementById('galleryModalContent');
    const close = document.getElementById('galleryModalClose');

    document.querySelectorAll('.gallery-item, .random-photo-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.gallery-caption, .random-photo-caption')?.textContent || '';
            if (content && img) {
                content.innerHTML = `
                    <img src="${img.src}" style="max-width:100%; max-height:70vh; border-radius:10px;" alt="${img.alt}">
                    <p style="text-align:center; margin-top:1rem;">${caption}</p>
                `;
                modal.classList.add('active');
            }
        });
    });

    close?.addEventListener('click', () => modal.classList.remove('active'));
    window.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });
}

// ============================================================
// ПОИСК
// ============================================================
const SEARCH_PAGES = [
    { title: 'Вагон типа А', url: 'Type_A.html', tags: ['метро', 'мосметро', 'вагон', 'тип а', 'первый'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Вагон типа Б', url: 'Type_B.html', tags: ['метро', 'мосметро', 'вагон', 'тип б', 'модернизация'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Вагон типа Г', url: 'Type_G.html', tags: ['метро', 'мосметро', 'вагон', 'тип г', 'серийный'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Вагон типа Д', url: 'Type_D.html', tags: ['метро', 'мосметро', 'вагон', 'тип д', 'сцепка шарфенберга'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Вагон типа В (трофейный)', url: 'Type_V.html', tags: ['метро', 'мосметро', 'вагон', 'тип в', 'трофейный', 'берлин'], types: ['метро', 'музей'], city: 'Москва', country: 'СССР' },
    { title: 'М5 — прототипы типа Д', url: 'Type_M5.html', tags: ['метро', 'мосметро', 'м5', 'ум5', 'опытный'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Вагон Д №2018 — первый с гофрами', url: 'Type_D_2018.html', tags: ['метро', 'вагон', 'тип д', '2018', 'гофры'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Еж3-путеизмеритель', url: 'Еж3-путеизмеритель.html', tags: ['метро', 'путеизмеритель', 'служебный', 'еж3'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Опытный Скиф', url: 'Опытный_Скиф.html', tags: ['метро', 'скиф', 'русич', 'опытный'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Яуза 0028-0035', url: 'Живая_история_Яуза_0028-0035.html', tags: ['метро', 'яуза', 'опытный'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Яуза №0021', url: 'Яуза0021.html', tags: ['метро', 'яуза', 'музейный', '81-720'], types: ['метро', 'музей'], city: 'Москва', country: 'Россия' },
    { title: 'Московский метрополитен', url: 'Главная_Страница_Мосметро.html', tags: ['метро', 'мосметро', 'москва'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Подвижной состав Московского метро', url: 'ps_mosmetro.html', tags: ['метро', 'мосметро', 'подвижной состав'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Минский метрополитен', url: 'Minsk_metro.html', tags: ['метро', 'минск', 'беларусь'], types: ['метро'], city: 'Минск', country: 'Беларусь' },
    { title: 'Красная стрела (метро)', url: 'Красная_Стрела.html', tags: ['метро', 'именной', 'красная стрела'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Красная стрела (ЖД)', url: 'Красная_стрела_жд.html', tags: ['поезд', 'ржд', 'москва', 'питер'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'Полярная стрела', url: 'Полярная_стрела.html', tags: ['поезд', 'ржд', 'мурманск'], types: ['жд'], city: 'Мурманск', country: 'Россия' },
    { title: 'ЧС7', url: 'ЧС7.html', tags: ['электровоз', 'ржд', 'локомотив', 'чс7'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЧС7 в расцветке «Новопид»', url: 'ЧС7_новопид.html', tags: ['электровоз', 'ржд', 'чс7', 'новопид', 'окраска', 'красно-серый'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЧС7-199', url: 'ЧС7_199.html', tags: ['электровоз', 'ржд', 'ЧС7 №199', 'ЧС7', 'звезда'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЭП2К', url: 'ЭП2К.html', tags: ['электровоз', 'ржд', 'эп2к'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЧС6', url: 'ЧС6.html', tags: ['электровоз', 'ржд', 'ЧС', 'ЧС6'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЧС6 №025 "Заводской"', url: 'CHS6-025.html', tags: ['электровоз', 'ржд', '025', 'ЧС', 'ЧС6 №025', 'ЧС6-025', 'ЧС6'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: '81-717(ЛВЗ) №8535', url: '8535музей.html', tags: ['музей', '8535', '81-717', 'номерной'], types: ['метро', 'музей'], city: 'Москва', country: 'Россия' },
    { title: '81-717.5М (МВМ) №2550', url: '2550.html', tags: ['метро', 'мосметро', 'вагон', 'тип 81-717', '2550'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'ЭП2К-500', url: 'ЭП2К-500.html', tags: ['электровоз', 'ржд', 'эп2к', 'юбилейный'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЭП2К-510/511', url: 'ЭП2К-510.html', tags: ['электровоз', 'ржд', 'эп2к', 'красная стрела'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'Ретросостав А 1-1031-21', url: 'Ашка.html', tags: ['Ашка', '1', '21', '1031', 'ретро'], types: ['метро', 'музей'], city: 'Москва', country: 'Россия' },
    { title: 'Трамвай 71-135 №3001', url: '71-135 № 3001.html', tags: ['трамвай', 'москва'], types: ['трамвай'], city: 'Москва', country: 'Россия' },
    { title: 'МТВ-82 №1075', url: 'МТВ-82 №1075.html', tags: ['трамвай', 'мтв', 'музей'], types: ['трамвай', 'музей'], city: 'Москва', country: 'Россия' },
    { title: 'Конка 1872 года №35', url: 'Конка_1872_года_35.html', tags: ['конка', 'трамвай', 'история'], types: ['трамвай', 'музей'], city: 'Москва', country: 'Россия' },
    { title: 'СВАРЗ №3130', url: 'Двухосный моторный СВАРЗ №3130.html', tags: ['трамвай', 'сварз', 'грузовой'], types: ['трамвай', 'музей'], city: 'Москва', country: 'Россия' },
    { title: 'Tatra T3SU №5993', url: 'Tatra T3SU №5993.html', tags: ['трамвай', 'татра', 'tatra'], types: ['трамвай', 'музей'], city: 'Москва', country: 'Россия' },
    { title: 'ЗИС-8', url: 'ЗИС-8.html', tags: ['автобус', 'зис', 'история'], types: ['автобус'], city: 'Москва', country: 'СССР' },
    { title: 'ЗИС-154', url: 'ЗИС-154.html', tags: ['автобус', 'зис', 'история'], types: ['автобус'], city: 'Москва', country: 'СССР' },
    { title: 'ЗИС-155', url: 'ЗИС-155.html', tags: ['автобус', 'зис', 'история'], types: ['автобус'], city: 'Москва', country: 'СССР' },
    { title: 'ЗИЛ-158', url: 'ЗИЛ-158.html', tags: ['автобус', 'зил', 'история'], types: ['автобус'], city: 'Москва', country: 'СССР' },
    { title: 'Канатная дорога Алма-Аты', url: 'Алма-Ата_канатка.html', tags: ['канатная', 'алматы', 'казахстан'], types: ['монорельс'], city: 'Алма-Ата', country: 'Казахстан' },
    { title: 'Московский монорельс', url: 'Монорельс.html', tags: ['монорельс', 'москва'], types: ['монорельс'], city: 'Москва', country: 'Россия' },
    { title: 'Монорельс «Стрела»', url: 'Монорельс_Стрела.html', tags: ['монорельс', 'стрела', 'подмосковье'], types: ['монорельс'], city: 'Москва', country: 'Россия' },
    { title: 'Музеи транспорта', url: 'Музеи_транспорта.html', tags: ['музей', 'транспорт', 'экспозиция'], types: ['музей'], city: 'Москва', country: 'Россия' },
    { title: 'Музей Транспорта Москвы', url: 'МузейТранспортаМосквы.html', tags: ['музей', 'москва', 'транспорт'], types: ['музей'], city: 'Москва', country: 'Россия' },
    { title: 'Легенды и мифы метро', url: 'Легенды_и_мифы_метро.html', tags: ['метро', 'легенды', 'мифы'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Парад поездов', url: 'Парад_метро_Москвы.html', tags: ['парад', 'метро', 'мероприятие'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'История Московского метро', url: 'Метро_Мск_история.html', tags: ['метро', 'история', 'москва'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Живая история метро', url: 'Живая_история_Мск_метро.html', tags: ['метро', 'живая история'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Ушедшие в историю', url: 'Ушедшие_в_историю_метро.html', tags: ['метро', 'утраченные', 'история'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Грузовые вагоны метро', url: 'Грузовые_вагоны.html', tags: ['метро', 'грузовые', 'служебные'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Служебные поезда метро', url: 'Служебные_поезда_метро.html', tags: ['метро', 'служебные'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'ДК1 «Синергия-1»', url: 'ДК1_метро.html', tags: ['метро', 'диагностика'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'ДК2 «Синергия-2»', url: 'ДК2_метро.html', tags: ['метро', 'диагностика'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Поезд Деда Мороза', url: 'ПДМ_ЖД.html', tags: ['поезд', 'ржд', 'новый год'], types: ['жд'], city: 'Москва', country: 'Россия' },
];

// ============================================================
// ПОИСК С ФИЛЬТРАМИ — результат по кнопке или Enter
// ============================================================
function setupSearch() {
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    const searchBtn = document.getElementById('searchBtn');
    const filterType = document.getElementById('filterType');
    const filterCity = document.getElementById('filterCity');
    const filterCountry = document.getElementById('filterCountry');
    const filterInfo = document.getElementById('filterResultsInfo');

    if (!input || !results) return;

    function applyFilters() {
        const query = input.value.toLowerCase().trim();
        const type = filterType?.value || '';
        const city = filterCity?.value || '';
        const country = filterCountry?.value || '';

        // Если ничего не введено и фильтры пустые — не ищем
        if (!query && !type && !city && !country) {
            results.innerHTML = '';
            results.classList.remove('active');
            if (filterInfo) filterInfo.innerHTML = '';
            return;
        }

const matches = SEARCH_PAGES.filter(p => {
    const matchesQuery = !query
        || p.title.toLowerCase().includes(query)
        || (p.tags || []).some(t => t.includes(query));

    // Поддержка и type, и types
    const pTypes = p.types || (p.type ? [p.type] : []);
    const matchesType = !type || pTypes.includes(type);

    const matchesCity = !city || p.city === city;
    const matchesCountry = !country || p.country === country;

    return matchesQuery && matchesType && matchesCity && matchesCountry;
});

        if (matches.length === 0) {
            results.innerHTML = '<p style="color:var(--text-secondary);padding:1rem;">Ничего не найдено. Попробуйте другой запрос.</p>';
        } else {
results.innerHTML = matches.map(p =>
    `<div class="search-result-item">
        <a href="${p.url}">
            <strong>${p.title}</strong>
            ${p.type ? `<span class="result-tag">${p.type}</span>` : ''}
            ${p.city ? `<span class="result-tag">${p.city}</span>` : ''}
        </a>
    </div>`
).join('');
        }

        if (filterInfo) {
            filterInfo.innerHTML = `Найдено: <strong>${matches.length}</strong>`;
        }
        results.classList.add('active');
    }

    // Кнопка «Найти»
    searchBtn?.addEventListener('click', applyFilters);

    // Enter в поле ввода
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyFilters();
        }
    });

    // Фильтры — тоже по кнопке
    filterType?.addEventListener('change', applyFilters);
    filterCity?.addEventListener('change', applyFilters);
    filterCountry?.addEventListener('change', applyFilters);

    // Скрыть результаты при клике вне блока
    document.addEventListener('click', e => {
        const container = document.querySelector('.search-filters');
        if (container && !container.contains(e.target) && !results.contains(e.target)) {
            results.classList.remove('active');
        }
    });
}
// ============================================================
// СЛУЧАЙНЫЕ РЕКОМЕНДАЦИИ (20 фото + 20 страниц)
// ============================================================
let updateRandomRecommendations = null;

function setupRandomRecommendations() {
    const container = document.getElementById('randomPages');
    const photoContainer = document.getElementById('randomPhoto');
    if (!container || !photoContainer) return;

    // ---------- Страницы для рекомендаций ----------
    const pages = [
        { title: 'Вагон типа А', url: 'Type_A.html', icon: '🚇' },
        { title: 'Вагон типа Б', url: 'Type_B.html', icon: '🚇' },
        { title: 'Вагон типа Г', url: 'Type_G.html', icon: '🚇' },
        { title: 'Вагон типа Д', url: 'Type_D.html', icon: '🚈' },
        { title: 'Вагон типа В', url: 'Type_V.html', icon: '🚋' },
        { title: 'М5 — прототипы типа Д', url: 'Type_M5.html', icon: '🚃' },
        { title: 'Вагон № 2018', url: 'Type_D_2018.html', icon: '⭐' },
        { title: 'Еж3-путеизмеритель', url: 'Еж3-путеизмеритель.html', icon: '🚞' },
        { title: 'Опытный Скиф', url: 'Опытный_Скиф.html', icon: '🚃' },
        { title: 'Яуза 0028-0035', url: 'Живая_история_Яуза_0028-0035.html', icon: '🚇' },
        { title: 'Яуза №0021', url: 'Яуза0021.html', icon: '🚇' },
        { title: '81-717/714', url: 'Type_81-717.html', icon: '🚇' },
        { title: 'Ретро-поезд «Сокольники»', url: 'Ретро поезд.html', icon: '🚂' },
        { title: 'ЕжТК', url: 'ЕжТК.html', icon: '🔬' },
        { title: '81-720 «Яуза»', url: 'Опытная_Яуза_001-005.html', icon: '🚇' },
        { title: '81-760 «Ока»', url: 'Type_81-760.html', icon: '🚈' },
        { title: '81-765 «Москва»', url: 'Type_81-765.html', icon: '🌆' },
        { title: '81-775 «Москва-2020»', url: 'Type_81-775.html', icon: '🌃' },
        { title: '81-775.2 «Москва-2024»', url: 'Type_81-775-2.html', icon: '🌃' },
        { title: 'Беспилотная «Москва-2024»', url: 'bespilotm24.html', icon: '🤖' },
        { title: '81-760А «Баклажан»', url: 'Баклан.html', icon: '🍆' },
        { title: '81-740 «Русич»', url: 'Type_81-740.html', icon: '🚃' },
        { title: 'Состав «Акварель»', url: 'Акварель.html', icon: '🎨' },
        { title: '«Олег Табаков»', url: 'Табаков0350.html', icon: '🎭' },
        { title: 'Народный ополченец', url: 'Народный_ополченец.html', icon: '🎖️' },
        { title: 'Красная стрела (метро)', url: 'Красная_Стрела.html', icon: '🚇' },
        { title: 'Курская дуга', url: 'Курская_дуга_метро.html', icon: '⚔️' },
        { title: 'Новогодний Еж3', url: 'НГ_еж3.html', icon: '🎄' },
        { title: 'Московский метрополитен', url: 'Главная_Страница_Мосметро.html', icon: '🚇' },
        { title: 'Подвижной состав', url: 'ps_mosmetro.html', icon: '🚆' },
        { title: 'Минский метрополитен', url: 'Minsk_metro.html', icon: '🚇' },
        { title: 'Замоскворецкая линия', url: 'ЗЛ_уники.html', icon: '🟢' },
        { title: 'Сокольническая линия', url: 'СокЛ_уники.html', icon: '🔴' },
        { title: 'Арбатско-Покровская линия', url: 'АПЛ_уники.html', icon: '🔵' },
        { title: 'Люблинско-Дмитровская линия', url: 'ЛДЛ_уники.html', icon: '🟢' },
        { title: 'Калининско-Солнцевская линия', url: 'КСЛ_уники.html', icon: '🟡' },
        { title: 'Музеи транспорта', url: 'Музеи_транспорта.html', icon: '🏛️' },
        { title: 'Музей Транспорта Москвы', url: 'МузейТранспортаМосквы.html', icon: '🏛️' },
        { title: 'МТВ-82 №1075', url: 'МТВ-82 №1075.html', icon: '🚊' },
        { title: 'Конка 1872 года', url: 'Конка_1872_года_35.html', icon: '🐴' },
        { title: 'СВАРЗ №3130', url: 'Двухосный моторный СВАРЗ №3130.html', icon: '🏗️' },
        { title: 'Tatra T3SU №5993', url: 'Tatra T3SU №5993.html', icon: '🚊' },
        { title: 'ЗИС-8', url: 'ЗИС-8.html', icon: '🚌' },
        { title: 'ЗИС-154', url: 'ЗИС-154.html', icon: '🚌' },
        { title: 'ЗИС-155', url: 'ЗИС-155.html', icon: '🚌' },
        { title: 'ЗИЛ-158', url: 'ЗИЛ-158.html', icon: '🚌' },
        { title: 'Красная стрела (ЖД)', url: 'Красная_стрела_жд.html', icon: '🚂' },
        { title: 'Полярная стрела', url: 'Полярная_стрела.html', icon: '🚂' },
        { title: 'ЧС7', url: 'ЧС7.html', icon: '🚆' },
        { title: 'ЧС7-199', url: 'ЧС7_199.html', icon: '⭐' },
        { title: 'ЭП2К', url: 'ЭП2К.html', icon: '⚡' },
        { title: 'ЭП2К-500', url: 'ЭП2К-500.html', icon: '🎉' },
        { title: 'ЭП2К-510/511', url: 'ЭП2К-510.html', icon: '🚂' },
        { title: 'Трамвай 71-135 №3001', url: '71-135 № 3001.html', icon: '🚊' },
        { title: 'Поезд Деда Мороза', url: 'ПДМ_ЖД.html', icon: '🎅' },
        { title: 'Служебные поезда', url: 'Служебные_поезда_метро.html', icon: '🔧' },
        { title: 'ДК1 «Синергия-1»', url: 'ДК1_метро.html', icon: '⚡' },
        { title: 'ДК2 «Синергия-2»', url: 'ДК2_метро.html', icon: '⚡' },
        { title: '9818 — вагон-сопровождение', url: '9818.html', icon: '🔷' },
        { title: 'Первая 81-717 0001-0002', url: 'Первый_номер.html', icon: '🚆' },
        { title: '81-717 №0067', url: '81-717(ММЗ)№0067.html', icon: '🔬' },
        { title: '81-717.6К', url: 'Опытный_поезд_81-717.6К.html', icon: '🚇' },
        { title: '81-720А', url: '81-720А.html', icon: '🔧' },
        { title: 'Опытная Ока', url: 'Опытная_Ока.html', icon: '🚈' },
        { title: 'Опытный поезд И', url: 'Опытный_поезд_И.html', icon: '🔬' },
        { title: 'Скиф 0152 «Черноглазый»', url: 'Скиф_0152.html', icon: '👁️' },
        { title: 'ТЧ-5 8712-7919-0065', url: 'ТЧ-5_8712-7919-0065.html', icon: '🏭' },
        { title: 'Вагон 2550', url: '2550.html', icon: '🎨' },
        { title: 'Московский монорельс', url: 'Монорельс.html', icon: '🚝' },
        { title: 'История монорельса', url: 'Монорельс_история.html', icon: '📜' },
        { title: 'Монорельс «Стрела»', url: 'Монорельс_Стрела.html', icon: '🚝' },
        { title: 'Легенды и мифы метро', url: 'Легенды_и_мифы_метро.html', icon: '👻' },
        { title: 'Мероприятия метро', url: 'Мероприятия_метро.html', icon: '🎉' },
        { title: 'Парад поездов', url: 'Парад_метро_Москвы.html', icon: '🎊' },
        { title: 'История Московского метро', url: 'Метро_Мск_история.html', icon: '📖' },
        { title: 'Живая история метро', url: 'Живая_история_Мск_метро.html', icon: '📚' },
        { title: 'Ушедшие в историю', url: 'Ушедшие_в_историю_метро.html', icon: '⏳' },
        { title: 'Грузовые вагоны метро', url: 'Грузовые_вагоны.html', icon: '📦' },
    ];

    // ---------- Фото с авторством ----------
    const photos = [
        // Подвижной состав
        { src: 'Скифарик.jpg', caption: 'Опытный Скиф', author: 'Lasselan' },
        { src: 'Type_A_1.jpeg', caption: 'Вагон типа А № 1', author: 'pfandrom' },
        { src: 'Type_A_1001.jpg', caption: 'Вагон типа А № 1001', author: 'andzis (transphoto)' },
        { src: 'Type_A_int.jpg', caption: 'Салон вагона типа А', author: 'Анатолий Тягун (transphoto)' },
        { src: 'Type_A_film.jpg', caption: 'Вагон типа А в кино', author: 'Игорь Черных (transphoto)' },
        { src: 'Type_A_1_yellow.jpeg', caption: 'Вагон типа А в 1995 году', author: 'Александр Шанин (transphoto)' },
        { src: 'Type_A_int2.jpg', caption: 'Салон вагона типа А (2006)', author: 'Климова Валентина Ивановна' },
        { src: 'Type_D_2037.jpg', caption: 'Вагон типа Д № 2037', author: 'Transport_moscow(transphoto)' },
        { src: 'Type_D_2037_int.jpg', caption: 'Салон вагона типа Д № 2037', author: 'Subkinov(transphoto)' },
        { src: 'Type_G_479.jpg', caption: 'Вагон типа Г № 479', author: 'andzis(transphoto)' },
        { src: 'Type_G_530.jpg', caption: 'Вагон типа Г № 530', author: 'pfandrom' },
        { src: 'Type_G_713.jpg', caption: 'Вагон типа Г № 713', author: 'Andrey Atom(transphoto)' },
        { src: 'Type_G_713_int.jpg', caption: 'Интерьер вагона типа Г № 713', author: 'WOM(transphoto)' },
        { src: 'M5_806.jpg', caption: 'УМ5 № 806', author: 'ER2-1017' },
        { src: 'M5_806_int.jpg', caption: 'Салон УМ5 № 806', author: 'Lasselan' },
        { src: '760A_gagarin.jpg', caption: '81-760А на Гагаринской', author: 'Сергей Лапин' },
        { src: '760A_int.jpg', caption: 'Салон 81-760А', author: 'Solidolych' },
        { src: '75488.jpg', caption: '81-775.2 «Москва-2026»', author: 'Артём Алмазов (transphoto)' },
        { src: 'bespilotm24.jpg', caption: 'Беспилотная «Москва-2024»', author: 'Артём Алмазов' },
        { src: 'bespilotm24_int.jpg', caption: 'Салон беспилотной «Москвы-2024»', author: 'mosnikita' },
        { src: 'bespilotm24_cab.jpg', caption: 'Кабина беспилотной «Москвы-2024»', author: 'Mixpokr_Hedgehog' },
        { src: 'bespilotm24_2.jpg', caption: 'Обкатка беспилотной «Москвы-2024»', author: 'ShetrPetr' },
        { src: '5564_int.jpg', caption: 'Интерьер вагона № 5564', author: 'Welder' },
        { src: '5564.jpg', caption: 'Вагон № 5564', author: 'Озермос' },
        { src: '5824_int.jpg', caption: 'Интерьер Еж3 № 5824', author: 'pfandrom' },
        { src: '6719_int.jpg', caption: 'Интерьер вагона № 6719', author: 'pfandrom' },
        { src: '7374.jpg', caption: 'Вагон № 7374', author: 'Nikita_Transportnik' },
        { src: '81-580.jpg', caption: '81-580 ВЭКА', author: 'Артём Алмазов' },
        { src: '81-580_int.jpg', caption: 'Салон 81-580', author: 'Kr1p' },
        { src: '81-717_zavod.jpg', caption: '81-717 на заводе', author: 'Владимир Заболотский' },
        { src: '720.1_3.jpg', caption: '81-720.1', author: 'metro.vpeterburge.ru' },
        { src: '720.1_5.jpg', caption: '81-721.1 № 11027', author: 'Андрей Комаров' },
        { src: '720.1_10.jpg', caption: '81-720.1 № 10037, пульт', author: 'Андрей Комаров' },
        { src: '720.1_17.jpg', caption: '81-720.1, салон', author: 'metro.vpeterburge.ru' },
        { src: '720onzavod.png', caption: '81-720.1 на заводе', author: 'metro.vpeterburge.ru' },
        { src: 'pult_exs_720lvz.jpg', caption: 'Пульт экстренной связи', author: 'Андрей Комаров' },
        { src: 'zavod720lvz.jpg', caption: 'Табличка 81-720.1', author: 'Андрей Комаров' },
        { src: 'Oka_LDL.jpg', caption: '«Ока» на ЛДЛ', author: 'Lasselan (TransPhoto)' },
        { src: 'Yauza_LDL.jpg', caption: '«Яуза» на ЛДЛ', author: 'Андрей Дем (TransPhoto)' },
        { src: 'Акварель_1.jpg', caption: 'Состав «Акварель»', author: 'Александр Марьянович' },
        { src: 'Акварель_2.jpg', caption: 'Состав «Акварель»', author: 'Владислаv 5689' },
        { src: 'ДК1.jpg', caption: 'ДК1', author: 'Yaroslav_09' },
        { src: 'дк2.jpg', caption: 'ДК2', author: 'pfandrom' },
        { src: 'ДК-2сопр.jpg', caption: 'ДК-2', author: 'pfandrom' },
        { src: 'Город_Для_Людей_Музей.jpg', caption: 'Музей Транспорта Москвы', author: 'new.mtmuseum.ru' },
        { src: 'Устройство_Станции.jpg', caption: 'Раздел «Устройство станции»', author: 'new.mtmuseum.ru' },
        { src: 'R1.jpg', caption: 'Трамвай R1', author: 'new.mtmuseum.ru' },
        { src: 'Еж3&81-717.jpg', caption: 'Еж3 и 81-717 в музее', author: 'Dmitry Zaharov' },

        // Трамваи / автобусы
        { src: '0665.jpg', caption: 'Вагон 0665', author: 'LASTOR_F' },
        { src: '1887.jpg', caption: 'Рыжий пластик в вагоне 1887', author: 'pfandrom' },
        { src: '23591.jpg', caption: 'Голубой пластик в вагоне 23591', author: 'pfandrom' },
        { src: '11119.jpg', caption: 'Голубой пластик в вагоне 11119', author: 'pfandrom' },
        { src: '10142_int.jpg', caption: 'Бордовые диваны в вагоне 10142', author: 'tomatikwwr' },
        { src: 'sud_Yauza_81-714.jpg', caption: 'Сиденья от Яузы в вагоне 1598', author: 'pfandrom' },
        { src: '0959.jpg', caption: '«Ковидные» сиденья в вагоне 0959', author: 'pfandrom' },
        { src: '0963.jpg', caption: '«Ковидные» сиденья в вагоне 0963', author: 'pfandrom' },
        { src: '8535.jpg', caption: '81-717 (ЛВЗ) №8535', author: 'pfandrom' },
        { src: '8535_imba.jpg', caption: 'Вагон №8535 с уровня платформы', author: 'pfandrom' },
        { src: '0379.jpg', caption: 'Вагон 0379 с трёхцветной маской', author: 'Gleb5564(transphoto)' },
        { src: 'Type_B_ploshad_sverlova.jpg', caption: 'Вагон Б на станции Площадь Свердлова', author: 'Трёхгранка' },
        { src: '10001.jpg', caption: 'Поезд И 81-715.1', author: 'ТАСС' },
        { src: 'Опыт номер.jpg', caption: 'Опытный 81-717', author: 'Виктор Будан(ТАСС)' },
        { src: '1709421.jpg', caption: 'Опытный поезд 81-717.6К', author: 'andzis' },
        { src: '0021_int.jpg', caption: 'Интерьер Яузы №0021', author: 'Transport_moscow' },
        { src: '0021_fl.jpg', caption: 'Яуза №0021, вид с пола', author: 'pfandrom' },
        { src: 'Скиф0152.jpg', caption: '«Черноглазый» Русич 0152', author: 'Tosh Evs' },
        { src: 'Ока опыт 2.jpg', caption: 'Ока на выставке ЭкспоСитиТранс 2010', author: 'Шпекавыг' },
        { src: '37002_int.jpg', caption: 'Интерьер вагона 37002', author: 'Mr.Den' },
        { src: '30007.jpg', caption: 'Состав на испытаниях', author: 'Дмитрий Белов' },
        { src: '0381.jpg', caption: 'Вагон 0381 состава «Олег Табаков»', author: 'Renzex87' },
        { src: '0350.jpg', caption: 'Вагон 0350 состава «Олег Табаков»', author: 'Стальной Гвоздь' },
        { src: '0065_внешка.jpg', caption: 'Вагон 0065, внешний вид', author: 'Транспортник Москвы / Вова' },
        { src: '0065_int.jpg', caption: 'Вагон 0065, интерьер', author: 'Welder' },
        { src: '8712.jpg', caption: 'Вагон 8712', author: 'Welder' },
        { src: '8712_int2022.jpg', caption: 'Вагон 8712, интерьер (2022)', author: 'Александр Л 2016' },
        { src: '8712_int2026.jpg', caption: 'Вагон 8712, интерьер (2026)', author: 'Транспортник Москвы / Вова' },
        { src: '8712_приятность.jpg', caption: 'Вагон 8712, «приятность»', author: 'Транспортник Москвы / Вова' },
        { src: 'ЧС7_199.jpg', caption: 'ЧС7-199 с заводской окраской', author: 'pfandrom' },
        { src: 'ЧС7-199_звезда.jpg', caption: 'ЧС7-199 — звезда', author: 'pfandrom' },
        { src: 'эд4мку.jpg', caption: 'ЭД4МКУ, первая окраска', author: 'dymon.z' },
        { src: 'эд4мку_2017.jpg', caption: 'ЭД4МКУ, вторая окраска', author: 'Григорий Клинов' },
        { src: 'эд4мку_2025.jpg', caption: 'ЭД4МКУ, третья окраска', author: 'phandrom' },
        { src: 'ЭП2К-511.jpg', caption: 'ЭП2К-511 с «Красной стрелой»', author: 'SaVvUsHkA' },
    ];

    function shuffle(arr) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    const PHOTO_COUNT = 9;
    const PAGE_COUNT = 20;

    updateRandomRecommendations = function() {
        // ---- Случайные страницы ----
        const selected = shuffle(pages).slice(0, PAGE_COUNT);
        container.innerHTML = selected.map(p =>
            `<a href="${p.url}" class="random-page-card">
                <span class="icon">${p.icon}</span>
                <span class="title">${p.title}</span>
            </a>`
        ).join('');

        // ---- 10 случайных фото (напрямую в #randomPhoto) ----
        const selectedPhotos = shuffle(photos).slice(0, PHOTO_COUNT);
        photoContainer.innerHTML = selectedPhotos.map(photo => {
            const authorPart = photo.author ? ` — 📸 ${photo.author}` : '';
            return `
                <div class="random-photo-item" style="display: flex; flex-direction: column; background: var(--bg-card-solid); border-radius: var(--radius-sm); overflow: hidden; height: 100%;">
                    <img src="img/${photo.src}"
                         alt="${photo.caption}"
                         style="width: 100%; height: 200px; object-fit: cover; display: block;"
                         onerror="this.src='img/no-photo.png'">
                    <div class="random-photo-caption" style="padding: 0.6rem; text-align: center; border-top: 1px solid var(--border-color); flex-grow: 1; display: flex; align-items: center; justify-content: center; font-size: 0.85rem;">📷 ${photo.caption}${authorPart}</div>
                </div>
            `;
        }).join('');
    };

    updateRandomRecommendations();
    document.getElementById('refreshRandom')?.addEventListener('click', updateRandomRecommendations);
}



// ============================================================
// МОДАЛЬНОЕ ОКНО ПЕРЕНАПРАВЛЕНИЯ В TELEGRAM
// ============================================================
(function initTelegramModal() {
    const modal = document.getElementById('telegramModal');
    if (!modal) return;

    const goBtn = document.getElementById('telegramGoBtn');
    const cancelBtn = document.getElementById('telegramCancelBtn');
    const closeBtn = document.getElementById('telegramModalClose');
    const TG_URL = 'https://t.me/andreimetro1289';

    function openModal(e) {
        if (e) e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // блокируем скролл
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Кнопка «Перейти в канал» — открывает Telegram
    goBtn?.addEventListener('click', () => {
        window.open(TG_URL, '_blank', 'noopener');
        closeModal();
    });

    // Кнопки «Отмена» и «×»
    cancelBtn?.addEventListener('click', closeModal);
    closeBtn?.addEventListener('click', closeModal);

    // Клик по фону — закрыть
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Escape — закрыть
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Привязываем ко всем ссылкам на Telegram
    // (ищем по href, содержащему t.me/andreimetro1289)
    document.querySelectorAll('a[href*="t.me/andreimetro1289"], a[href*="andreimetro1289"]').forEach(link => {
        link.addEventListener('click', openModal);
    });

    // На случай, если ссылка добавится позже — экспортируем функцию
    window.openTelegramModal = openModal;
})();


// ============================================================
// ГЛОБАЛЬНАЯ МОДАЛКА ПЕРЕНАПРАВЛЕНИЯ В TELEGRAM
// Вставляется автоматически на каждой странице, где подключён script.js
// ============================================================
(function initTelegramModalGlobal() {
    // Защита от повторной вставки
    if (document.getElementById('telegramModal')) return;

    // 1. Вставляем HTML модалки в конец <body>
    document.body.insertAdjacentHTML('beforeend', `
        <div class="modal" id="telegramModal" role="dialog" aria-modal="true" aria-labelledby="telegramModalTitle">
            <div class="modal-content tg-modal-content">
                <span class="modal-close" id="telegramModalClose">&times;</span>
                <div class="tg-modal-header">
                    <span class="tg-modal-icon">🚆</span>
                    <h2 id="telegramModalTitle">Перенаправление в Telegram</h2>
                </div>
                <div class="tg-modal-body">
                    <p>Вы перенаправляетесь в канал <strong>Andrei Transport</strong>.</p>
                    <p>Для поиска информации по проекту ищите по хэштегу:</p>
                    <p class="tg-hashtag">#tepp@andreimetro1289</p>
                </div>
                <div class="tg-modal-actions">
                    <button class="btn btn-primary" id="telegramGoBtn">Перейти в канал</button>
                    <button class="btn btn-secondary" id="telegramCancelBtn">Отмена</button>
                </div>
            </div>
        </div>
    `);

    // 2. Логика модалки
    const modal = document.getElementById('telegramModal');
    const goBtn = document.getElementById('telegramGoBtn');
    const cancelBtn = document.getElementById('telegramCancelBtn');
    const closeBtn = document.getElementById('telegramModalClose');
    const TG_URL = 'https://t.me/andreimetro1289';

    function openModal(e) {
        if (e) e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Кнопка «Перейти в канал» — открывает Telegram и закрывает окно
    goBtn.addEventListener('click', () => {
        window.open(TG_URL, '_blank', 'noopener');
        closeModal();
    });

    // «Отмена» и «×»
    cancelBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);

    // Клик по фону
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    // Привязка ко всем ссылкам, ведущим в канал
    document.querySelectorAll('a[href*="andreimetro1289"], .js-telegram-link').forEach(link => {
        link.addEventListener('click', openModal);
    });

    // Глобальный вызов, если нужно вручную
    window.openTelegramModal = openModal;
})();



// Функция для точного скролла к секции
function scrollToSection(id) {
    let element = document.getElementById(id);
    
    // Если не нашли по ID, ищем по заголовку
    if (!element) {
        const headers = document.querySelectorAll('h2');
        for (let h of headers) {
            if (h.textContent.toLowerCase().includes(id)) {
                element = h.closest('section');
                break;
            }
        }
    }

    if (!element) return;
    
    const headerHeight = 80; 
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    
    // 'instant' или 'auto' полностью отключает плавную прокрутку
    window.scrollTo({
        top: elementPosition - headerHeight,
        behavior: 'smooth' 
    });
}

// ============================================================
// СКРЫТИЕ НЕРАБОЧЕГО EMAIL info@tepp.ru
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    // Ищем все элементы, содержащие этот текст
    const elements = document.querySelectorAll('p, div, span, a');
    
    elements.forEach(el => {
        if (el.textContent.includes('info@tepp.ru')) {
            // Если это ссылка <a> с этим email, скрываем её
            if (el.tagName === 'A' || el.getAttribute('href')?.includes('info@tepp.ru')) {
                el.style.display = 'none';
            } 
            // Если это параграф <p> (как в футере), скрываем его
            else if (el.tagName === 'P' && el.textContent.trim() === '📧 info@tepp.ru') {
                el.style.display = 'none';
            }
        }
    });
});

document.querySelectorAll('.main-nav a').forEach(link => {
    // Запрещаем перетаскивание ссылок (частая причина глюков)
    link.setAttribute('draggable', 'false'); 
    
    link.addEventListener('mouseup', function(e) {
        // Клик срабатывает только когда кнопка мыши отпущена
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            const id = href.substring(1);
            scrollToSection(id);
        } else if (href && href.includes('.html')) {
            // Если это переход на другую страницу
            window.location.href = href;
        }
    });
});



document.addEventListener('copy', function(e) {
    const selection = document.getSelection();
    if (selection.toString().length > 50) { // Если копируют больше 50 символов
        const link = '\n\nИсточник: Транспортная энциклопедия постсоветского пространства (ТЭПП) — ' + window.location.href;
        e.clipboardData.setData('text/plain', selection.toString() + link);
        e.preventDefault();
    }
});


// ============================================================
// УМНЫЙ ПЕРЕХОД: Если ссылка ведет на Главная_страница.html,
// а файл переименован в index.html, мы это исправляем на лету.
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        let href = link.getAttribute('href');
        // Если ссылка ведет на Главная_страница.html
        if (href === 'Главная_страница.html') {
            // Меняем её на index.html
            link.setAttribute('href', 'index.html');
        }
    });
});

// ============================================================
// ЭФФЕКТ «ЦИФРОВОЙ ДОЖДЬ» ДЛЯ ТЕМЫ «МАТРИЦА»
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    // Создаем контейнер для дождя
    const rainContainer = document.createElement('div');
    rainContainer.id = 'matrix-rain';
    rainContainer.style.position = 'fixed';
    rainContainer.style.top = '0';
    rainContainer.style.left = '0';
    rainContainer.style.width = '100%';
    rainContainer.style.height = '100%';
    rainContainer.style.pointerEvents = 'none'; // Чтобы не мешал кликать
    rainContainer.style.zIndex = '-1'; // Позади всего
    rainContainer.style.overflow = 'hidden';
    rainContainer.style.display = 'none'; // По умолчанию скрыт
    document.body.appendChild(rainContainer);

    // Функция генерации капель
    function createRain() {
        if (document.documentElement.getAttribute('data-theme') !== 'night') {
            rainContainer.style.display = 'none';
            rainContainer.innerHTML = ''; // Очищаем, если тема не матрица
            return;
        }
        
        rainContainer.style.display = 'block';
        rainContainer.innerHTML = ''; // Очищаем перед генерацией

        const columns = Math.floor(window.innerWidth / 20); // Количество колонок
        for (let i = 0; i < columns; i++) {
            const drop = document.createElement('div');
            drop.textContent = Math.random() > 0.5 ? '1' : '0'; // Случайно 1 или 0
            drop.style.position = 'absolute';
            drop.style.top = '-20px';
            drop.style.left = (i * 20) + 'px';
            drop.style.color = '#00ff00';
            drop.style.fontFamily = 'monospace';
            drop.style.fontSize = '18px';
            drop.style.opacity = Math.random() * 0.5 + 0.2; // Случайная прозрачность
            drop.style.textShadow = '0 0 5px #00ff00';
            
            // Анимация падения
            const duration = Math.random() * 3 + 2; // От 2 до 5 секунд
            const delay = Math.random() * 5; // Задержка старта
            
            drop.animate([
                { transform: `translateY(0)`, opacity: drop.style.opacity },
                { transform: `translateY(${window.innerHeight + 50}px)`, opacity: 0 }
            ], {
                duration: duration * 1000,
                delay: delay * 1000,
                iterations: Infinity,
                easing: 'linear'
            });

            rainContainer.appendChild(drop);
        }
    }

    // Запускаем дождь при смене темы и при загрузке
    createRain();

    // Следим за сменой темы (если пользователь переключит обратно на светлую)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'data-theme') {
                createRain();
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
});