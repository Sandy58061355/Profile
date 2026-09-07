const languageButton = document.querySelector('.language-button');
const languageMenu = document.querySelector('.language-menu');
const supportedLanguages = ['en', 'zh_tw', 'zh_cn'];
const languageLabels = { en: 'EN', zh_tw: '繁中', zh_cn: '简中' };
const navCopy = {
  en: { home: 'Home', work: 'Work', about: 'About', contact: 'Contact' },
  zh_tw: { home: '首頁', work: '作品', about: '關於我', contact: '聯絡我' },
  zh_cn: { home: '首页', work: '作品', about: '关于我', contact: '联系我' }
};

function getLanguage() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get('lang');
  return supportedLanguages.includes(requested) ? requested : 'en';
}

function localized(item, lang) {
  const english = item?.en || {};
  const selected = item?.[lang] || {};
  const output = { ...english };
  Object.keys(selected).forEach((key) => {
    const value = selected[key];
    if (Array.isArray(value)) {
      if (value.length) output[key] = value;
    } else if (value !== undefined && value !== null && value !== '') {
      output[key] = value;
    }
  });
  return output;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined) el.textContent = value;
}

function mediaMarkup(project, featured = false) {
  const classes = featured ? 'project-media project-media-featured' : 'project-media';
  if (!project.image) return `<div class="${classes}"></div>`;
  return `<div class="${classes}"><img src="${project.image}" alt="${project.title || 'Project image'}" loading="lazy"></div>`;
}

function chipsMarkup(tags = []) {
  return `<div class="chips">${tags.map(tag => `<span class="chip">${tag}</span>`).join('')}</div>`;
}

function renderHome(data, lang) {
  const hero = localized(data.hero, lang);
  setText('hero-eyebrow', hero.eyebrow);
  const headline = document.getElementById('hero-headline');
  if (headline) headline.innerHTML = (hero.headline || '').replace(/\n/g, '<br>');
  setText('hero-description', hero.description);
  const heroCta = document.getElementById('hero-cta');
  if (heroCta) { heroCta.href = data.hero.cta_link || './about.html'; heroCta.innerHTML = `${hero.cta_label || 'About me'} <span aria-hidden="true">→</span>`; }

  const workCopy = localized(data.work.copy, lang);
  setText('work-title', workCopy.title);
  const viewAll = document.getElementById('work-view-all');
  if (viewAll) { viewAll.href = data.work.view_all_link || './work.html'; viewAll.innerHTML = `${workCopy.view_all_label || 'View all work'} <span aria-hidden="true">→</span>`; }

  const projects = (data.work.projects || []).map(p => ({ ...p, ...localized(p, lang) }));
  const featuredId = data.work.featured_project;
  const featured = projects.find(p => p.id === featuredId) || projects[0];
  const regular = projects.filter(p => !featured || p.id !== featured.id);
  const projectsRoot = document.getElementById('home-projects');
  if (projectsRoot && featured) {
    projectsRoot.innerHTML = `<article class="featured-project">${mediaMarkup(featured, true)}<div class="featured-copy"><p class="eyebrow">${featured.eyebrow || 'FEATURED WORK'}</p><h3>${featured.title}</h3><p>${featured.description || ''}</p>${chipsMarkup(featured.tags)}</div></article><div class="project-grid">${regular.map(p => `<article class="project-card">${mediaMarkup(p)}<h3>${p.title}</h3><p>${p.description || ''}</p>${chipsMarkup(p.tags)}</article>`).join('')}</div>`;
  }

  const skillsCopy = localized(data.skills.copy, lang);
  setText('skills-title', skillsCopy.title);
  setText('skills-intro', skillsCopy.intro);
  const capabilityGrid = document.getElementById('capability-grid');
  if (capabilityGrid) capabilityGrid.innerHTML = (data.skills.capabilities || []).map(item => {
    const copy = localized(item, lang);
    return `<article class="capability"><div class="capability-icon" aria-hidden="true"></div><div><h3>${copy.title || ''}</h3><p>${copy.description || ''}</p><span>${copy.keywords || ''}</span></div></article>`;
  }).join('');

  const contact = localized(data.contact, lang);
  setText('contact-headline', contact.headline);
  setText('contact-description', contact.description);
  const contactLink = document.getElementById('contact-link');
  if (contactLink) { contactLink.href = `mailto:${data.contact.email}`; contactLink.innerHTML = `${contact.link_label || 'Email me'} <span aria-hidden="true">→</span>`; }

  document.documentElement.lang = lang === 'en' ? 'en' : (lang === 'zh_tw' ? 'zh-Hant' : 'zh-Hans');
  document.querySelectorAll('[data-i18n-nav]').forEach(el => { el.textContent = navCopy[lang][el.dataset.i18nNav]; });
}

if (languageButton && languageMenu) {
  languageButton.addEventListener('click', () => {
    const opening = languageMenu.hidden;
    languageMenu.hidden = !opening;
    languageButton.classList.toggle('is-open', opening);
    languageButton.setAttribute('aria-expanded', String(opening));
  });
  languageMenu.querySelectorAll('[data-lang]').forEach(button => {
    button.addEventListener('click', () => {
      const url = new URL(window.location.href);
      if (button.dataset.lang === 'en') url.searchParams.delete('lang'); else url.searchParams.set('lang', button.dataset.lang);
      window.location.href = url.toString();
    });
  });
}

const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
  const updateHeaderState = () => siteHeader.classList.toggle('is-scrolled', window.scrollY > 16);
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
}

if (document.body.dataset.cmsPage === 'home') {
  const lang = getLanguage();
  fetch('./content/home.json', { cache: 'no-store' })
    .then(response => { if (!response.ok) throw new Error('Home content could not be loaded.'); return response.json(); })
    .then(data => renderHome(data, lang))
    .catch(error => console.error(error));
}
