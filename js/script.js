// ===== Роутинг между страницами =====
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-links a');

function showPage(id) {
  pages.forEach(p => p.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    // Перезапуск анимации появления
    target.style.animation = 'none';
    target.offsetHeight; // reflow
    target.style.animation = '';
  }
  // Подсветка активной ссылки
  navLinks.forEach(a => {
    a.classList.toggle('active', a.dataset.page === id);
  });
  window.scrollTo({ top: 0, behavior: 'instant' });
  // Переинициализируем наблюдатели для новой страницы
  initReveal();
  initSkillBars();
}

// Обработка кликов по навигации
document.addEventListener('click', e => {
  const link = e.target.closest('[data-page]');
  if (link) {
    e.preventDefault();
    const page = link.dataset.page;
    history.pushState(null, '', '#' + page);
    showPage(page);
  }
});

// Обработка hash при загрузке и навигации браузера
window.addEventListener('DOMContentLoaded', () => {
  const hash = location.hash.replace('#', '') || 'home';
  showPage(hash);
});
window.addEventListener('popstate', () => {
  const hash = location.hash.replace('#', '') || 'home';
  showPage(hash);
});

// ===== Бургер-меню =====
const burger = document.querySelector('.burger');
const navList = document.querySelector('.nav-links');
burger.addEventListener('click', () => navList.classList.toggle('open'));

// ===== Эффект печатной машинки =====
const typedEl = document.querySelector('.typed');
const phrases = ['Алексей Петров', 'Веб-дизайнер', 'Frontend-разработчик', 'Творец идей'];
let phraseIdx = 0, charIdx = 0, isDeleting = false;

function type() {
  const current = phrases[phraseIdx];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIdx--);
    if (charIdx < 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(type, 400);
      return;
    }
    setTimeout(type, 50);
  } else {
    typedEl.textContent = current.substring(0, charIdx++);
    if (charIdx > current.length) {
      isDeleting = true;
      setTimeout(type, 1800);
      return;
    }
    setTimeout(type, 110);
  }
}
type();

// ===== Reveal-анимация при появлении =====
let revealObserver;
function initReveal() {
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.page.active .reveal').forEach(el => {
    revealObserver.observe(el);
  });
}

// ===== Анимация полос навыков =====
let skillObserver;
function initSkillBars() {
  if (skillObserver) skillObserver.disconnect();
  skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const w = entry.target.dataset.width;
        entry.target.style.width = w + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.page.active .bar-fill').forEach(el => {
    el.style.width = '0';
    skillObserver.observe(el);
  });
}

// ===== Форма контактов =====
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
form.addEventListener('submit', e => {
  e.preventDefault();
  status.textContent = 'Отправляю...';
  setTimeout(() => {
    status.textContent = '✓ Спасибо! Я свяжусь с вами в ближайшее время.';
    form.reset();
    setTimeout(() => status.textContent = '', 5000);
  }, 1200);
});

// ===== Параллакс для hero-блоба =====
document.addEventListener('mousemove', e => {
  const blob = document.querySelector('#home .blob');
  if (!blob) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;
  blob.style.transform = `translate(${x}px, ${y}px)`;
});