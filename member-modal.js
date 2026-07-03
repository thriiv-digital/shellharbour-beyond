// Shared member quick-view modal — used on index.html and members.html
(function () {
  const COLORS = {
    'Arts & Creative': '#fce8f3', 'Business Consulting': '#e8f4f0',
    'Finance': '#e3f2fd', 'Government & Community': '#e8edf5',
    'Health & Wellness': '#e8f5e9', 'Hospitality': '#e6f7fa',
    'Marketing': '#f3e5f5', 'NFP / Community': '#ede7f6',
    'Professional Services': '#fef3e8', 'Real Estate': '#fff8e1',
    'Retail': '#fbe9e7', 'Technology': '#e8eaf6',
    'Trades': '#fce4ec', 'Other': '#f5f5f5'
  };

  const CSS = `
    #mqm-overlay { position:fixed;inset:0;background:rgba(15,32,60,0.65);z-index:2000;display:none;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(5px); }
    #mqm-overlay.open { display:flex; }
    .mqm-box { background:#fff;border-radius:20px;max-width:560px;width:100%;max-height:90vh;overflow-y:auto;position:relative;box-shadow:0 24px 64px rgba(15,32,60,0.28);animation:mqm-in 0.25s ease; }
    @keyframes mqm-in { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
    .mqm-close { position:absolute;top:14px;right:14px;z-index:3;background:rgba(255,255,255,0.9);backdrop-filter:blur(4px);border:1.5px solid rgba(0,0,0,0.1);border-radius:50%;width:36px;height:36px;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#555;transition:all 0.2s;padding:0;line-height:1; }
    .mqm-close:hover { background:var(--navy,#1a3a6b);color:#fff;border-color:transparent; }
    .mqm-hero { height:200px;background-size:cover;background-position:center;border-radius:20px 20px 0 0;position:relative;flex-shrink:0; }
    .mqm-logo-wrap { position:absolute;bottom:-32px;left:24px;width:66px;height:66px;border-radius:50%;background:#fff;border:3px solid #fff;box-shadow:0 2px 12px rgba(0,0,0,0.15);overflow:hidden;display:flex;align-items:center;justify-content:center; }
    .mqm-logo-wrap img { width:100%;height:100%;object-fit:cover; }
    .mqm-logo-initial { font-size:26px;font-weight:700;color:var(--navy,#1a3a6b);font-family:'DM Serif Display',serif; }
    .mqm-body { padding:48px 28px 28px; }
    .mqm-body .biz-tag { display:inline-flex;align-items:center;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:4px 12px;border-radius:50px;margin-bottom:10px; }
    .mqm-body h2 { font-family:'DM Serif Display',serif;font-size:clamp(20px,3.5vw,26px);color:var(--navy,#1a3a6b);margin-bottom:12px;line-height:1.2; }
    .mqm-desc { font-size:14px;color:var(--text-muted,#64748b);line-height:1.75;margin-bottom:20px; }
    .mqm-details { display:flex;flex-direction:column;gap:10px;margin-bottom:22px; }
    .mqm-detail { display:flex;align-items:flex-start;gap:9px;font-size:13px;color:var(--text-muted,#64748b); }
    .mqm-detail svg { flex-shrink:0;margin-top:1px;color:var(--teal-mid,#2a9d8f); }
    .mqm-detail a { color:inherit;text-decoration:none; }
    .mqm-detail a:hover { color:var(--teal-mid,#2a9d8f); }
    .mqm-actions { display:flex;align-items:center;gap:12px;flex-wrap:wrap;border-top:1px solid var(--border,#e2e8f0);padding-top:20px; }
    .mqm-website { display:inline-flex;align-items:center;gap:7px;background:var(--navy,#1a3a6b);color:#fff;border-radius:50px;padding:10px 20px;font-weight:600;font-size:13px;text-decoration:none;transition:background 0.2s; }
    .mqm-website:hover { background:var(--teal-mid,#2a9d8f); }
    .mqm-profile { display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:var(--teal-mid,#2a9d8f);text-decoration:none;transition:gap 0.2s; }
    .mqm-profile:hover { gap:10px; }
    .mqm-socials { display:flex;gap:8px;margin-left:auto; }
    .mqm-social { width:36px;height:36px;border-radius:50%;background:var(--teal-light,#e6f7fa);display:flex;align-items:center;justify-content:center;color:var(--teal-mid,#2a9d8f);text-decoration:none;transition:all 0.2s; }
    .mqm-social:hover { background:var(--teal,#3bb4c8);color:#fff; }
  `;

  const SVG = {
    pin:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    phone: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    globe: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    arrow: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    fb:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
    ig:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
    li:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`
  };

  function injectCSS() {
    if (document.getElementById('mqm-style')) return;
    const s = document.createElement('style');
    s.id = 'mqm-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function getOverlay() {
    let el = document.getElementById('mqm-overlay');
    if (!el) {
      el = document.createElement('div');
      el.id = 'mqm-overlay';
      el.innerHTML = `<div class="mqm-box"><button class="mqm-close" aria-label="Close">&times;</button><div id="mqm-content"></div></div>`;
      document.body.appendChild(el);
      el.addEventListener('click', e => { if (e.target === el) close(); });
      el.querySelector('.mqm-close').addEventListener('click', close);
      document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    }
    return el;
  }

  function close() {
    const el = document.getElementById('mqm-overlay');
    if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
  }

  window.openMemberModal = function (m) {
    injectCSS();
    const overlay = getOverlay();
    const color = COLORS[m.type] || '#f5f5f5';
    const cover = m.images && m.images.filter(Boolean)[0];
    const heroBg = cover
      ? `url('${cover}') center/cover no-repeat`
      : `repeating-linear-gradient(45deg,${color},${color} 8px,#fff 8px,#fff 16px)`;
    const logoHtml = m.logo
      ? `<img src="${m.logo}" alt="${m.name} logo"/>`
      : `<span class="mqm-logo-initial">${m.name.trim()[0].toUpperCase()}</span>`;

    const details = [
      m.address && `<div class="mqm-detail">${SVG.pin}<span>${m.address}</span></div>`,
      m.phone   && `<div class="mqm-detail">${SVG.phone}<a href="tel:${m.phone}">${m.phone}</a></div>`,
      m.website && `<div class="mqm-detail">${SVG.globe}<a href="${m.website}" target="_blank" rel="noopener noreferrer">${m.website.replace(/^https?:\/\//,'')}</a></div>`,
    ].filter(Boolean).join('');

    const socials = [
      m.facebook  && `<a href="${m.facebook}" target="_blank" rel="noopener noreferrer" class="mqm-social" title="Facebook">${SVG.fb}</a>`,
      m.instagram && `<a href="${m.instagram}" target="_blank" rel="noopener noreferrer" class="mqm-social" title="Instagram">${SVG.ig}</a>`,
      m.linkedin  && `<a href="${m.linkedin}" target="_blank" rel="noopener noreferrer" class="mqm-social" title="LinkedIn">${SVG.li}</a>`,
    ].filter(Boolean).join('');

    document.getElementById('mqm-content').innerHTML = `
      <div class="mqm-hero" style="background:${heroBg}">
        <div class="mqm-logo-wrap">${logoHtml}</div>
      </div>
      <div class="mqm-body">
        <span class="biz-tag" style="background:${color}">${m.type}</span>
        <h2>${m.name}</h2>
        <p class="mqm-desc">${m.description}</p>
        ${details ? `<div class="mqm-details">${details}</div>` : ''}
        <div class="mqm-actions">
          ${m.website ? `<a href="${m.website}" target="_blank" rel="noopener noreferrer" class="mqm-website">${SVG.globe} Visit Website</a>` : ''}
          <a href="member.html?id=${m.id}" class="mqm-profile">View Full Profile ${SVG.arrow}</a>
          ${socials ? `<div class="mqm-socials">${socials}</div>` : ''}
        </div>
      </div>`;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
})();
