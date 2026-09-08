// // ============ MOBILE NAV TOGGLE ============
// const menuToggle = document.getElementById('menuToggle');
// const mainNav = document.getElementById('mainNav');

// if (menuToggle && mainNav) {
//   menuToggle.addEventListener('click', () => {
//     const isOpen = mainNav.classList.toggle('open');
//     menuToggle.setAttribute('aria-expanded', String(isOpen));
//   });

//   // Close mobile nav after a link is tapped
//   mainNav.querySelectorAll('a').forEach(link => {
//     link.addEventListener('click', () => {
//       mainNav.classList.remove('open');
//       menuToggle.setAttribute('aria-expanded', 'false');
//     });
//   });
// }

// // ============ ACTIVE NAV LINK ON SCROLL ============
// const sections = document.querySelectorAll('section[id]');
// const navLinks = document.querySelectorAll('.main-nav a');

// function setActiveLink() {
//   let current = 'home';
//   const scrollPos = window.scrollY + 120;

//   sections.forEach(section => {
//     if (scrollPos >= section.offsetTop) {
//       current = section.getAttribute('id');
//     }
//   });

//   navLinks.forEach(link => {
//     link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
//   });
// }

// window.addEventListener('scroll', setActiveLink, { passive: true });

// // ============ QUOTE FORM ============
// const quoteForm = document.getElementById('quoteForm');
// const formStatus = document.getElementById('formStatus');

// if (quoteForm) {
//   quoteForm.addEventListener('submit', (e) => {
//     e.preventDefault();

//     const fullName = document.getElementById('fullName').value.trim();
//     const email = document.getElementById('email').value.trim();
//     const phone = document.getElementById('phone').value.trim();

//     if (!fullName || !email || !phone) {
//       formStatus.textContent = 'Please fill in your name, email and phone number.';
//       formStatus.style.color = '#E0A05B';
//       return;
//     }

//     // NOTE: this is a front-end stub only. Wire this up to your real
//     // form handler (e.g. a backend endpoint, Formspree, Netlify Forms,
//     // or an email service) before going live.
//     console.log('Quote request submitted:', {
//       fullName,
//       email,
//       phone,
//       journeyType: document.getElementById('journeyType').value,
//       notes: document.getElementById('notes').value.trim()
//     });

//     formStatus.textContent = 'Thanks — your enquiry has been received. We will be in touch shortly.';
//     formStatus.style.color = '#D4A857';
//     quoteForm.reset();
//   });
// }


// ============ MOBILE NAV TOGGLE ============
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile nav after a link is tapped
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============ ACTIVE NAV LINK ON SCROLL ============
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.main-nav a');

function setActiveLink() {
  let current = 'home';
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    if (scrollPos >= section.offsetTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', setActiveLink, { passive: true });

// ============ QUOTE MODAL OPEN/CLOSE ============
const quoteModalOverlay = document.getElementById('quoteModalOverlay');
const quoteModalClose = document.getElementById('quoteModalClose');
const openQuoteTriggers = document.querySelectorAll('.js-open-quote');
let lastFocusedEl = null;

function openQuoteModal(e) {
  if (e) e.preventDefault();
  if (!quoteModalOverlay) return;
  lastFocusedEl = document.activeElement;
  quoteModalOverlay.classList.add('is-open');
  document.body.classList.add('modal-open');
  const firstField = quoteModalOverlay.querySelector('input, select, textarea');
  if (firstField) firstField.focus();
}

function closeQuoteModal() {
  if (!quoteModalOverlay) return;
  quoteModalOverlay.classList.remove('is-open');
  document.body.classList.remove('modal-open');
  if (lastFocusedEl) lastFocusedEl.focus();
}

openQuoteTriggers.forEach(trigger => trigger.addEventListener('click', openQuoteModal));

if (quoteModalClose) quoteModalClose.addEventListener('click', closeQuoteModal);

if (quoteModalOverlay) {
  quoteModalOverlay.addEventListener('click', (e) => {
    if (e.target === quoteModalOverlay) closeQuoteModal();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && quoteModalOverlay && quoteModalOverlay.classList.contains('is-open')) {
    closeQuoteModal();
  }
});

// ============ QUOTE FORM ============
const quoteForm = document.getElementById('quoteForm');
const formStatus = document.getElementById('formStatus');

// Populate pick-up / return time dropdowns with 15-minute increments (00:00 - 23:45)
function populateTimeOptions(selectEl) {
  if (!selectEl) return;
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      const value = `${hh}:${mm}`;
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = value;
      selectEl.appendChild(opt);
    }
  }
}
populateTimeOptions(document.getElementById('pickupTime'));
populateTimeOptions(document.getElementById('returnTime'));

// Default date inputs to today at the earliest
const todayStr = new Date().toISOString().split('T')[0];
['pickupDate', 'returnDate'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.min = todayStr;
});

// Show / hide return date & time based on trip type
const tripTypeRadios = document.querySelectorAll('input[name="tripType"]');
const returnFieldsRow = document.getElementById('returnFieldsRow');
const returnDateInput = document.getElementById('returnDate');

function updateTripTypeUI() {
  const selected = document.querySelector('input[name="tripType"]:checked');
  const isOneWay = selected && selected.value === 'oneway';
  if (!returnFieldsRow) return;
  returnFieldsRow.classList.toggle('is-hidden', isOneWay);
  if (returnDateInput) returnDateInput.required = !isOneWay;
}
tripTypeRadios.forEach(radio => radio.addEventListener('change', updateTripTypeUI));
updateTripTypeUI();

// Live character counter for Further Requirements
const notesField = document.getElementById('notes');
const charCount = document.getElementById('charCount');
function updateCharCount() {
  if (!notesField || !charCount) return;
  const max = notesField.getAttribute('maxlength') || 1000;
  charCount.textContent = `${notesField.value.length} of ${max}`;
}
if (notesField) notesField.addEventListener('input', updateCharCount);

if (quoteForm) {
  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const pickupDate = document.getElementById('pickupDate').value;
    const pickupLocation = document.getElementById('pickupLocation').value.trim();
    const destination = document.getElementById('destination').value.trim();

    if (!fullName || !email || !phone || !pickupDate || !pickupLocation || !destination) {
      formStatus.textContent = 'Please fill in your details, pick-up date, and pick-up/destination locations.';
      formStatus.style.color = '#E0A05B';
      return;
    }

    // NOTE: this is a front-end stub only. Wire this up to your real
    // form handler (e.g. a backend endpoint, Formspree, Netlify Forms,
    // or an email service) before going live.
    console.log('Quote request submitted:', {
      fullName,
      email,
      phone,
      company: document.getElementById('company').value.trim(),
      tripType: document.querySelector('input[name="tripType"]:checked')?.value,
      pickupDate,
      pickupTime: document.getElementById('pickupTime').value,
      returnDate: document.getElementById('returnDate').value,
      returnTime: document.getElementById('returnTime').value,
      pickupLocation,
      destination,
      vehicleType: document.getElementById('vehicleType').value,
      passengers: document.getElementById('passengers').value,
      journeyType: document.getElementById('journeyType').value,
      notes: notesField.value.trim()
    });

    formStatus.textContent = 'Thanks — your enquiry has been received. We will be in touch shortly.';
    formStatus.style.color = '#D4A857';
    quoteForm.reset();
    updateTripTypeUI();
    updateCharCount();
  });
}
