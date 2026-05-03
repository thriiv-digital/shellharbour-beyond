// ── NAV SCROLL ──
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});
nav.classList.toggle('scrolled', window.scrollY > 60);

// ── COUNTDOWN ──
const TARGET = new Date('2026-05-14T10:00:00+10:00').getTime();
const cdGrid = document.getElementById('countdown-grid');
const cdExpired = document.getElementById('countdown-expired');
const cdDays = document.getElementById('cd-days');
const cdHours = document.getElementById('cd-hours');
const cdMins = document.getElementById('cd-mins');

function pad(n) { return String(n).padStart(2, '0'); }

function tickCountdown() {
  const diff = TARGET - Date.now();
  if (diff <= 0) {
    cdGrid.style.display = 'none';
    cdExpired.style.display = 'block';
    return;
  }
  cdDays.textContent  = pad(Math.floor(diff / 86400000));
  cdHours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
  cdMins.textContent  = pad(Math.floor((diff % 3600000) / 60000));
}
tickCountdown();
setInterval(tickCountdown, 60000);

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
const homepageGrid = document.getElementById('homepage-directory-grid');
if (homepageGrid) {
  fetch('directory.json')
    .then(r => r.json())
    .then(data => {
      const sorted = data.slice().sort((a, b) => a.name.localeCompare(b.name)).slice(0, 6);
      homepageGrid.innerHTML = sorted.map(m => {
        const color = TYPE_COLORS[m.type] || '#f5f5f5';
        const thumbContent = m.logo
          ? `<img src="${m.logo}" alt="${m.name}" style="height:70px;object-fit:contain;padding:8px"/>`
          : `<span class="biz-thumb-label">[ business logo / photo ]</span>`;
        return `
          <a href="member.html?id=${m.id}" class="biz-card" style="text-decoration:none;color:inherit">
            <div class="biz-card-thumb" style="background:repeating-linear-gradient(45deg,${color},${color} 8px,white 8px,white 16px)">
              ${thumbContent}
            </div>
            <div class="biz-card-body">
              <span class="biz-tag">${m.type}</span>
              <h4>${m.name}</h4>
              <p>${m.description.length > 90 ? m.description.slice(0,87)+'…' : m.description}</p>
            </div>
          </a>`;
      }).join('');
    });
}

// ── SMOOTH SCROLL for nav links ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
