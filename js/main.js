/* ============================================================
   main.js — 個人作品集網站互動邏輯
   ============================================================ */

// ── 1. Navbar scroll + spy ──────────────────────────────────
const navbar  = document.getElementById('navbar');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${cur}`));
}, { passive: true });

// ── 2. Hamburger (mobile menu) ──────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
});

// Close mobile menu on link click
mobileMenu?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

// ── 3. Smooth nav scroll ────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.offsetTop - 64;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── 4. Reveal on scroll ─────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── 5. Skill bars ───────────────────────────────────────────
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      // Animate percentage text
      const percentEl = e.target.querySelector('.skill-cat-percent');
      if (percentEl) {
        const targetVal = parseInt(percentEl.textContent);
        animateNumbers(percentEl, targetVal);
      }
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

function animateNumbers(el, endVal) {
  const duration = 1500;
  const startTime = performance.now();
  function step(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easeOut = progress * (2 - progress);
    el.textContent = Math.floor(easeOut * endVal) + '%';
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = endVal + '%';
  }
  requestAnimationFrame(step);
}

// ── 6. Award badge helper ───────────────────────────────────
function awardClass(level) {
  return { first:'award-first', second:'award-second', third:'award-third', honorable:'award-honorable', special:'award-special' }[level] || 'award-honorable';
}

// ── 7. Shared tooltip (fixed positioning to avoid overflow clip) ─
const tooltip = document.createElement('div');
tooltip.id = 'tl-tooltip';
document.body.appendChild(tooltip);

let tooltipTimer = null;

function showTooltip(comp, itemEl) {
  clearTimeout(tooltipTimer);
  const skillTags = comp.skills.slice(0, 4).map(s => `<span class="tag">${s}</span>`).join('');
  tooltip.innerHTML = `
    <div class="preview-title">${comp.title.replace('【請替換】','')}</div>
    <div class="preview-theme">📌 ${comp.theme}</div>
    <div class="preview-summary">${comp.summary}</div>
    <div class="preview-skills">${skillTags}</div>
    <div class="preview-hint">點擊查看完整內容 →</div>`;

  const rect = itemEl.getBoundingClientRect();
  const cardW = 280;
  let left = rect.left + rect.width / 2 - cardW / 2;
  left = Math.max(10, Math.min(left, window.innerWidth - cardW - 10));
  const top = rect.top - 8; // will be moved above via transform

  tooltip.style.left = `${left}px`;
  tooltip.style.top  = `${top}px`;
  tooltip.style.transform = 'translateY(-100%)';
  tooltip.classList.add('visible');
}

function hideTooltip() {
  tooltipTimer = setTimeout(() => tooltip.classList.remove('visible'), 120);
}

// ── 8. Render Timeline (horizontal) ────────────────────────
function renderTimeline() {
  const container = document.getElementById('timeline');
  if (!container || typeof competitionsData === 'undefined') return;

  const sorted = [...competitionsData].sort((a, b) => a.date.localeCompare(b.date));

  sorted.forEach((comp, i) => {
    const item = document.createElement('div');
    item.className = 'tl-item';
    item.dataset.id = comp.id;
    item.style.transitionDelay = `${i * 0.05}s`;

    item.innerHTML = `
      <div class="tl-date">${comp.dateDisplay}</div>
      <div class="tl-dot-wrap"><div class="tl-dot"></div></div>
      <div class="tl-content" tabindex="0" role="button" aria-label="${comp.title.replace('【請替換】','')}">
        <div class="tl-name">${comp.title.replace('【請替換】','')}</div>
        <span class="award-badge ${awardClass(comp.awardLevel)}">${comp.award}</span>
        <span class="cat-badge">${comp.categoryLabel}</span>
      </div>`;

    // Hover tooltip
    item.addEventListener('mouseenter', () => showTooltip(comp, item));
    item.addEventListener('mouseleave', hideTooltip);

    // Click detail panel
    item.querySelector('.tl-content').addEventListener('click', () => openDetail(comp, item));
    item.querySelector('.tl-content').addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetail(comp, item); }
    });

    container.appendChild(item);
  });

  // Reveal items as they become visible
  const tlObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.05 });
  container.querySelectorAll('.tl-item').forEach(el => tlObs.observe(el));

  // Drag-to-scroll on the wrapper
  initDragScroll(document.getElementById('tl-wrapper'));
}

// ── 9. Drag-to-scroll helper ────────────────────────────────
function initDragScroll(el) {
  if (!el) return;
  let isDown = false, startX, scrollLeft;
  el.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
  });
  el.addEventListener('mouseleave', () => { isDown = false; });
  el.addEventListener('mouseup',    () => { isDown = false; });
  el.addEventListener('mousemove',  e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    el.scrollLeft = scrollLeft - (x - startX);
  });
}

// ── 10. Competition Detail Panel ────────────────────────────
const detailPanel = document.getElementById('comp-detail');
const closeBtn    = document.getElementById('close-detail');
let activeItem    = null;

function openDetail(comp, itemEl) {
  document.getElementById('detail-title').textContent = comp.title.replace('【請替換】','');
  document.getElementById('detail-date').textContent  = comp.dateDisplay;
  document.getElementById('detail-cat').textContent   = comp.categoryLabel;

  const aEl = document.getElementById('detail-award');
  aEl.textContent = comp.award;
  aEl.className   = `award-badge ${awardClass(comp.awardLevel)}`;

  document.getElementById('detail-theme').textContent = comp.theme;
  document.getElementById('detail-desc').textContent  = comp.description;
  document.getElementById('detail-team').textContent  = comp.team;

  document.getElementById('detail-skills').innerHTML =
    comp.skills.map(s => `<span class="tag">${s}</span>`).join('');

  const lw = document.getElementById('detail-link-wrap');
  if (comp.link) { lw.style.display = 'block'; document.getElementById('detail-link').href = comp.link; }
  else           { lw.style.display = 'none'; }

  const cert = document.getElementById('detail-cert');
  cert.innerHTML = comp.certificate
    ? `<img src="${comp.certificate}" alt="獎狀" />`
    : `<div class="detail-cert-icon">🏅</div><span>獎狀 / 截圖<br/><small>填入 certificate 路徑</small></span>`;

  if (activeItem) activeItem.classList.remove('active');
  activeItem = itemEl;
  itemEl.classList.add('active');

  detailPanel.classList.add('open');
  requestAnimationFrame(() => {
    detailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

closeBtn?.addEventListener('click', () => {
  detailPanel.classList.remove('open');
  if (activeItem) { activeItem.classList.remove('active'); activeItem = null; }
});

// ── 11. Render Projects ─────────────────────────────────────
const coverIcons = ['🎮','🤖','🌐','🔬','📊','🛡️','💡','🏙️','📱'];
const statusMap  = { completed:'已完成', ongoing:'進行中', archived:'已封存' };

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid || typeof projectsData === 'undefined') return;

  projectsData.forEach((proj, i) => {
    const card = document.createElement('div');
    card.className = 'proj-card reveal';
    card.style.transitionDelay = `${(i % 3) * 0.1}s`;

    const tags = proj.tags.map(t => `<span class="tag">${t}</span>`).join('');
    const hl   = proj.highlights.map(h => `<li style="font-size:.78rem;color:var(--text2);margin-bottom:.15rem">· ${h}</li>`).join('');
    card.innerHTML = `
      <div class="proj-cover">
        ${proj.cover ? `<img src="${proj.cover}" alt="${proj.title}"/>` : '<span>💻</span>'}
      </div>
      <div class="proj-body">
        <div class="proj-subtitle">${proj.subtitle}</div>
        <div class="proj-title">${proj.title.replace('【請替換】','')}</div>
        <div class="proj-desc">${proj.description}</div>
        <ul style="padding:0;margin-bottom:.8rem">${hl}</ul>
        <div class="proj-tags">${tags}</div>
        <div class="proj-footer">
          <span class="proj-role">${proj.team}</span>
        </div>
      </div>`;

    grid.appendChild(card);
    revealObs.observe(card);
  });
}

// ── 12. Render Skills ───────────────────────────────────────
function renderSkills() {
  const grid = document.getElementById('skills-grid');
  if (!grid || typeof skillsData === 'undefined') return;

  skillsData.forEach((cat, ci) => {
    const card = document.createElement('div');
    card.className = 'skill-category reveal';
    card.style.transitionDelay = `${ci * 0.07}s`;

    const items = cat.items.map(sk => `
      <div class="skill-item">
        <div class="skill-name">${sk.name}</div>
      </div>`).join('');

    card.innerHTML = `
      <div class="skill-cat-header">
        <span class="skill-cat-icon">${cat.icon}</span>
        <div style="flex:1">
          <span class="skill-cat-name">${cat.category}</span>
          <span class="skill-cat-percent">${cat.percentage}%</span>
        </div>
      </div>
      <div class="skill-items">${items}</div>`;

    grid.appendChild(card);
    revealObs.observe(card);
    skillObs.observe(card);
  });
}

// ── 13. Custom Cursor ────────────────────────────────────────
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
  let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });
  
  function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .tl-content, .proj-card, .comp-card, .skill-category').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ── 14. 3D Tilt Effect ───────────────────────────────────────
function initTilt(selector) {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}

// ── Init ────────────────────────────────────────────────────
renderTimeline();
renderProjects();
renderSkills();
setTimeout(() => {
  initTilt('.proj-card');
  initTilt('.comp-card');
  initTilt('.skill-category');
}, 100);
