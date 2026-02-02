// Courses are loaded from courses.js (global variable 'courses')

// App State
const state = {
    isAuthenticated: false,
    user: {
        name: "Estudante VIP",
        email: "student@example.com"
    }
};

// DOM Elements
const els = {};

// --- Initialization ---
function init() {
    // Cache Elements
    els.loginBtn = document.getElementById('login-btn');
    els.logoutBtn = document.getElementById('logout-btn');
    els.registerBtn = document.getElementById('register-btn');
    els.authButtons = document.getElementById('auth-buttons');
    els.userProfile = document.getElementById('user-profile');

    // Modals
    els.loginModal = document.getElementById('login-modal');
    els.registerModal = document.getElementById('register-modal');
    els.courseModal = document.getElementById('course-modal');

    // Close Buttons
    els.closeLogin = document.getElementById('close-modal');
    els.closeRegister = document.getElementById('close-register-modal');
    els.closeCourse = document.getElementById('close-course-modal');

    // Switchers
    els.switchToLogin = document.getElementById('switch-to-login');

    // Forms
    els.loginForm = document.getElementById('login-form');
    els.registerForm = document.getElementById('register-form');

    // Content
    els.courseGrid = document.getElementById('course-grid');
    els.courseModalContent = document.getElementById('course-modal-content');
    els.tabs = document.querySelectorAll('.tab');

    renderCourses('all');
    setupEventListeners();
    checkAuth();
}

// --- Course Rendering ---
function renderCourses(category) {
    els.courseGrid.innerHTML = '';

    // Filter courses
    const filtered = category === 'all'
        ? courses
        : courses.filter(c => c.category === category);

    // Generate Cards
    filtered.forEach((course, index) => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;

        card.innerHTML = `
            <div class="card-image">
                <img src="${course.image}" alt="${course.title}">
                ${course.premium ? '<span class="badge premium">PREMIUM</span>' : '<span class="badge">FREE</span>'}
            </div>
            <div class="card-content">
                <span class="university-label"><i class="fa-solid fa-building-columns"></i> ${course.university || 'SISTEMA OFICIAL'}</span>
                <span class="category">${course.categoryDisplay}</span>
                <h3>${course.title}</h3>
                <div class="course-metrics">
                    <span class="metric-badge"><i class="fa-solid fa-clock"></i> ${course.programDuration || 'N/A'}</span>
                    <span class="metric-badge"><i class="fa-solid fa-layer-group"></i> ${course.courseCount || 'N/A'}</span>
                </div>
                <p>${course.description}</p>
                <div class="course-meta">
                    <div class="rating">
                        <i class="fa-solid fa-star" style="color: gold;"></i> ${course.rating}
                    </div>
                    <div class="actions" style="display: flex; gap: 0.5rem; margin-left: auto;">
                         <button class="btn btn-sm btn-text detail-btn" data-id="${course.id}">Detalhes</button>
                         <button class="btn btn-sm btn-outline access-btn" data-id="${course.id}">Inscrever</button>
                    </div>
                </div>
            </div>
        `;

        els.courseGrid.appendChild(card);
    });

    // Attach listeners to new buttons
    document.querySelectorAll('.detail-btn').forEach(btn => {
        btn.addEventListener('click', (e) => openCourseDetail(e.target.dataset.id));
    });

    document.querySelectorAll('.access-btn').forEach(btn => {
        btn.addEventListener('click', (e) => handleAccess(e.target.dataset.id));
    });
}

// --- Logic ---

