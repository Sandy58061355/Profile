const languageButton = document.querySelector('.language-button');

if (languageButton) {
  languageButton.addEventListener('click', () => {
    // Language switching will be connected when EN / 繁中 content files are added.
    languageButton.classList.toggle('is-open');
  });
}

const siteHeader = document.querySelector('.site-header');

if (siteHeader) {
  const updateHeaderState = () => {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 16);
  };

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
}
