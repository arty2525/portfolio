const initiallyVisible = 18;
const loadStep = 18;
const certificateAssetVersion = '20260916-1';

// เรียงตามวันที่บนเกียรติบัตรจากล่าสุดไปเก่าสุด
// รายการจากกิจกรรมเดียวกันซึ่งมีวันเดียวกันจะคงลำดับหมายเลขเดิม
const certificateGroups = {
  personal: {
    label: 'เกียรติบัตรของนายศิวัสว์ โตนอก',
    grid: document.getElementById('personal-grid'),
    numbers: [109, ...Array.from({ length: 67 }, (_, index) => index + 1)]
  },
  students: {
    label: 'เกียรติบัตรของนักเรียน',
    grid: document.getElementById('student-grid'),
    numbers: [
      ...Array.from({ length: 6 }, (_, index) => index + 103),
      ...Array.from({ length: 35 }, (_, index) => index + 68)
    ]
  }
};

const certificateModal = document.getElementById('certificate-modal');
const modalImage = certificateModal.querySelector('img');
const modalCaption = certificateModal.querySelector('.modal-caption');
const visibleByGroup = { personal: initiallyVisible, students: initiallyVisible };
let activeGroup = 'personal';

const certificatePath = number =>
  `assets/certificates/cert-${String(number).padStart(3, '0')}.webp?v=${certificateAssetVersion}`;

Object.entries(certificateGroups).forEach(([groupKey, group]) => {
  group.numbers.forEach((number, index) => {
    const code = String(number).padStart(3, '0');
    const card = document.createElement('a');
    card.className = `certificate-card${index >= initiallyVisible ? ' is-hidden' : ''}`;
    card.id = `cert-${code}`;
    card.href = certificatePath(number);
    card.dataset.number = String(number);
    card.dataset.group = groupKey;
    card.innerHTML = `
      <img src="${certificatePath(number)}" loading="lazy" alt="${group.label} รายการที่ ${number}">
      <span>CERTIFICATE ${code}<i>↗</i></span>
    `;
    group.grid.appendChild(card);
  });
});

const updateGroup = groupKey => {
  const group = certificateGroups[groupKey];
  group.grid.querySelectorAll('.certificate-card').forEach((card, index) => {
    card.classList.toggle('is-hidden', index >= visibleByGroup[groupKey]);
  });
  const button = document.querySelector(`.certificate-load-more[data-group="${groupKey}"]`);
  button.hidden = visibleByGroup[groupKey] >= group.numbers.length;
};

document.querySelectorAll('.certificate-load-more').forEach(button => {
  button.addEventListener('click', () => {
    const groupKey = button.dataset.group;
    visibleByGroup[groupKey] = Math.min(
      visibleByGroup[groupKey] + loadStep,
      certificateGroups[groupKey].numbers.length
    );
    updateGroup(groupKey);
  });
});

const openCertificate = (number, groupKey) => {
  const group = certificateGroups[groupKey];
  const code = String(number).padStart(3, '0');
  activeGroup = groupKey;
  modalImage.src = certificatePath(number);
  modalImage.alt = `${group.label} รายการที่ ${number}`;
  modalCaption.textContent = `${group.label} · CERTIFICATE ${code}`;
  certificateModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  history.replaceState(null, '', `#cert-${code}`);
};

const closeCertificate = () => {
  certificateModal.classList.remove('open');
  modalImage.src = '';
  document.body.style.overflow = '';
  const target = activeGroup === 'personal' ? 'personal-certificates' : 'student-certificates';
  history.replaceState(null, '', `#${target}`);
};

document.querySelector('.certificate-gallery-section').addEventListener('click', event => {
  const card = event.target.closest('.certificate-card');
  if (!card) return;
  event.preventDefault();
  openCertificate(Number(card.dataset.number), card.dataset.group);
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
  const groupEntry = Object.entries(certificateGroups).find(([, group]) => group.numbers.includes(requested));
  if (groupEntry) {
    const [groupKey, group] = groupEntry;
    const position = group.numbers.indexOf(requested);
    visibleByGroup[groupKey] = Math.max(initiallyVisible, Math.ceil((position + 1) / loadStep) * loadStep);
    updateGroup(groupKey);
    openCertificate(requested, groupKey);
  }
}

Object.keys(certificateGroups).forEach(updateGroup);
