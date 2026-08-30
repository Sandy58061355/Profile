const languageButton = document.querySelector('.language-button');

if (languageButton) {
  languageButton.addEventListener('click', () => {
    // Language switching will be connected when EN / 繁中 content files are added.
    languageButton.classList.toggle('is-open');
  });
}