function openCourseDetail(id) {
    const course = courses.find(c => c.id == id);
    if (!course) return;

    // Populate modal content
    const content = `
        <div class="detail-grid">
            <img src="${course.image}" alt="${course.title}" class="detail-img">
            <div class="detail-info">
                <h3>${course.title}</h3>
                <span class="category" style="display:block; margin-bottom:1rem;">${course.categoryDisplay}</span>
                <p>${course.description}</p>
                <p style="margin-top: 1rem; color: var(--text-muted);">
                    Este programa completo inclui ${course.courseCount} distribuídos em ${course.programDuration}. 
                    Receba certificado oficial e mentoria exclusiva.
                </p>
                
                <div class="detail-stats">
                    <div class="stat-box"><strong>${course.programDuration}</strong><span>Duração</span></div>
                    <div class="stat-box"><strong>${course.courseCount}</strong><span>Módulos</span></div>
                    <div class="stat-box"><strong>Oficial</strong><span>Certificado</span></div>
                    <div class="stat-box"><strong>${course.rating}</strong><span>Média</span></div>
                </div>

                <button class="btn btn-primary btn-block" id="modal-access-btn" data-id="${course.id}">Garantir Acesso</button>
            </div>
        </div>
    `;

    els.courseModalContent.innerHTML = content;

    // Attach listener to the button inside the modal
    document.getElementById('modal-access-btn').addEventListener('click', (e) => {
        handleAccess(e.target.dataset.id);
    });

    els.courseModal.classList.remove('hidden');
}

function handleAccess(id) {
    if (state.isAuthenticated) {
        alert("Acesso Confirmado! Redirecionando para a área do aluno...");
        els.courseModal.classList.add('hidden');
    } else {
        els.courseModal.classList.add('hidden');
        els.loginModal.classList.remove('hidden');
    }
}

// --- Event Listeners ---
function setupEventListeners() {
    // Open Login
    if (els.loginBtn) els.loginBtn.addEventListener('click', () => els.loginModal.classList.remove('hidden'));

    // Open Register
    if (els.registerBtn) els.registerBtn.addEventListener('click', () => els.registerModal.classList.remove('hidden'));

    // Switch to Login from Register
    if (els.switchToLogin) {
        els.switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            els.registerModal.classList.add('hidden');
            els.loginModal.classList.remove('hidden');
        });
    }

    // Close Modals
    if (els.closeLogin) els.closeLogin.addEventListener('click', () => els.loginModal.classList.add('hidden'));
    if (els.closeRegister) els.closeRegister.addEventListener('click', () => els.registerModal.classList.add('hidden'));
    if (els.closeCourse) els.closeCourse.addEventListener('click', () => els.courseModal.classList.add('hidden'));

    // Close on Outside Click
    [els.loginModal, els.registerModal, els.courseModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.add('hidden');
            });
        }
    });

    // Form Submits
    if (els.loginForm) {
        els.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            login();
        });
    }

    if (els.registerForm) {
        els.registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = els.registerForm.querySelector('input[type="text"]');
            if (nameInput) state.user.name = nameInput.value;
            login();
        });
    }

    // Logout
    if (els.logoutBtn) els.logoutBtn.addEventListener('click', logout);

    // Tabs
    els.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            els.tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderCourses(tab.dataset.category);
        });
    });
}

// --- Auth Logic ---
function login() {
    state.isAuthenticated = true;
    els.loginModal.classList.add('hidden');
    els.registerModal.classList.add('hidden');
    updateAuthUI();
    // Use a small timeout to allow UI update before alert
    setTimeout(() => alert(`Bem-vindo, ${state.user.name}!`), 100);
}

function logout() {
    state.isAuthenticated = false;
    updateAuthUI();
}

function updateAuthUI() {
    if (state.isAuthenticated) {
        els.authButtons.classList.add('hidden');
        els.userProfile.classList.remove('hidden');
        document.querySelector('.user-name').textContent = state.user.name;
    } else {
        els.authButtons.classList.remove('hidden');
        els.userProfile.classList.add('hidden');
    }
}

// --- Seletivo Logic ---
function initSeletivoLogic() {
    // Lead Form Submit
    const leadForm = document.getElementById('lead-form');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = leadForm.querySelector('button');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processando...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Vaga Garantida!';
                btn.style.background = '#10b981';
                alert("Parabéns! Sua pré-inscrição foi realizada com sucesso. Nossa equipe entrará em contato em breve.");
            }, 1500);
        });
    }
}

// Global scope helper for scrolling
window.app = {
    scrollToCourses: () => {
        document.getElementById('courses').scrollIntoView({ behavior: 'smooth' });
    }
};

// Start
document.addEventListener('DOMContentLoaded', () => {
    init();
    initSeletivoLogic();
});
