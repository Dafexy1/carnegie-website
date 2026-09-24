
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
// ============ QUOTE FORM ============
const quoteForm = document.getElementById('quoteForm');
const formStatus = document.getElementById('formStatus');

// Populate pick-up / return time dropdowns
// with 15-minute increments (00:00 - 23:45)
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


// ============ LOCAL DATE ============
function getLocalDateString() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const todayStr = getLocalDateString();

const pickupDateInput = document.getElementById('pickupDate');
const returnDateInput = document.getElementById('returnDate');

if (pickupDateInput) {
  pickupDateInput.min = todayStr;
}

if (returnDateInput) {
  returnDateInput.min = todayStr;
}


// ============ RETURN DATE VALIDATION ============
if (pickupDateInput && returnDateInput) {
  pickupDateInput.addEventListener('change', () => {

    // Return date cannot be before pickup date
    returnDateInput.min = pickupDateInput.value;

    // Clear invalid return date
    if (
      returnDateInput.value &&
      returnDateInput.value < pickupDateInput.value
    ) {
      returnDateInput.value = '';
    }
  });
}


// ============ JOURNEY TYPE ============
const tripTypeRadios = document.querySelectorAll(
  'input[name="tripType"]'
);

const returnFieldsRow =
  document.getElementById('returnFieldsRow');

function updateTripTypeUI() {

  const selected =
    document.querySelector(
      'input[name="tripType"]:checked'
    );

  const isOneWay =
    selected && selected.value === 'oneway';

  if (!returnFieldsRow) return;

  returnFieldsRow.classList.toggle(
    'is-hidden',
    isOneWay
  );

  if (returnDateInput) {
    returnDateInput.required = !isOneWay;
  }

  const returnTimeInput =
    document.getElementById('returnTime');

  if (returnTimeInput) {
    returnTimeInput.required = !isOneWay;
  }
}

tripTypeRadios.forEach(radio => {
  radio.addEventListener(
    'change',
    updateTripTypeUI
  );
});

updateTripTypeUI();


// ============ CHARACTER COUNTER ============
const notesField =
  document.getElementById('notes');

const charCount =
  document.getElementById('charCount');

function updateCharCount() {

  if (!notesField || !charCount) return;

  const max =
    notesField.getAttribute('maxlength') || 1000;

  charCount.textContent =
    `${notesField.value.length} of ${max}`;
}

if (notesField) {
  notesField.addEventListener(
    'input',
    updateCharCount
  );
}


// ============ SEND QUOTE FORM ============
if (quoteForm) {

  quoteForm.addEventListener(
    'submit',
    async (e) => {

      e.preventDefault();

      // Get form values
      const fullName =
        document.getElementById('fullName')
          .value
          .trim();

      const email =
        document.getElementById('email')
          .value
          .trim();

      const phone =
        document.getElementById('phone')
          .value
          .trim();

      const pickupDate =
        document.getElementById('pickupDate')
          .value;

      const pickupLocation =
        document.getElementById('pickupLocation')
          .value
          .trim();

      const destination =
        document.getElementById('destination')
          .value
          .trim();

      const passengers =
        document.getElementById('passengers')
          .value;
        
      const luggage =
      document.getElementById('luggage').value;


      // ============ REQUIRED FIELD VALIDATION ============

      if (
        !fullName ||
        !email ||
        !phone ||
        !pickupDate ||
        !pickupLocation ||
        !destination ||
        !passengers ||
        !luggage
      ) {

        formStatus.textContent =
          'Please fill in all required fields.';

        formStatus.style.color =
          '#E0A05B';

        return;
      }


      // ============ EMAIL VALIDATION ============

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {

        formStatus.textContent =
          'Please enter a valid email address.';

        formStatus.style.color =
          '#E0A05B';

        return;
      }


      // ============ RETURN DATE VALIDATION ============

      const selectedTripType =
        document.querySelector(
          'input[name="tripType"]:checked'
        )?.value;

      const returnDate =
        document.getElementById('returnDate')
          .value;

      const returnTime =
        document.getElementById('returnTime')
          .value;


      if (
        selectedTripType === 'return' &&
        (!returnDate || !returnTime)
      ) {

        formStatus.textContent =
          'Please provide the return date and return time.';

        formStatus.style.color =
          '#E0A05B';

        return;
      }


      if (
        selectedTripType === 'return' &&
        returnDate < pickupDate
      ) {

        formStatus.textContent =
          'Return date cannot be before the pick-up date.';

        formStatus.style.color =
          '#E0A05B';

        return;
      }


      // ============ SUBMIT BUTTON ============

      const submitButton =
        quoteForm.querySelector(
          'button[type="submit"]'
        );

      submitButton.disabled = true;

      submitButton.innerHTML =
        'Sending...';

      formStatus.textContent = '';


      // ============ SEND TO FORMSPREE ============

      try {

        const response =
          await fetch(
            quoteForm.action,
            {
              method: 'POST',
              body: new FormData(quoteForm),
              headers: {
                Accept: 'application/json'
              }
            }
          );


        // ============ SUCCESS ============

        if (response.ok) {

          formStatus.textContent =
            'Thanks — your enquiry has been received. We will be in touch shortly.';

          formStatus.style.color =
            '#D4A857';


          // Clear form
          quoteForm.reset();


          // Restore return fields
          updateTripTypeUI();


          // Reset character counter
          updateCharCount();


          // Restore today's minimum date
          if (pickupDateInput) {
            pickupDateInput.min =
              getLocalDateString();
          }

          if (returnDateInput) {
            returnDateInput.min =
              getLocalDateString();
          }

        }


        // ============ FORMSPREE ERROR ============

        else {

          const data =
            await response
              .json()
              .catch(() => ({}));


          if (
            data.errors &&
            data.errors.length > 0
          ) {

            formStatus.textContent =
              data.errors
                .map(error => error.message)
                .join(', ');

          } else {

            formStatus.textContent =
              'Sorry, we could not send your enquiry. Please try again.';

          }

          formStatus.style.color =
            '#E0A05B';
        }

      }


      // ============ CONNECTION ERROR ============

      catch (error) {

        console.error(
          'Quote submission error:',
          error
        );

        formStatus.textContent =
          'Sorry, there was a connection problem. Please try again or contact us by phone.';

        formStatus.style.color =
          '#E0A05B';

      }


      // ============ RESTORE BUTTON ============

      finally {

        submitButton.disabled = false;

        submitButton.innerHTML =
          'Send Enquiry <span aria-hidden="true">&rarr;</span>';
      }

    }
  );
}