const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20));

menuButton.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
document.getElementById('year').textContent = new Date().getFullYear();

const activityModal = document.querySelector('.activity-modal');
if (activityModal) {
  const modalImage = activityModal.querySelector('img');
  const modalCaption = activityModal.querySelector('.modal-caption');
  const closeModal = () => {
    activityModal.classList.remove('open');
    document.body.style.overflow = '';
  };
  document.querySelectorAll('.activity-card').forEach((card, index) => card.addEventListener('click', () => {
    modalImage.src = card.querySelector('img').src;
    modalImage.alt = card.querySelector('img').alt;
    modalCaption.textContent = `ภาพกิจกรรม ${index + 1} จาก 28`;
    activityModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }));
  activityModal.querySelector('.modal-close').addEventListener('click', closeModal);
  activityModal.addEventListener('click', event => {
    if (event.target === activityModal) closeModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
  });
}
