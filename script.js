// ============================================================
// ИНИЦИАЛИЗАЦИЯ ЧАСТИЦ
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
// ГЛАВНЫЙ ЗАПУСК
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('leaf-container')) {
        const leafContainer = document.createElement('div');
        leafContainer.id = 'leaf-container';
        document.body.appendChild(leafContainer);
    }
    if (!document.getElementById('rain-container')) {
        const rainContainer = document.createElement('div');
        rainContainer.id = 'rain-container';
        document.body.appendChild(rainContainer);
    }

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
    setupTelegramModal();
    setupAutumnLeaves();
    setupAutumnRain();
});

// ============================================================
// НАСТРОЙКИ (ИСПРАВЛЕНО: БЕЗ ДУБЛИРУЮЩЕЙ КНОПКИ)
// ============================================================
function initSettings() {
    // Если меню уже есть — не создаем
    if (document.getElementById('settingsDropdown')) return;

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

    // Создаем ТОЛЬКО выпадающее меню, без кнопки
    const dropdownHTML = `
        <div class="settings-dropdown" id="settingsDropdown">
            <div class="settings-section">
                <span class="settings-label">🌈 Тема</span>
                <div class="settings-options" id="themeOptions">
                    <button class="theme-btn" data-theme="light" onclick="setTheme('light')" title="Светлая">☀️</button>
                    <button class="theme-btn" data-theme="dark" onclick="setTheme('dark')" title="Тёмная">🌇</button>
                    <button class="theme-btn" data-theme="poster" onclick="setTheme('poster')" title="Советский плакат">☭</button>
                    <button class="theme-btn" data-theme="night" onclick="setTheme('night')" title="Матрица">👨‍💻</button>
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
    `;
    document.body.insertAdjacentHTML('beforeend', dropdownHTML);
    loadSettings();
}

function toggleSettings() {
    const dropdown = document.getElementById('settingsDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        // Позиционируем меню под кнопкой в верхней панели
        const btn = document.querySelector('.top-settings-btn');
        if (btn && dropdown.classList.contains('active')) {
            const rect = btn.getBoundingClientRect();
            dropdown.style.position = 'fixed';
            dropdown.style.top = (rect.bottom + 5) + 'px';
            dropdown.style.right = (window.innerWidth - rect.right) + 'px';
        }
    }
}

function closeSettings() {
    const dropdown = document.getElementById('settingsDropdown');
    if (dropdown) dropdown.classList.remove('active');
}

document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('settingsDropdown');
    const btn = document.querySelector('.top-settings-btn');
    if (dropdown && btn && !dropdown.contains(e.target) && !btn.contains(e.target)) {
        closeSettings();
    }
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
            ? '💡 Хотите больше рекомендаций? Зайдите в <span onclick="document.querySelector(\'.top-settings-btn\')?.click()">⚙️ Настройки</span> и переключите режим на «Случайный + Поиск»'
            : '💡 Хотите вернуться к разделам? Зайдите в <span onclick="document.querySelector(\'.top-settings-btn\')?.click()">⚙️ Настройки</span> и переключите режим на «Познавательный»';
    }
}

function applyPageMode(mode) {
    const gallery = document.getElementById('gallery');
    if (mode === 'gallery') {
        document.querySelectorAll('.section-card:not(#gallery)').forEach(el => el.style.display = 'none');
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
        modeHint.textContent = mode === 'standard' ? 'Текущий режим: Познавательный' : 'Текущий режим: Фотогалерея';
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
    }, 100);
}

// ============================================================
// UI И СКРОЛЛ
// ============================================================
function setupSmoothScroll() {
    document.querySelectorAll('.main-nav a, .footer-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 90; 
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
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

function setupHideHeaderOnScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('header-hidden');
        } else {
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
    let isScrollingViaMenu = false;
    window.addEventListener('menuScrollStarted', () => {
        isScrollingViaMenu = true;
        setTimeout(() => { isScrollingViaMenu = false; }, 1000);
    });

    const observer = new IntersectionObserver(entries => {
        if (isScrollingViaMenu) return;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.section-card, .hero').forEach(s => observer.observe(s));
}

// ============================================================
// ГАЛЕРЕЯ (МОДАЛЬНОЕ ОКНО)
// ============================================================
function setupGallery() {
    const modal = document.getElementById('galleryModal');
    if (!modal) return;
    const content = document.getElementById('galleryModalContent');
    const close = document.getElementById('galleryModalClose');

    // Обработчик для новой галереи (photo-card)
    document.querySelectorAll('.photo-thumb img').forEach(img => {
        img.addEventListener('click', function() {
            const card = this.closest('.photo-card');
            if (!card) return;

            const src = this.src;
            const alt = this.alt;
            
            // Вытаскиваем инфу из карточки
            const object = card.querySelector('.photo-object')?.textContent || '';
            const desc = card.querySelector('.photo-desc')?.textContent || '';
            const date = card.querySelector('.photo-date')?.textContent || '';
            const author = card.querySelector('.photo-author')?.textContent || '';

            if (content) {
                content.innerHTML = `
                    <img src="${src}" style="max-width:100%; max-height:60vh; border-radius:10px; display:block; margin: 0 auto;" alt="${alt}">
                    <div style="margin-top: 1.5rem; text-align: left; padding: 0 1rem;">
                        <h3 style="color: var(--accent-color); margin-bottom: 0.5rem; font-size: 1.4rem;">${object}</h3>
                        <p style="font-size: 1rem; line-height: 1.5; margin-bottom: 1rem;">${desc}</p>
                        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--text-secondary); border-top: 1px solid var(--border-color); padding-top: 1rem;">
                            <span>${date}</span>
                            <span>${author}</span>
                        </div>
                    </div>
                `;
                modal.classList.add('active');
            }
        });
    });

    // Обработчик для старых галерей (на всякий случай)
    document.querySelectorAll('.gallery-item, .random-photo-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.gallery-caption, .random-photo-caption')?.textContent || '';
            let author = item.querySelector('p')?.textContent || '';
            if (!author.trim()) author = '📸 Автор не указан';
            
            if (content && img) {
                content.innerHTML = `
                    <img src="${img.src}" style="max-width:100%; max-height:70vh; border-radius:10px;" alt="${img.alt}">
                    <p style="text-align:center; margin-top:1rem; font-size: 1.1rem;">${caption} — ${author}</p>
                `;
                modal.classList.add('active');
            }
        });
    });

    close?.addEventListener('click', () => modal.classList.remove('active'));
    window.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });
}

