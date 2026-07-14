// ── ABOUT SLIDESHOW ──
(function () {
  const slides = document.querySelectorAll('.about-slide');
  if (!slides.length) return;
  let current = 0;
  let timer;

  function next() {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }

  function start() { timer = setInterval(next, 3000); }
  function stop()  { clearInterval(timer); }

  const show = document.querySelector('.about-slideshow');
  if (show) { show.addEventListener('mouseenter', stop); show.addEventListener('mouseleave', start); }
  start();
})();

// ── NAV SCROLL ──
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});
nav.classList.toggle('scrolled', window.scrollY > 60);

// ── UPCOMING EVENTS: COUNTDOWNS, TOGGLE, NEXT-EVENT NAV TEXT ──
(function () {
  const eventItems = Array.from(document.querySelectorAll('.event-item'));
  if (!eventItems.length) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  function tickCountdowns() {
    eventItems.forEach(item => {
      const target = new Date(item.dataset.target).getTime();
      const diff = target - Date.now();
      const grid = item.querySelector('.countdown-grid');
      const expired = item.querySelector('.countdown-expired');
      if (diff <= 0) {
        if (grid) grid.style.display = 'none';
        if (expired) expired.style.display = 'block';
        return;
      }
      const days = item.querySelector('[data-cd="days"]');
      const hours = item.querySelector('[data-cd="hours"]');
      const mins = item.querySelector('[data-cd="mins"]');
      if (days) days.textContent = pad(Math.floor(diff / 86400000));
      if (hours) hours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
      if (mins) mins.textContent = pad(Math.floor((diff % 3600000) / 60000));
    });
  }
  tickCountdowns();
  setInterval(tickCountdowns, 60000);

  // Toggle expand/collapse
  eventItems.forEach(item => {
    const toggle = item.querySelector('.event-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const isOpen = item.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  });

  // Auto-open whichever event is soonest (upcoming events take priority over past ones)
  const now = Date.now();
  const withTargets = eventItems.map(item => ({ item, target: new Date(item.dataset.target).getTime() }));
  const upcoming = withTargets.filter(e => e.target > now);
  const pool = upcoming.length ? upcoming : withTargets;
  const soonest = pool.sort((a, b) => a.target - b.target)[0];

  if (soonest) {
    eventItems.forEach(item => {
      const isSoonest = item === soonest.item;
      item.classList.toggle('is-open', isSoonest);
      const toggle = item.querySelector('.event-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', String(isSoonest));
    });

    const { dateFull, timeLabel } = soonest.item.dataset;
    const navText = `Next Event: ${dateFull} &nbsp;·&nbsp; ${timeLabel}`;
    const navTextMobile = `Next Event: ${dateFull} · ${timeLabel}`;
    const navEl = document.getElementById('nav-event-text');
    const navElMobile = document.getElementById('nav-event-text-mobile');
    if (navEl) navEl.innerHTML = navText;
    if (navElMobile) navElMobile.textContent = navTextMobile;
  }
})();

// ── FAQ ACCORDION ──
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const chevron = btn.querySelector('.faq-chevron');
    const isOpen = answer.classList.contains('open');

    // close all
    document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
    document.querySelectorAll('.faq-chevron').forEach(c => c.classList.remove('open'));
    document.querySelectorAll('.faq-question').forEach(b => b.setAttribute('aria-expanded', 'false'));

    if (!isOpen) {
      answer.classList.add('open');
      chevron.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ── CONTACT FORM ──
document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('contact-form').style.display = 'none';
  document.getElementById('form-success').style.display = 'block';
});

// ── HOMEPAGE DIRECTORY ──
const TYPE_COLORS = {
  'Arts & Creative':       '#fce8f3',
  'Business Consulting':   '#e8f4f0',
  'Finance':               '#e3f2fd',
  'Government & Community':'#e8edf5',
  'Health & Wellness':     '#e8f5e9',
  'Hospitality':           '#e6f7fa',
  'Marketing':             '#f3e5f5',
  'NFP / Community':       '#ede7f6',
  'Professional Services': '#fef3e8',
  'Real Estate':           '#fff8e1',
  'Retail':                '#fbe9e7',
  'Technology':            '#e8eaf6',
  'Trades':                '#fce4ec',
  'Other':                 '#f5f5f5'
};
let _membersData = [];
const homepageGrid = document.getElementById('homepage-directory-grid');
if (homepageGrid) {
  fetch('directory.json')
    .then(r => r.json())
    .then(data => {
      _membersData = data;
      const sorted = data.slice().sort(() => Math.random() - 0.5).slice(0, 6);
      homepageGrid.innerHTML = sorted.map(m => {
        const color = TYPE_COLORS[m.type] || '#f5f5f5';
        const coverImg = m.images && m.images.filter(Boolean)[0];
        const thumbBg = coverImg
          ? `url('${coverImg}') center/cover no-repeat`
          : `repeating-linear-gradient(45deg,${color},${color} 8px,white 8px,white 16px)`;
        const logoOver = m.logo
          ? `<div class="biz-card-logo-over"><img src="${m.logo}" alt="${m.name}"/></div>`
          : `<div class="biz-card-logo-over biz-card-logo-initial">${m.name.trim()[0].toUpperCase()}</div>`;
        return `
          <a href="member.html?id=${m.id}" class="biz-card" style="text-decoration:none;color:inherit">
            <div class="biz-card-thumb" style="background:${thumbBg}"></div>
            ${logoOver}
            <div class="biz-card-body">
              <span class="biz-tag">${m.type}</span>
              <h4>${m.name}</h4>
              <p>${m.description.length > 90 ? m.description.slice(0,87)+'…' : m.description}</p>
            </div>
          </a>`;
      }).join('');
    });
}

// ── SMOOTH SCROLL for nav links (with nav offset) ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const navH = document.getElementById('main-nav')?.offsetHeight || 100;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 24;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
