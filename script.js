// ============================================================
// 1. ЧАСТИЦЫ
// ============================================================
(function initParticles() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile || prefersReduced || typeof particlesJS === 'undefined') return;

    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.5 },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: 'none', out_mode: 'out' }
        },
        interactivity: {
            events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } }
        },
        retina_detect: true
    });
})();

// ============================================================
// 2. ДАННЫЕ (СТРАНИЦЫ И ФОТО)
// ============================================================
const SEARCH_PAGES = [
    { title: 'Вагон типа А', url: 'Type_A.html', tags: ['метро', 'вагон'], types: ['метро'], city: 'Москва', country: 'СССР' },
    { title: 'Вагон типа Б', url: 'Type_B.html', tags: ['метро', 'вагон'], types: ['метро'], city: 'Москва', country: 'СССР' },
    // ... (Остальные страницы из твоего старого SEARCH_PAGES)
];

const RANDOM_PAGES = [
    { title: 'Вагон типа А', url: 'Type_A.html', icon: '🚇' },
    { title: 'Вагон типа Б', url: 'Type_B.html', icon: '🚇' },
    // ... (Остальные страницы из твоего старого массива pages)
];

const RANDOM_PHOTOS = [
    { src: 'Скифарик.jpg', caption: 'Опытный Скиф', author: 'Lasselan' },
    { src: 'Type_A_1.jpeg', caption: 'Вагон типа А № 1', author: 'pfandrom' },
    // ... (Остальные фото из твоего старого массива photos)
];

// ============================================================
// 3. ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
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
    initTelegramModal(); // Объединенная модалка
});

// ============================================================
// 4. НАСТРОЙКИ И ТЕМЫ
// ============================================================
function initSettings() {
    const isMain = isMainPage();
    const modeButtons = isMain
        ? `<button class="settings-btn mode-btn" data-mode="standard" onclick="setMode('standard')">📖 Познавательный</button>
           <button class="settings-btn mode-btn" data-mode="random" onclick="setMode('random')">🎲 Случайный + Поиск</button>`
        : `<button class="settings-btn mode-btn" data-mode="standard" onclick="setMode('standard')">📖 Познавательный</button>
           <button class="settings-btn mode-btn" data-mode="gallery" onclick="setMode('gallery')">🖼️ Фотогалерея</button>`;

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
                        <button class="theme-btn" data-theme="night" onclick="setTheme('night')" title="Матрица">🌃</button>
                    </div>
                </div>
                <div class="settings-section">
                    <span class="settings-label">📋 Режим</span>
                    <div class="settings-options" id="modeOptions">${modeButtons}</div>
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
    document.getElementById('settingsDropdown')?.classList.toggle('active');
}

function closeSettings() {
    document.getElementById('settingsDropdown')?.classList.remove('active');
}

function setTheme(theme) {
    if (!['light', 'dark', 'poster', 'night'].includes(theme)) theme = 'light';
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
// 5. РЕЖИМЫ (СТАНДАРТНЫЙ / СЛУЧАЙНЫЙ)
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
        applyMainMode(localStorage.getItem('tepp_main_mode') || 'standard');
    } else {
        applyPageMode(localStorage.getItem('tepp_page_mode') || 'standard');
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
        if (typeof updateRandomRecommendations === 'function') updateRandomRecommendations();
    }

    const modeHint = document.getElementById('modeHint');
    if (modeHint) modeHint.textContent = `Текущий режим: ${mode === 'standard' ? 'Познавательный' : 'Случайный + Поиск'}`;
}

function applyPageMode(mode) {
    const gallery = document.getElementById('gallery');
    if (mode === 'gallery') {
        document.querySelectorAll('.section-card:not(#gallery), .hero, .quote-section').forEach(el => el.style.display = 'none');
        if (gallery) gallery.style.display = '';
    } else {
        document.querySelectorAll('.section-card, .hero, .quote-section').forEach(el => el.style.display = '');
    }
    const modeHint = document.getElementById('modeHint');
    if (modeHint) modeHint.textContent = `Текущий режим: ${mode === 'standard' ? 'Познавательный' : 'Фотогалерея'}`;
}

function updateModeButtons(activeMode) {
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.mode === activeMode));
}

// ============================================================
// 6. UI И СКРИПТЫ
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
                    const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
        });
    });
}

function setupScrollTop() {
    const btn = document.querySelector('.scroll-top');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('visible', window.pageYOffset > 300));
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function setupHideHeaderOnScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        header.classList.toggle('header-hidden', window.scrollY > 50);
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
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
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
                content.innerHTML = `<img src="${img.src}" style="max-width:100%; max-height:70vh; border-radius:10px;" alt="${img.alt}"><p style="text-align:center; margin-top:1rem;">${caption}</p>`;
                modal.classList.add('active');
            }
        });
    });
    close?.addEventListener('click', () => modal.classList.remove('active'));
    window.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });
}

