// ============================================================
// 404 — ПОЕЗД УШЁЛ
// ============================================================

// ---------- Тема (та же логика, что на сайте) ----------
(function initTheme404() {
    const THEMES = ['light', 'dark', 'industrial', 'night'];
    let saved = localStorage.getItem('tepp_theme');
    if (!saved || !THEMES.includes(saved)) {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        saved = systemDark ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', saved);
})();

// ---------- Частицы ----------
(function initParticles404() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile || prefersReduced) return;
    if (typeof particlesJS === 'undefined') return;

    particlesJS('particles-js', {
        particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.4, random: false },
            size: { value: 2.5, random: true },
            line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.3, width: 1 },
            move: { enable: true, speed: 1.6, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true }
        },
        retina_detect: true
    });
})();

// ---------- Случайная страница ----------
function goRandom() {
    // Тот же список, что в script.js (можно сократить)
    const pages = [
        'Type_A.html', 'Type_B.html', 'Type_G.html', 'Type_D.html', 'Type_V.html',
        'Type_M5.html', 'Type_D_2018.html', 'Еж3-путеизмеритель.html', 'Опытный_Скиф.html',
        'Живая_история_Яуза_0028-0035.html', 'Яуза0021.html', 'Главная_Страница_Мосметро.html',
        'ps_mosmetro.html', 'Minsk_metro.html', 'Красная_Стрела.html', 'Красная_стрела_жд.html',
        'Полярная_стрела.html', 'ЧС7.html', 'ЧС7_199.html', 'ЭП2К.html', 'ЭП2К-500.html',
        'ЭП2К-510.html', '71-135 № 3001.html', 'МТВ-82 №1075.html', 'Конка_1872_года_35.html',
        'Двухосный моторный СВАРЗ №3130.html', 'Tatra T3SU №5993.html', 'ЗИС-8.html',
        'ЗИС-154.html', 'ЗИС-155.html', 'ЗИЛ-158.html', 'Алма-Ата_канатка.html',
        'Монорельс.html', 'Монорельс_Стрела.html', 'Музеи_транспорта.html',
        'МузейТранспортаМосквы.html', 'Легенды_и_мифы_метро.html', 'Парад_метро_Москвы.html',
        'Метро_Мск_история.html', 'Живая_история_Мск_метро.html', 'Ушедшие_в_историю_метро.html',
        'Грузовые_вагоны.html', 'Служебные_поезда_метро.html', 'ДК1_метро.html',
        'ДК2_метро.html', 'ПДМ_ЖД.html'
    ];
    const random = pages[Math.floor(Math.random() * pages.length)];
    window.location.href = random;
}

// ---------- Пасхалка: нажмите "М" для смены темы ----------
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'м' || e.key.toLowerCase() === 'm') {
        const themes = ['light', 'dark', 'industrial', 'night'];
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = themes[(themes.indexOf(current) + 1) % themes.length];
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('tepp_theme', next);
    }
});