// ============================================================
// ПОИСК (ОБНОВЛЕННАЯ БАЗА ДАННЫХ)
// ============================================================
const SEARCH_PAGES = [
    // --- МЕТРО (Вагоны) ---
    { title: 'Вагон типа А', url: 'Type_A.html', tags: ['метро', 'мосметро', 'ашка', 'бакинское метро', 'вагон', 'тип а', 'первый'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Вагон типа Б', url: 'Type_B.html', tags: ['метро', 'мосметро', 'вагон', 'тип б', 'бэшка', 'модернизация'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Вагон типа В (трофейный)', url: 'Type_V.html', tags: ['метро', 'мосметро', 'вагон', 'вэшка', 'тип в', 'трофейный', 'берлин'], types: ['метро', 'музей'], city: 'Москва', country: 'СССР' },
    { title: 'Вагон типа Г', url: 'Type_G.html', tags: ['метро', 'мосметро', 'вагон', 'гэшник', 'тип г', 'серийный'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Вагон типа Д', url: 'Type_D.html', tags: ['метро', 'мосметро', 'вагон', 'дэшник', 'тип д', 'сцепка шарфенберга'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Вагон типа Е', url: 'Type_E.html', tags: ['метро', 'вагон', 'тип е', 'ешка'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Вагон типа Еж', url: 'Type_Ezh.html', tags: ['метро', 'вагон', 'ежик', 'еж'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Вагон типа Еж3', url: 'Type_Ezh3.html', tags: ['метро', 'вагон', 'ежик', 'еж3'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Еж3 №5946', url: 'Type_Ezh3_5946.html', tags: ['метро', 'ежик', 'еж3', '5946'], types: ['метро', 'музей'], city: 'Москва', country: 'СССР' },
    { title: 'Вагон типа Еж6', url: 'Type_Ezh6.html', tags: ['метро', 'вагон', 'еж6', 'метро-2'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Вагон типа ЕжТК', url: 'Type_EzhTK.html', tags: ['метро', 'вагон', 'ежтк', 'дизайнерский'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Вагон типа И', url: 'Type_I.html', tags: ['метро', 'вагон', 'ишник', '81-715', '81-716', 'тип и'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Вагон типа Л', url: 'Type_L.html', tags: ['метро', 'вагон', 'тип л'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'М5 — прототипы типа Д', url: 'Type_M5.html', tags: ['метро', 'мосметро', 'м5', 'ум5', 'опытный'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Вагон Д №2018 — первый с гофрами', url: 'Type_D_2018.html', tags: ['метро', 'вагон', 'тип д', '2018', 'гофры'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Трамвай R1 (макет)', url: 'Type_R1_maket.html', tags: ['трамвай', 'r1', 'макет', 'россия 1'], types: ['трамвай', 'музей'], city: 'Москва', country: 'Россия' },
    { title: '81-570/571', url: '81-570_571.html', tags: ['метро', '81-570', '81-571'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: '81-580 «ВЭКА»', url: '81-580veka.html', tags: ['метро', '81-580', 'эка', 'вэка'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: '81-717(ММЗ) №0067', url: '81-717(ММЗ)№0067.html', tags: ['метро', '81-717', 'номерной', 'ммз', '0067'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: '81-720.1 (ЛВЗ)', url: '81-720.1(ЛВЗ).html', tags: ['метро', '81-720', '81-720.1(ЛВЗ)', 'лвз', 'яуза'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: '81-720А', url: '81-720А.html', tags: ['метро', '81-720а', 'яуза'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: '0373-0379', url: '0373-0379.html', tags: ['метро', 'номерной', '0373', '0379'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: '81-717.5М (МВМ) №2550', url: '2550.html', tags: ['метро', 'мосметро', 'вагон', 'тип 81-717', '2550'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: '81-717 (ЛВЗ) №8535', url: '8535музей.html', tags: ['музей', '8535', '81-717', 'номерной'], types: ['метро', 'музей'], city: 'Москва', country: 'Россия' },
    { title: '81-714.5 №0665', url: 'Type_81-714.5_0665.html', tags: ['метро', '81-714', '0665'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: '81-717 (базовый)', url: 'Type_81-717.html', tags: ['метро', '81-717', 'номерной'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: '81-717.5', url: 'Type_81-717-5.html', tags: ['метро', '81-717.5', 'номерной'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Яуза №0021', url: 'Яуза0021.html', tags: ['метро', 'яуза', 'музейный', '81-720'], types: ['метро', 'музей'], city: 'Москва', country: 'Россия' },

    // --- МЕТРО (Спец. и уникальные) ---
    { title: 'Еж3-путеизмеритель', url: 'Еж3-путеизмеритель.html', tags: ['метро', 'ежик', 'путеизмеритель', 'служебный', 'еж3', '5824', '5564', '7374', 'путимер'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Опытный Скиф', url: 'Опытный_Скиф.html', tags: ['метро', 'скиф', 'русич', 'опытный'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Яуза 0028-0035', url: 'Живая_история_Яуза_0028-0035.html', tags: ['метро', 'яуза', 'опытный', '0028', '0035'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Московский метрополитен', url: 'Главная_Страница_Мосметро.html', tags: ['метро', 'мосметро', 'москва'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Подвижной состав Московского метро', url: 'ps_mosmetro.html', tags: ['метро', 'мосметро', 'подвижной состав'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Минский метрополитен', url: 'Minsk_metro.html', tags: ['метро', 'минск', 'беларусь'], types: ['метро'], city: 'Минск', country: 'Беларусь' },
    { title: 'Красная стрела (метро)', url: 'Красная_Стрела.html', tags: ['метро', 'именной', 'номерной', 'красная стрела'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Акварель', url: 'Акварель.html', tags: ['метро', 'акварель', 'именной', '5078'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Народный ополченец', url: 'Народный_ополченец.html', tags: ['метро', 'именной'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Опытная Ашка', url: 'Опытная_Ашка.html', tags: ['метро', 'опытный', 'а'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Опытная Ешка', url: 'Опытная_Ешка.html', tags: ['метро', 'опытный', 'е'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Опытная Ока', url: 'Опытная_Ока.html', tags: ['метро', 'опытный', 'ока'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Опытная Яуза 001-005', url: 'Опытная_Яуза_001-005.html', tags: ['метро', 'опытный', 'яуза'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Опытные составы', url: 'Опытные_составы.html', tags: ['метро', 'опытный', 'составы'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Опытный 81-717', url: 'Опытный_81-717.html', tags: ['метро', 'опытный', '81-717'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Опытный поезд 81-717.6К', url: 'Опытный_поезд_81-717.6К.html', tags: ['метро', 'опытный', '81-717.6к'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Опытный поезд И', url: 'Опытный_поезд_И.html', tags: ['метро', 'опытный', 'поезд и'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Первый номерной', url: 'Первый_номер.html', tags: ['метро', '81-717', 'первый'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Ретро поезд', url: 'Ретро поезд.html', tags: ['метро', 'ретро', 'музей'], types: ['метро', 'музей'], city: 'Москва', country: 'Россия' },
    { title: 'Скиф 0152', url: 'Скиф_0152.html', tags: ['метро', 'скиф', '0152'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Служебные поезда метро', url: 'Служебные_поезда_метро.html', tags: ['метро', 'служебные'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Табаков 0350', url: 'Табаков0350.html', tags: ['метро', 'табаков', 'номерной', 'именной'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'ТЧ-5 8712-7919-0065', url: 'ТЧ-5_8712-7919-0065.html', tags: ['метро', 'тч-5', '8712', '0065', '7919'], types: ['метро'], city: 'Москва', country: 'Россия' },

    // --- ЖД (Поезда и локомотивы) ---
    { title: 'Красная стрела (ЖД)', url: 'Красная_стрела_жд.html', tags: ['поезд', 'ржд', 'москва', 'питер'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'Полярная стрела', url: 'Полярная_стрела.html', tags: ['поезд', 'ржд', 'мурманск'], types: ['жд'], city: 'Мурманск', country: 'Россия' },
    { title: 'ЧС7', url: 'ЧС7.html', tags: ['электровоз', 'ржд', 'локомотив', 'чс7'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЧС7 в расцветке «Новопид»', url: 'ЧС7_новопид.html', tags: ['электровоз', 'ржд', 'чс7', 'новопид', 'окраска', 'красно-серый'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЧС7-199', url: 'ЧС7_199.html', tags: ['электровоз', 'ржд', 'ЧС7 №199', 'ЧС7', 'звезда'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЭП2К', url: 'ЭП2К.html', tags: ['электровоз', 'ржд', 'эп2к'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЧС6', url: 'ЧС6.html', tags: ['электровоз', 'ржд', 'ЧС', 'ЧС6'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЧС6 №025 "Заводской"', url: 'CHS6-025.html', tags: ['электровоз', 'ржд', '025', 'ЧС', 'ЧС6 №025', 'ЧС6-025', 'ЧС6'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЭП2К-500', url: 'ЭП2К-500.html', tags: ['электровоз', 'ржд', 'эп2к', 'юбилейный'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЭП2К-510/511', url: 'ЭП2К-510.html', tags: ['электровоз', 'ржд', 'эп2к', 'красная стрела'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЭД4(М-МК)', url: 'ЭД4(М-МК).html', tags: ['электричка', 'эд4', 'мк'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЭД4-0010', url: 'ЭД4-0010.html', tags: ['электричка', 'эд4', '0010'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЭД4МКУ', url: 'эд4мку.html', tags: ['электричка', 'эд4мку'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'Электровозы', url: 'Электровозы.html', tags: ['жд', 'электровозы'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'Поезд Деда Мороза', url: 'ПДМ_ЖД.html', tags: ['поезд', 'ржд', 'новый год'], types: ['жд'], city: 'Москва', country: 'Россия' },

    // --- Трамваи ---
    { title: 'МТВ-82 №1075', url: 'МТВ-82 №1075.html', tags: ['трамвай', 'мтв', 'музей'], types: ['трамвай', 'музей'], city: 'Москва', country: 'Россия' },
    { title: 'Конка 1872 года №35', url: 'Конка_1872_года_35.html', tags: ['конка', 'трамвай', 'история'], types: ['трамвай', 'музей'], city: 'Москва', country: 'Россия' },
    { title: 'СВАРЗ №3130', url: 'Двухосный моторный СВАРЗ №3130.html', tags: ['трамвай', 'сварз', 'грузовой'], types: ['трамвай', 'музей'], city: 'Москва', country: 'Россия' },
    { title: 'Tatra T3SU №5993', url: 'Tatra T3SU №5993.html', tags: ['трамвай', 'татра', 'tatra'], types: ['трамвай', 'музей'], city: 'Москва', country: 'Россия' },
    { title: 'Трамвай 71-135 №3001', url: '71-135 № 3001.html', tags: ['трамвай', 'москва'], types: ['трамвай'], city: 'Москва', country: 'Россия' },

    // --- Автобусы ---
    { title: 'ЗИС-8', url: 'ЗИС-8.html', tags: ['автобус', 'зис', 'история'], types: ['автобус'], city: 'Москва', country: 'СССР' },
    { title: 'ЗИС-154', url: 'ЗИС-154.html', tags: ['автобус', 'зис', 'история'], types: ['автобус'], city: 'Москва', country: 'СССР' },
    { title: 'ЗИС-155', url: 'ЗИС-155.html', tags: ['автобус', 'зис', 'история'], types: ['автобус'], city: 'Москва', country: 'СССР' },
    { title: 'ЗИЛ-158', url: 'ЗИЛ-158.html', tags: ['автобус', 'зил', 'история'], types: ['автобус'], city: 'Москва', country: 'СССР' },
    { title: 'Ikarus 55', url: 'Ikarus 55.html', tags: ['автобус', 'икарус'], types: ['автобус'], city: 'Москва', country: 'СССР' },
    { title: 'Ikarus 180', url: 'Ikarus 180.html', tags: ['автобус', 'икарус'], types: ['автобус'], city: 'Москва', country: 'СССР' },
    { title: 'Ikarus 280', url: 'Ikarus 280.html', tags: ['автобус', 'икарус'], types: ['автобус'], city: 'Москва', country: 'СССР' },
    { title: 'ЛАЗ-695 Львов', url: 'LAZ-695_Lvov_mus.html', tags: ['автобус', 'лаз'], types: ['автобус', 'музей'], city: 'Львов', country: 'СССР' },
    { title: 'ЛиАЗ-677', url: 'LiAZ-677.html', tags: ['автобус', 'лиаз'], types: ['автобус'], city: 'Москва', country: 'СССР' },

    // --- Монорельс и прочее ---
    { title: 'Московский монорельс', url: 'Монорельс.html', tags: ['монорельс', 'москва'], types: ['монорельс'], city: 'Москва', country: 'Россия' },
    { title: 'История монорельса', url: 'Монорельс_история.html', tags: ['монорельс', 'история'], types: ['монорельс'], city: 'Москва', country: 'Россия' },
    { title: 'Монорельс ПС', url: 'Монорельс_ПС.html', tags: ['монорельс', 'пс'], types: ['монорельс'], city: 'Москва', country: 'Россия' },
    { title: 'Монорельс «Стрела»', url: 'Монорельс_Стрела.html', tags: ['монорельс', 'стрела', 'подмосковье'], types: ['монорельс'], city: 'Москва', country: 'Россия' },
    { title: 'Канатная дорога Алма-Аты', url: 'Almata-kd.html', tags: ['канатная', 'алматы', 'казахстан'], types: ['монорельс'], city: 'Алма-Ата', country: 'Казахстан' },

    // --- Разное и Музеи ---
    { title: 'Музеи транспорта', url: 'Музеи_транспорта.html', tags: ['музей', 'транспорт', 'экспозиция'], types: ['музей'], city: 'Москва', country: 'Россия' },
    { title: 'Музей Транспорта Москвы', url: 'МузейТранспортаМосквы.html', tags: ['музей', 'москва', 'транспорт'], types: ['музей'], city: 'Москва', country: 'Россия' },
    { title: 'Легенды и мифы метро', url: 'Легенды_и_мифы_метро.html', tags: ['метро', 'легенды', 'мифы'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Парад поездов', url: 'Парад_метро_Москвы.html', tags: ['парад', 'метро', 'мероприятие'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'История Московского метро', url: 'Метро_Мск_история.html', tags: ['метро', 'история', 'москва'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Живая история метро', url: 'Живая_история_Мск_метро.html', tags: ['метро', 'живая история'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Ушедшие в историю', url: 'Ушедшие_в_историю_метро.html', tags: ['метро', 'утраченные', 'история'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Грузовые вагоны метро', url: 'Грузовые_вагоны.html', tags: ['метро', 'грузовые', 'служебные'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'ДК1 «Синергия-1»', url: 'ДК1_метро.html', tags: ['метро', 'диагностика'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'ДК2 «Синергия-2»', url: 'ДК2_метро.html', tags: ['метро', 'диагностика'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Железная дорога', url: 'Железная_дорога.html', tags: ['жд', 'железная дорога'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'Локомотивы', url: 'Локомотивы.html', tags: ['жд', 'локомотивы'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'Моссаб трафик', url: 'Моссаб_трафик.html', tags: ['моссаб', 'трафик'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'Городской транспорт', url: 'city_transport.html', tags: ['город', 'транспорт'], types: ['автобус'], city: 'Москва', country: 'Россия' },
    { title: 'Беспилотное такси (Яндекс)', url: 'bespilot_auto_Yandex_toyata_prios.html', tags: ['беспилотное', 'такси', 'яндекс'], types: ['автобус'], city: 'Москва', country: 'Россия' },
    { title: 'Беспилотная Москва 2024', url: 'bespilotm24.html', tags: ['метро', 'беспилотная', 'москва'], types: ['метро'], city: 'Москва', country: 'Россия' },

    // --- Твои новые файлы из папки ---
    { title: 'Ушедшие в историю (метро)', url: 'Ушедшие_в_историю_метро.html', tags: ['метро', 'история'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'ЧС6', url: 'ЧС6.html', tags: ['жд', 'чс6'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЧС7', url: 'ЧС7.html', tags: ['жд', 'чс7'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЧС7-199', url: 'ЧС7_199.html', tags: ['жд', 'чс7'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЭД4 (М-МК)', url: 'ЭД4(М-МК).html', tags: ['жд', 'эд4'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЭД4-0010', url: 'ЭД4-0010.html', tags: ['жд', 'эд4'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЭД4МКУ', url: 'эд4мку.html', tags: ['жд', 'эд4мку'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'Электровозы', url: 'Электровозы.html', tags: ['жд', 'электровозы'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЭП2К', url: 'ЭП2К.html', tags: ['жд', 'эп2к'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЭП2К-500', url: 'ЭП2К-500.html', tags: ['жд', 'эп2к'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЭП2К-510', url: 'ЭП2К-510.html', tags: ['жд', 'эп2к'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'Яуза 0021', url: 'Яуза0021.html', tags: ['метро', 'яуза'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Бесфонарный №932', url: '«Бесфонарный»_№932.html', tags: ['метро', '932'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: '81-570/571', url: '81-570_571.html', tags: ['метро', '81-570'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: '81-580 Века', url: '81-580veka.html', tags: ['метро', '81-580'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: '81-717 (ММЗ) №0067', url: '81-717(ММЗ)№0067.html', tags: ['метро', '81-717'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: '81-720.1 (ЛВЗ)', url: '81-720.1(ЛВЗ).html', tags: ['метро', '81-720'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: '81-720А', url: '81-720А.html', tags: ['метро', '81-720а'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: '0373-0379', url: '0373-0379.html', tags: ['метро', '0373'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: '404', url: '404_file_dont_found.html', tags: ['404', 'ошибка'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: '2550', url: '2550.html', tags: ['метро', '2550'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: '8535 (музей)', url: '8535музей.html', tags: ['метро', '8535'], types: ['метро', 'музей'], city: 'Москва', country: 'Россия' },
    { title: 'О проекте', url: 'about_project.html', tags: ['проект', 'инфо'], types: ['музей'], city: 'Москва', country: 'Россия' },
    { title: 'Ачивки Мосметро', url: 'ach_mosmetro.html', tags: ['метро', 'ачивки'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'AGMy-13137', url: 'AGMy-13137.html', tags: ['метро', 'агмы'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Алматы КД', url: 'Almata-kd.html', tags: ['алматы', 'канатка'], types: ['монорельс'], city: 'Алма-Ата', country: 'Казахстан' },
    { title: 'Беспилотная Москва 2024', url: 'bespilotm24.html', tags: ['метро', 'беспилотная'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Беспилотное такси', url: 'bespilot_auto_Yandex_toyata_prios.html', tags: ['такси', 'беспилотное'], types: ['автобус'], city: 'Москва', country: 'Россия' },
    { title: 'ЧС6-025', url: 'CHS6-025.html', tags: ['жд', 'чс6'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЧС7 Новопид', url: 'CHs7-novopid.html', tags: ['жд', 'чс7'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ЧС7 Заводской', url: 'CHs7-zavod.html', tags: ['жд', 'чс7'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'Городской транспорт', url: 'city_transport.html', tags: ['город', 'транспорт'], types: ['автобус'], city: 'Москва', country: 'Россия' },
    { title: 'Daimler Omnibus 1 T', url: 'Daimler Omnibus 1 T.html', tags: ['автобус', 'daimler'], types: ['автобус'], city: 'Москва', country: 'Россия' },
    { title: 'Electrotrainzhd', url: 'Electrotrainzhd.html', tags: ['жд', 'электричка'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'Элементы 81-717', url: 'elemen_in_81-717.html', tags: ['метро', '81-717'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'ЭП2К ТЧЭ-3 Барабинск', url: 'EP2K_tche3_barabinsk.html', tags: ['жд', 'эп2к'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'ГАЗ-32213', url: 'gaz-32213.html', tags: ['автобус', 'газ'], types: ['автобус'], city: 'Москва', country: 'Россия' },
    { title: 'Ikarus 55', url: 'Ikarus 55.html', tags: ['автобус', 'икарус'], types: ['автобус'], city: 'Москва', country: 'Россия' },
    { title: 'Ikarus 180', url: 'Ikarus 180.html', tags: ['автобус', 'икарус'], types: ['автобус'], city: 'Москва', country: 'Россия' },
    { title: 'Ikarus 280', url: 'Ikarus 280.html', tags: ['автобус', 'икарус'], types: ['автобус'], city: 'Москва', country: 'Россия' },
    { title: 'Главная', url: 'index.html', tags: ['главная'], types: ['музей'], city: 'Москва', country: 'Россия' },
    { title: 'ЛАЗ-695 Львов', url: 'LAZ-695_Lvov_mus.html', tags: ['автобус', 'лаз'], types: ['автобус'], city: 'Львов', country: 'СССР' },
    { title: 'ЛиАЗ-677', url: 'LiAZ-677.html', tags: ['автобус', 'лиаз'], types: ['автобус'], city: 'Москва', country: 'СССР' },
    { title: 'М19 65000', url: 'M19_65000.html', tags: ['метро', 'м19'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Матрёшка', url: 'Matreshka.html', tags: ['поезд', 'матрёшка'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'Минск Метро', url: 'Minsk_metro.html', tags: ['метро', 'минск'], types: ['метро'], city: 'Минск', country: 'Беларусь' },
    { title: 'Музей Транспорта Москвы', url: 'musiem_transport_moscov-1.html', tags: ['музей', 'москва'], types: ['музей'], city: 'Москва', country: 'Россия' },
    { title: 'НГ Еж3', url: 'ng_Ezh3.html', tags: ['метро', 'еж3'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Опыт G', url: 'Opit_G.html', tags: ['метро', 'опыт'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'ПС Мосметро', url: 'ps_mosmetro.html', tags: ['метро', 'пс'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'RAF-976', url: 'RAF-976.html', tags: ['автобус', 'раф'], types: ['автобус'], city: 'Москва', country: 'Россия' },
    { title: 'Tatra T3SU №5993', url: 'Tatra T3SU №5993.html', tags: ['трамвай', 'татра'], types: ['трамвай'], city: 'Москва', country: 'Россия' },
    { title: 'Type 81-714.5 0665', url: 'Type_81-714.5_0665.html', tags: ['метро', '81-714'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Type 81-717', url: 'Type_81-717.html', tags: ['метро', '81-717'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Type 81-717-5', url: 'Type_81-717-5.html', tags: ['метро', '81-717'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Type A', url: 'Type_A.html', tags: ['метро', 'а'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Type B', url: 'Type_B.html', tags: ['метро', 'б'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Type D', url: 'Type_D.html', tags: ['метро', 'д'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Type E', url: 'Type_E.html', tags: ['метро', 'е'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Type Ezh', url: 'Type_Ezh.html', tags: ['метро', 'еж'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Type Ezh3', url: 'Type_Ezh3.html', tags: ['метро', 'еж3'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Type Ezh6', url: 'Type_Ezh6.html', tags: ['метро', 'еж6'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Type EzhTK', url: 'Type_EzhTK.html', tags: ['метро', 'ежтк'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Type G', url: 'Type_G.html', tags: ['метро', 'г'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Type G 661', url: 'Type_G_661.html', tags: ['метро', 'г'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Type L', url: 'Type_L.html', tags: ['метро', 'л'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Type M5', url: 'Type_M5.html', tags: ['метро', 'м5'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Type R1 Maket', url: 'Type_R1_maket.html', tags: ['трамвай', 'r1'], types: ['трамвай'], city: 'Москва', country: 'Россия' },
    { title: 'Type V', url: 'Type_V.html', tags: ['метро', 'в'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Type V 158', url: 'Type_V_158.html', tags: ['метро', 'в'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'YTB-3', url: 'YTB-3.html', tags: ['метро', 'ytb'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Акварель', url: 'Акварель.html', tags: ['метро', 'акварель'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'АПЛ Уники', url: 'АПЛ_уники.html', tags: ['метро', 'апл'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Ашка', url: 'Ашка.html', tags: ['метро', 'ашка'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Баклан', url: 'Баклан.html', tags: ['метро', 'баклан'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'БКЛ Уники', url: 'БКЛ_уники.html', tags: ['метро', 'бкл'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'БутЛ Уники', url: 'БутЛ_уники.html', tags: ['метро', 'бутл'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Г530', url: 'Г530.html', tags: ['метро', 'г530'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Главная метро', url: 'Главная_метро.html', tags: ['метро', 'главная'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Главная страница Мосметро', url: 'Главная_Страница_Мосметро.html', tags: ['метро', 'главная'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Грузовые вагоны', url: 'Грузовые_вагоны.html', tags: ['метро', 'грузовые'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Двухосный моторный СВАРЗ №3130', url: 'Двухосный моторный СВАРЗ №3130.html', tags: ['трамвай', 'сварз'], types: ['трамвай'], city: 'Москва', country: 'СССР' },
    { title: 'ДК1 метро', url: 'ДК1_метро.html', tags: ['метро', 'дк1'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'ДК2 метро', url: 'ДК2_метро.html', tags: ['метро', 'дк2'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Еж3-путеизмеритель', url: 'Еж3-путеизмеритель.html', tags: ['метро', 'еж3'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Железная дорога', url: 'Железная_дорога.html', tags: ['жд', 'железная дорога'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'Живая история Мск метро', url: 'Живая_история_Мск_метро.html', tags: ['метро', 'история'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Живая история Яуза 0028-0035', url: 'Живая_история_Яуза_0028-0035.html', tags: ['метро', 'яуза'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'ЗИЛ-158', url: 'ЗИЛ-158.html', tags: ['автобус', 'зил'], types: ['автобус'], city: 'Москва', country: 'СССР' },
    { title: 'ЗИС-8', url: 'ЗИС-8.html', tags: ['автобус', 'зис'], types: ['автобус'], city: 'Москва', country: 'СССР' },
    { title: 'ЗИС-154', url: 'ЗИС-154.html', tags: ['автобус', 'зис'], types: ['автобус'], city: 'Москва', country: 'СССР' },
    { title: 'ЗИС-155', url: 'ЗИС-155.html', tags: ['автобус', 'зис'], types: ['автобус'], city: 'Москва', country: 'СССР' },
    { title: 'ЗЛ Уники', url: 'ЗЛ_уники.html', tags: ['метро', 'зл'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Конка 1872 года 35', url: 'Конка_1872_года_35.html', tags: ['трамвай', 'конка'], types: ['трамвай'], city: 'Москва', country: 'СССР' },
    { title: 'Красная Стрела', url: 'Красная_Стрела.html', tags: ['метро', 'красная стрела'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Красная стрела жд', url: 'Красная_стрела_жд.html', tags: ['жд', 'красная стрела'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'КСЛ Уники', url: 'КСЛ_уники.html', tags: ['метро', 'ксл'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Курская дуга метро', url: 'Курская_дуга_метро.html', tags: ['метро', 'курская дуга'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'ЛДЛ Уники', url: 'ЛДЛ_уники.html', tags: ['метро', 'лдл'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Легенды и мифы метро', url: 'Легенды_и_мифы_метро.html', tags: ['метро', 'легенды'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Локомотивы', url: 'Локомотивы.html', tags: ['жд', 'локомотивы'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'Мероприятия метро', url: 'Мероприятия_метро.html', tags: ['метро', 'мероприятия'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Метро Мск история', url: 'Метро_Мск_история.html', tags: ['метро', 'история'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Монорельс', url: 'Монорельс.html', tags: ['монорельс'], types: ['монорельс'], city: 'Москва', country: 'Россия' },
    { title: 'Монорельс история', url: 'Монорельс_история.html', tags: ['монорельс', 'история'], types: ['монорельс'], city: 'Москва', country: 'Россия' },
    { title: 'Монорельс ПС', url: 'Монорельс_ПС.html', tags: ['монорельс', 'пс'], types: ['монорельс'], city: 'Москва', country: 'Россия' },
    { title: 'Монорельс Стрела', url: 'Монорельс_Стрела.html', tags: ['монорельс', 'стрела'], types: ['монорельс'], city: 'Москва', country: 'Россия' },
    { title: 'Моссаб трафик', url: 'Моссаб_трафик.html', tags: ['моссаб'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'Мск жд', url: 'Мск_жд.html', tags: ['жд', 'москва'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'МТВ-82 №1075', url: 'МТВ-82 №1075.html', tags: ['трамвай', 'мтв'], types: ['трамвай'], city: 'Москва', country: 'СССР' },
    { title: 'Музеи транспорта', url: 'Музеи_транспорта.html', tags: ['музей'], types: ['музей'], city: 'Москва', country: 'Россия' },
    { title: 'Музей Транспорта Москвы', url: 'МузейТранспортаМосквы.html', tags: ['музей'], types: ['музей'], city: 'Москва', country: 'Россия' },
    { title: 'Народный ополченец', url: 'Народный_ополченец.html', tags: ['метро', 'народный ополченец'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'НГ метро', url: 'нг_метро.html', tags: ['метро', 'нг'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'НГ номер', url: 'НГ_номер.html', tags: ['метро', 'нг'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'НГ Фили е 2004', url: 'нг_Фили_е_2004.html', tags: ['метро', 'нг'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'НГ Фили Скиф 2005', url: 'нг_Фили_Скиф_2005.html', tags: ['метро', 'нг'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Опытная Ашка', url: 'Опытная_Ашка.html', tags: ['метро', 'опыт'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Опытная Ешка', url: 'Опытная_Ешка.html', tags: ['метро', 'опыт'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Опытная Ока', url: 'Опытная_Ока.html', tags: ['метро', 'опыт'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Опытная Яуза 001-005', url: 'Опытная_Яуза_001-005.html', tags: ['метро', 'опыт'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Опытные составы', url: 'Опытные_составы.html', tags: ['метро', 'опыт'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Опытный 81-717', url: 'Опытный_81-717.html', tags: ['метро', 'опыт'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Опытный поезд 81-717.6К', url: 'Опытный_поезд_81-717.6К.html', tags: ['метро', 'опытный', 'шестерка', '81-717.6К', '0252'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Опытный поезд И', url: 'Опытный_поезд_И.html', tags: ['метро', 'опыт'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Опытный Скиф', url: 'Опытный_Скиф.html', tags: ['метро', 'опыт'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Парад метро Москвы', url: 'Парад_метро_Москвы.html', tags: ['метро', 'парад'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Парадный 81-717', url: 'Парадный_81-717.html', tags: ['метро', 'парад'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'ПАС-6525', url: 'ПАС-6525.html', tags: ['метро', 'пас'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'ПДМ ЖД', url: 'ПДМ_ЖД.html', tags: ['жд', 'пдм'], types: ['жд'], city: 'Москва', country: 'Россия' },
    { title: 'Первый номер', url: 'Первый_номер.html', tags: ['метро', 'первый'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Ретро поезд', url: 'Ретро поезд.html', tags: ['метро', 'ретро'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Скиф 0152', url: 'Скиф_0152.html', tags: ['метро', 'скиф'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Служебные поезда метро', url: 'Служебные_поезда_метро.html', tags: ['метро', 'служебные'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'СокЛ Уники', url: 'СокЛ_уники.html', tags: ['метро', 'сокл'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Табаков0350', url: 'Табаков0350.html', tags: ['метро', 'табаков'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'ТЧ-5 8712-7919-0065', url: 'ТЧ-5_8712-7919-0065.html', tags: ['метро', 'тч-5'], types: ['метро'], city: 'Москва', country: 'Россия' },
    { title: 'Tatra T3SU №5993', url: 'Tatra T3SU №5993.html', tags: ['трамвай', 'татра'], types: ['трамвай'], city: 'Москва', country: 'Россия' },
];

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

        if (filterInfo) filterInfo.innerHTML = `Найдено: <strong>${matches.length}</strong>`;
        results.classList.add('active');
    }

    searchBtn?.addEventListener('click', applyFilters);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyFilters();
        }
    });
    filterType?.addEventListener('change', applyFilters);
    filterCity?.addEventListener('change', applyFilters);
    filterCountry?.addEventListener('change', applyFilters);

    document.addEventListener('click', e => {
        const container = document.querySelector('.search-filters');
        if (container && !container.contains(e.target) && !results.contains(e.target)) {
            results.classList.remove('active');
        }
    });
}

// ============================================================
// СЛУЧАЙНЫЕ РЕКОМЕНДАЦИИ
// ============================================================
let updateRandomRecommendations = null;

function setupRandomRecommendations() {
    const container = document.getElementById('randomPages');
    const photoContainer = document.getElementById('randomPhoto');
    if (!container || !photoContainer) return;

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

    const photos = [
        { src: 'Type_A_1.jpeg', caption: 'Вагон типа А № 1', author: 'pfandrom' },
        { src: 'Type_A_1001.jpg', caption: 'Вагон типа А № 1001', author: 'andzis (transphoto)' },
        { src: 'Type_A_film.jpg', caption: 'Вагон типа А в кино', author: 'кадр из фильма "Битва за Москву"' },
        { src: 'Type_A_1_yellow.jpeg', caption: 'Вагон типа А в 1995 году', author: 'Александр Шанин (transphoto)' },
        { src: 'Type_A_int2.jpg', caption: 'Салон вагона типа А (2006)', author: 'Климова Валентина Ивановна' },
        { src: 'Type_G_530.jpg', caption: 'Вагон типа Г № 530', author: 'pfandrom' },
        { src: 'M5_806.jpg', caption: 'УМ5 № 806', author: 'ER2-1017' },
        { src: 'M5_806_int.jpg', caption: 'Салон УМ5 № 806', author: 'Lasselan' },
        { src: '760A_gagarin.jpg', caption: '81-760А на Минской', author: 'Сергей Лапин' },
        { src: '760A_int.jpg', caption: 'Салон 81-760А', author: 'Solidolych' },
        { src: '75488.jpg', caption: '81-775.2 «Москва-2026»', author: 'Артём Алмазов (transphoto)' },
        { src: '5824_int.jpg', caption: 'Интерьер Еж3 № 5824', author: 'pfandrom' },
        { src: '6719_int.jpg', caption: 'Интерьер вагона № 6719', author: 'pfandrom' },
        { src: '81-580.jpg', caption: '81-580 ВЭКА', author: 'Артём Алмазов' },
        { src: '81-580_int.jpg', caption: 'Салон 81-580', author: 'Kr1p' },
        { src: '720.1_3.jpg', caption: '81-720.1', author: 'metro.vpeterburge.ru' },
        { src: '720.1_5.jpg', caption: '81-721.1 № 11027', author: 'Андрей Комаров' },
        { src: '720.1_10.jpg', caption: '81-720.1 № 10037, пульт', author: 'Андрей Комаров' },
        { src: '720.1_17.jpg', caption: '81-720.1, салон', author: 'metro.vpeterburge.ru' },
        { src: '720onzavod.png', caption: '81-720.1 на заводе', author: 'metro.vpeterburge.ru' },
        { src: 'pult_exs_720lvz.jpg', caption: 'Пульт экстренной связи', author: 'Андрей Комаров' },
        { src: 'zavod720lvz.jpg', caption: 'Табличка 81-720.1', author: 'Андрей Комаров' },
        { src: 'Oka_LDL.jpg', caption: '«Ока» на ЛДЛ', author: 'Lasselan (TransPhoto)' },
        { src: 'Акварель_1.jpg', caption: 'Состав «Акварель»', author: 'Александр Марьянович' },
        { src: 'дк2.jpg', caption: 'ДК2', author: 'pfandrom' },
        { src: 'ДК-2сопр.jpg', caption: 'ДК-2', author: 'pfandrom' },
        { src: 'Город_Для_Людей_Музей.jpg', caption: 'Музей Транспорта Москвы', author: 'new.mtmuseum.ru' },
        { src: 'Устройство_Станции.jpg', caption: 'Раздел «Устройство станции»', author: 'new.mtmuseum.ru' },
        { src: '0665.jpg', caption: 'Вагон 0665', author: 'LASTOR_F' },
        { src: '1887.jpg', caption: 'Рыжий пластик в вагоне 1887', author: 'pfandrom' },
        { src: '23591.jpg', caption: 'Голубой пластик в вагоне 23591', author: 'pfandrom' },
        { src: '11119.jpg', caption: 'Голубой пластик в вагоне 11119', author: 'pfandrom' },
        { src: '10142_int.jpg', caption: 'Бордовые диваны в вагоне 10142', author: 'tomatikwwr' },
        { src: 'sud_Yauza_81-714.jpg', caption: 'Сиденья от Яузы в вагоне 1598', author: 'pfandrom' },
        { src: '8535_museum.jpg', caption: '81-717 (ЛВЗ) №8535', author: 'pfandrom' },
        { src: '8535_imba.jpg', caption: 'Вагон №8535 с уровня платформы', author: 'pfandrom' },
        { src: '0379.jpg', caption: 'Вагон 0379 с трёхцветной маской', author: 'Gleb5564(transphoto)' },
        { src: 'Type_B_ploshad_sverlova.jpg', caption: 'Вагон Б на станции Площадь Свердлова', author: 'Трёхгранка' },
        { src: '0021_int.jpg', caption: 'Интерьер Яузы №0021', author: 'Transport_moscow' },
        { src: '37002_int.jpg', caption: 'Интерьер вагона 37002', author: 'Mr.Den' },
        { src: '0065_внешка.jpg', caption: 'Вагон 0065, внешний вид', author: 'Транспортник Москвы / Вова' },
        { src: '0065_int.jpg', caption: 'Вагон 0065, интерьер', author: 'Welder' },
        { src: '8712.jpg', caption: 'Вагон 8712', author: 'Welder' },
        { src: '8712_int2026.jpg', caption: 'Вагон 8712, интерьер (2026)', author: 'Транспортник Москвы / Вова' },
        { src: '8712_приятность.jpg', caption: 'Вагон 8712', author: 'Транспортник Москвы / Вова' },
        { src: 'ЧС7_199.jpg', caption: 'ЧС7-199 с заводской окраской', author: 'pfandrom' },
        { src: 'ЧС7-199_звезда.jpg', caption: 'ЧС7-199 — звезда', author: 'pfandrom' },
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
        const selected = shuffle(pages).slice(0, PAGE_COUNT);
        container.innerHTML = selected.map(p =>
            `<a href="${p.url}" class="random-page-card">
                <span class="icon">${p.icon}</span>
                <span class="title">${p.title}</span>
            </a>`
        ).join('');

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
// МОДАЛКА TELEGRAM
// ============================================================
function setupTelegramModal() {
    if (document.getElementById('telegramModal')) return;

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

    goBtn.addEventListener('click', () => {
        window.open(TG_URL, '_blank', 'noopener');
        closeModal();
    });

    cancelBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    document.querySelectorAll('a[href*="andreimetro1289"], .js-telegram-link').forEach(link => {
        link.addEventListener('click', openModal);
    });
}

// ============================================================
// ОСЕННИЕ ЛИСТЬЯ
// ============================================================
function setupAutumnLeaves() {
    const container = document.getElementById('leaf-container');
    if (!container) return;

    let leafInterval = null;

    function createLeaf() {
        if (document.documentElement.getAttribute('data-theme') !== 'light') return;

        const leaf = document.createElement('div');
        leaf.classList.add('leaf');
        
        const size = Math.random() * 20 + 10;
        leaf.style.width = `${size}px`;
        leaf.style.height = `${size}px`;
        leaf.style.left = `${Math.random() * 100}vw`;
        
        const duration = Math.random() * 9 + 6;
        leaf.style.animationDuration = `${duration}s`;
        leaf.style.animationDelay = `${Math.random() * 5}s`;
        leaf.style.opacity = Math.random() * 0.5 + 0.4;

        const colors = ['#d35400', '#e67e22', '#f1c40f', '#a0522d', '#c0392b'];
        leaf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        container.appendChild(leaf);

        setTimeout(() => {
            if (leaf.parentNode) leaf.remove();
        }, (duration + 5) * 1000);
    }

    function startLeaves() {
        container.innerHTML = '';
        for (let i = 0; i < 50; i++) {
            setTimeout(createLeaf, i * 100);
        }
        if (leafInterval) clearInterval(leafInterval);
        leafInterval = setInterval(createLeaf, 100);
    }

    function stopLeaves() {
        if (leafInterval) {
            clearInterval(leafInterval);
            leafInterval = null;
        }
        container.innerHTML = '';
    }

    if (document.documentElement.getAttribute('data-theme') === 'light') {
        startLeaves();
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                if (currentTheme === 'light') startLeaves();
                else stopLeaves();
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
}

// ============================================================
// ОСЕННИЙ ДОЖДЬ
// ============================================================
function setupAutumnRain() {
    const container = document.getElementById('rain-container');
    if (!container) return;

    let rainInterval = null;

    function createDrop() {
        if (document.documentElement.getAttribute('data-theme') !== 'dark') return;

        const drop = document.createElement('div');
        drop.classList.add('raindrop');
        
        // Случайная длина капли
        const height = Math.random() * 20 + 15;
        drop.style.height = `${height}px`;
        drop.style.left = `${Math.random() * 100}vw`;
        
        // Скорость падения
        const duration = Math.random() * 0.6 + 0.4; // Быстрый дождь
        drop.style.animationDuration = `${duration}s`;
        drop.style.animationDelay = `${Math.random() * 1}s`;
        drop.style.opacity = Math.random() * 0.4 + 0.2;

        container.appendChild(drop);

        // Удаляем каплю после падения
        setTimeout(() => {
            if (drop.parentNode) drop.remove();
        }, (duration + 1) * 1000);
    }

    function startRain() {
        container.innerHTML = '';
        if (rainInterval) clearInterval(rainInterval);
        rainInterval = setInterval(createDrop, 30); // Частота падения
    }

    function stopRain() {
        if (rainInterval) {
            clearInterval(rainInterval);
            rainInterval = null;
        }
        container.innerHTML = '';
    }

    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        startRain();
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                if (currentTheme === 'dark') startRain();
                else stopRain();
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
}

// ============================================================
// МАТРИЧНЫЙ ДОЖДЬ (для темы "night")
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const rainContainer = document.createElement('div');
    rainContainer.id = 'matrix-rain';
    rainContainer.style.position = 'fixed';
    rainContainer.style.top = '0';
    rainContainer.style.left = '0';
    rainContainer.style.width = '100%';
    rainContainer.style.height = '100%';
    rainContainer.style.pointerEvents = 'none';
    rainContainer.style.zIndex = '-1';
    rainContainer.style.overflow = 'hidden';
    rainContainer.style.display = 'none';
    document.body.appendChild(rainContainer);

    function createRain() {
        if (document.documentElement.getAttribute('data-theme') !== 'night') {
            rainContainer.style.display = 'none';
            rainContainer.innerHTML = '';
            return;
        }
        
        rainContainer.style.display = 'block';
        rainContainer.innerHTML = '';

        const columns = Math.floor(window.innerWidth / 20);
        for (let i = 0; i < columns; i++) {
            const drop = document.createElement('div');
            drop.textContent = Math.random() > 0.5 ? '1' : '0';
            drop.style.position = 'absolute';
            drop.style.top = '-20px';
            drop.style.left = (i * 20) + 'px';
            drop.style.color = '#00ff00';
            drop.style.fontFamily = 'monospace';
            drop.style.fontSize = '22px';
            drop.style.opacity = Math.random() * 0.5 + 0.2;
            drop.style.textShadow = '0 0 5px #00ff00';
            
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 5;
            
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

    createRain();

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'data-theme') {
                createRain();
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
});

// ============================================================
// СКРЫТИЕ НЕРАБОЧЕГО EMAIL info@tepp.ru
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('p, div, span, a');
    elements.forEach(el => {
        if (el.textContent.includes('info@tepp.ru')) {
            if (el.tagName === 'A' || el.getAttribute('href')?.includes('info@tepp.ru')) {
                el.style.display = 'none';
            } else if (el.tagName === 'P' && el.textContent.trim() === '📧 info@tepp.ru') {
                el.style.display = 'none';
            }
        }
    });
});

// ============================================================
// КОПИРОВАНИЕ С ИСТОЧНИКОМ
// ============================================================
document.addEventListener('copy', function(e) {
    const selection = document.getSelection();
    if (selection.toString().length > 50) {
        const link = '\n\nИсточник: Транспортная энциклопедия постсоветского пространства (ТЭПП) — ' + window.location.href;
        e.clipboardData.setData('text/plain', selection.toString() + link);
        e.preventDefault();
    }
});

// ============================================================
// УМНЫЙ ПЕРЕХОД НА ГЛАВНУЮ
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a').forEach(link => {
        if (link.getAttribute('href') === 'Главная_страница.html') {
            link.setAttribute('href', 'index.html');
        }
    });
});

// ============================================================
// СКРОЛЛ К СЕКЦИИ (ВСПОМОГАТЕЛЬНАЯ)
// ============================================================
function scrollToSection(id) {
    let element = document.getElementById(id);
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
    
    window.scrollTo({
        top: elementPosition - headerHeight,
        behavior: 'smooth' 
    });
}

document.querySelectorAll('.main-nav a').forEach(link => {
    link.setAttribute('draggable', 'false'); 
    link.addEventListener('mouseup', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            const id = href.substring(1);
            scrollToSection(id);
        } else if (href && href.includes('.html')) {
            window.location.href = href;
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.photo-author a').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener');
    });
});

// ============================================================
// МОБИЛЬНОЕ МЕНЮ (БУРГЕР)
// ============================================================
function toggleMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const links = document.getElementById('topNavLinks');
    
    if (btn && links) {
        // Переключаем классы (добавляем/убираем)
        btn.classList.toggle('active');
        links.classList.toggle('active');
    }
}

// Закрывать меню при клике на любую ссылку внутри него
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.top-nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            const btn = document.querySelector('.mobile-menu-btn');
            const menu = document.getElementById('topNavLinks');
            if (btn && menu) {
                btn.classList.remove('active');
                menu.classList.remove('active');
            }
        });
    });
});