// ============================================================
// 7. ПОИСК
// ============================================================
function setupSearch() {
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    if (!input || !results) return;

    function applyFilters() {
        const query = input.value.toLowerCase().trim();
        const type = document.getElementById('filterType')?.value || '';
        const city = document.getElementById('filterCity')?.value || '';
        const country = document.getElementById('filterCountry')?.value || '';

        if (!query && !type && !city && !country) {
            results.innerHTML = '';
            results.classList.remove('active');
            return;
        }

        const matches = SEARCH_PAGES.filter(p => {
            const matchesQuery = !query || p.title.toLowerCase().includes(query) || (p.tags || []).some(t => t.includes(query));
            const matchesType = !type || p.types.includes(type);
            const matchesCity = !city || p.city === city;
            const matchesCountry = !country || p.country === country;
            return matchesQuery && matchesType && matchesCity && matchesCountry;
        });

        results.innerHTML = matches.length === 0
            ? '<p style="color:var(--text-secondary);padding:1rem;">Ничего не найдено.</p>'
            : matches.map(p => `<div class="search-result-item"><a href="${p.url}"><strong>${p.title}</strong></a></div>`).join('');
        results.classList.add('active');
    }

    document.getElementById('searchBtn')?.addEventListener('click', applyFilters);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); applyFilters(); } });
}

// ============================================================
// 8. СЛУЧАЙНЫЕ РЕКОМЕНДАЦИИ
// ============================================================
let updateRandomRecommendations = null;

function setupRandomRecommendations() {
    const container = document.getElementById('randomPages');
    const photoContainer = document.getElementById('randomPhoto');
    if (!container || !photoContainer) return;

    function shuffle(arr) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    updateRandomRecommendations = function() {
        const selected = shuffle(RANDOM_PAGES).slice(0, 20);
        container.innerHTML = selected.map(p => `<a href="${p.url}" class="random-page-card"><span class="icon">${p.icon}</span><span class="title">${p.title}</span></a>`).join('');

        const selectedPhotos = shuffle(RANDOM_PHOTOS).slice(0, 9);
        photoContainer.innerHTML = selectedPhotos.map(photo => {
            const authorPart = photo.author ? ` — 📸 ${photo.author}` : '';
            return `<div class="random-photo-item"><img src="img/${photo.src}" alt="${photo.caption}" onerror="this.src='img/no-photo.png'"><div class="random-photo-caption">📷 ${photo.caption}${authorPart}</div></div>`;
        }).join('');
    };

    updateRandomRecommendations();
    document.getElementById('refreshRandom')?.addEventListener('click', updateRandomRecommendations);
}

// ============================================================
// 9. МОДАЛКА TELEGRAM (ОБЪЕДИНЕННАЯ)
// ============================================================
function initTelegramModal() {
    if (document.getElementById('telegramModal')) return;

    document.body.insertAdjacentHTML('beforeend', `
        <div class="modal" id="telegramModal" role="dialog" aria-modal="true">
            <div class="modal-content tg-modal-content">
                <span class="modal-close" id="telegramModalClose">&times;</span>
                <div class="tg-modal-header"><span class="tg-modal-icon">🚆</span><h2>Перенаправление в Telegram</h2></div>
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
    const close = () => modal.classList.remove('active');

    document.getElementById('telegramGoBtn')?.addEventListener('click', () => {
        window.open('https://t.me/andreimetro1289', '_blank', 'noopener');
        close();
    });
    document.getElementById('telegramCancelBtn')?.addEventListener('click', close);
    document.getElementById('telegramModalClose')?.addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });

    document.querySelectorAll('a[href*="andreimetro1289"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            modal.classList.add('active');
        });
    });
}

// ============================================================
// 10. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================
function isMainPage() {
    return document.querySelector('.standard-block') !== null && document.getElementById('gallery') === null;
}

function animateCounters() {
    const counters = { pagesStat: 120, photosStat: 288, sectionsStat: 5 };
    for (const [id, target] of Object.entries(counters)) {
        const el = document.getElementById(id);
        if (el) {
            let current = 0;
            const timer = setInterval(() => {
                current += Math.ceil(target / 50);
                if (current >= target) { el.textContent = target.toLocaleString(); clearInterval(timer); }
                else { el.textContent = current.toLocaleString(); }
            }, 30);
        }
    }
}

function setupEscapeKey() {
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
            closeSettings();
        }
    });
}