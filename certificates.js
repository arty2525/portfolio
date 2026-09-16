const totalCertificates = 109;
const initiallyVisible = 18;
const loadStep = 18;
const certificateGrid = document.getElementById('certificate-grid');
const loadMoreButton = document.getElementById('load-more');
const certificateModal = document.getElementById('certificate-modal');
const modalImage = certificateModal.querySelector('img');
const modalCaption = certificateModal.querySelector('.modal-caption');
const certificateAssetVersion = '20260916-1';
let visibleCertificates = initiallyVisible;

const certificatePath = number =>
  `assets/certificates/cert-${String(number).padStart(3, '0')}.webp?v=${certificateAssetVersion}`;

for (let number = 1; number <= totalCertificates; number += 1) {
  const code = String(number).padStart(3, '0');
  const card = document.createElement('a');
  card.className = `certificate-card${number > visibleCertificates ? ' is-hidden' : ''}`;
  card.id = `cert-${code}`;
  card.href = certificatePath(number);
  card.dataset.number = String(number);
  card.innerHTML = `
    <img src="${certificatePath(number)}" loading="lazy" alt="เกียรติบัตรของนายศิวัสว์ โตนอก รายการที่ ${number}">
    <span>CERTIFICATE ${code}<i>↗</i></span>
  `;
  certificateGrid.appendChild(card);
}

const updateLoadMore = () => {
  loadMoreButton.hidden = visibleCertificates >= totalCertificates;
};

loadMoreButton.addEventListener('click', () => {
  visibleCertificates = Math.min(visibleCertificates + loadStep, totalCertificates);
  document.querySelectorAll('.certificate-card').forEach((card, index) => {
    card.classList.toggle('is-hidden', index >= visibleCertificates);
  });
  updateLoadMore();
});

const openCertificate = number => {
  const code = String(number).padStart(3, '0');
  modalImage.src = certificatePath(number);
  modalImage.alt = `เกียรติบัตรของนายศิวัสว์ โตนอก รายการที่ ${number}`;
  modalCaption.textContent = `CERTIFICATE ${code} / ${totalCertificates}`;
  certificateModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  history.replaceState(null, '', `#cert-${code}`);
};

const closeCertificate = () => {
  certificateModal.classList.remove('open');
  modalImage.src = '';
  document.body.style.overflow = '';
  history.replaceState(null, '', '#gallery');
};

certificateGrid.addEventListener('click', event => {
  const card = event.target.closest('.certificate-card');
  if (!card) return;
  event.preventDefault();
  openCertificate(Number(card.dataset.number));
});

certificateModal.querySelector('.modal-close').addEventListener('click', closeCertificate);
certificateModal.addEventListener('click', event => {
  if (event.target === certificateModal) closeCertificate();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && certificateModal.classList.contains('open')) closeCertificate();
});

const hashMatch = location.hash.match(/^#cert-(\d{3})$/);
if (hashMatch) {
  const requested = Number(hashMatch[1]);
  if (requested >= 1 && requested <= totalCertificates) {
    visibleCertificates = Math.max(initiallyVisible, Math.ceil(requested / loadStep) * loadStep);
    document.querySelectorAll('.certificate-card').forEach((card, index) => {
      card.classList.toggle('is-hidden', index >= visibleCertificates);
    });
    openCertificate(requested);
  }
}

updateLoadMore();
