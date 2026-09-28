/* ==============================================
   FOODCONNECT - UI UTILITIES
   Toast, Modal, Navbar, Validation helpers
============================================== */


/* ==============================================
   TOAST SYSTEM
============================================== */

let toastContainer = null;

function initToasts() {
  if (document.getElementById('toast-container')) return;
  toastContainer = document.createElement('div');
  toastContainer.id = 'toast-container';
  document.body.appendChild(toastContainer);
}

/* type: 'success' | 'error' | 'warn' | 'info' */
function showToast(message, type = 'success', duration = 4000) {
  if (!toastContainer) initToasts();

  const icons = {
    success: 'check_circle',
    error:   'error',
    warn:    'warning',
    info:    'info'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type === 'error' ? 'error' : type === 'warn' ? 'warn' : type === 'info' ? 'info' : ''}`;
  toast.innerHTML = `
    <span class="toast-icon material-symbols-outlined">${icons[type] || icons.success}</span>
    <span class="toast-message">${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}


/* ==============================================
   MODAL SYSTEM
============================================== */

function openModal(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  /* Close on overlay click */
  overlay.addEventListener('click', function handler(e) {
    if (e.target === overlay) {
      closeModal(overlayId);
      overlay.removeEventListener('click', handler);
    }
  });
}

function closeModal(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* ESC key closes any open modal */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(el => {
      el.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
});

/* Wire modal close buttons */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const overlay = btn.closest('.modal-overlay');
      if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      openModal(btn.dataset.modalOpen);
    });
  });
});


/* ==============================================
   NAVBAR
============================================== */

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  /* Scroll shadow */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  });

  /* Active link highlighting */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* Hamburger menu */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    /* Close on link click */
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });

    /* Close on outside click */
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', initNavbar);


/* ==============================================
   VALIDATION HELPERS
============================================== */

const COUNTRY_CODES = [
  { code: '+91',  flag: 'IN', name: 'India',     digits: 10 },
  { code: '+1',   flag: 'US', name: 'USA',        digits: 10 },
  { code: '+44',  flag: 'GB', name: 'UK',         digits: 10 },
  { code: '+971', flag: 'AE', name: 'UAE',        digits: 9  },
  { code: '+65',  flag: 'SG', name: 'Singapore',  digits: 8  },
  { code: '+61',  flag: 'AU', name: 'Australia',  digits: 9  },
  { code: '+1',   flag: 'CA', name: 'Canada',     digits: 10 }
];

/**
 * Build a phone country-code <select> and wire it to the paired phone <input>.
 * The paired input is found by convention: if selectId is "donorCountryCode",
 * the input id is "donorPhone".  Pass an explicit inputId to override.
 *
 * Wires:
 *  - maxlength on the input (enforces digit count at browser level)
 *  - input[inputmode="numeric"] so mobile keyboards show a number pad
 *  - a live digit counter hint below the input
 *  - strips non-digit characters on every keystroke
 */
function buildPhoneSelect(selectId, inputId) {
  const select = document.getElementById(selectId);
  if (!select) return;

  /* Derive paired input id if not provided */
  if (!inputId) {
    inputId = selectId.replace('CountryCode', 'Phone');
  }
  const phoneInput = document.getElementById(inputId);

  select.innerHTML = '';
  COUNTRY_CODES.forEach((c, i) => {
    const opt = document.createElement('option');
    opt.value        = c.code;
    opt.textContent  = `${c.code} ${c.name}`;
    opt.dataset.digits = c.digits;
    if (i === 0) opt.selected = true;
    select.appendChild(opt);
  });

  /* Apply constraints immediately for the default selection */
  applyPhoneConstraints(select, phoneInput);

  /* Re-apply on country change */
  select.addEventListener('change', () => applyPhoneConstraints(select, phoneInput));
}

/**
 * Set maxlength, inputmode, placeholder, and digit-counter on the phone input
 * based on the currently selected country code.
 */
function applyPhoneConstraints(selectEl, phoneInput) {
  if (!phoneInput) return;

  const selectedOpt = selectEl.options[selectEl.selectedIndex];
  const digits      = parseInt(selectedOpt?.dataset?.digits || '10', 10);
  const country     = getCountryByCode(selectEl.value);
  const countryName = country ? country.name : 'selected country';

  /* Enforce maxlength — browser blocks extra keystrokes */
  phoneInput.setAttribute('maxlength', digits);
  phoneInput.setAttribute('inputmode', 'numeric');
  phoneInput.setAttribute('pattern',   `[0-9]{${digits}}`);
  phoneInput.setAttribute('placeholder', `${digits}-digit number`);

  /* Clear any digits that exceed the new max */
  if (phoneInput.value.replace(/\D/g, '').length > digits) {
    phoneInput.value = '';
  }

  /* Digit counter element — create once, reuse */
  let counter = phoneInput.parentElement.querySelector('.phone-digit-counter');
  if (!counter) {
    counter = document.createElement('span');
    counter.className = 'phone-digit-counter';
    counter.style.cssText = [
      'font-size:0.75rem',
      'font-weight:600',
      'color:var(--mid-grey)',
      'display:block',
      'margin-top:4px',
      'transition:color 0.2s'
    ].join(';');
    phoneInput.parentElement.insertAdjacentElement('afterend', counter);
  }

  function updateCounter() {
    const entered = phoneInput.value.replace(/\D/g, '').length;
    const remaining = digits - entered;
    if (entered === 0) {
      counter.textContent  = `${digits} digits required for ${countryName}`;
      counter.style.color  = 'var(--mid-grey)';
    } else if (entered < digits) {
      counter.textContent  = `${entered} / ${digits} digits entered`;
      counter.style.color  = 'var(--amber)';
    } else {
      counter.textContent  = `${digits} / ${digits} — good`;
      counter.style.color  = 'var(--green)';
    }
  }

  /* Strip non-digits and enforce maxlength on input */
  phoneInput.addEventListener('input', () => {
    const raw     = phoneInput.value.replace(/\D/g, '');
    const trimmed = raw.slice(0, digits);
    if (phoneInput.value !== trimmed) phoneInput.value = trimmed;
    updateCounter();
  });

  updateCounter();
}

/* Derive country digits by code */
function getCountryByCode(code) {
  return COUNTRY_CODES.find(c => c.code === code);
}

/**
 * Validate a phone number string against its country's required digit count.
 * Strips all non-digit characters before comparing.
 */
function validatePhone(number, countryCode) {
  const country = getCountryByCode(countryCode);
  const digits  = number.replace(/\D/g, '');
  if (!country) return digits.length >= 7;
  return digits.length === country.digits;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.classList.add('error');

  let errEl = field.parentElement.querySelector('.form-error');
  if (!errEl) {
    errEl = document.createElement('p');
    errEl.className = 'form-error';
    field.after(errEl);
  }
  errEl.textContent = message;
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.classList.remove('error');
  const errEl = field.parentElement.querySelector('.form-error');
  if (errEl) errEl.textContent = '';
}

function clearAllErrors(formEl) {
  formEl.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(el => {
    el.classList.remove('error');
  });
  formEl.querySelectorAll('.form-error').forEach(el => {
    el.textContent = '';
  });
}

/* Real-time validation on blur */
function attachFieldValidation(fieldId, validate, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.addEventListener('blur', () => {
    if (field.value.trim() && !validate(field.value.trim())) {
      showFieldError(fieldId, message);
    } else {
      clearFieldError(fieldId);
    }
  });
  field.addEventListener('input', () => {
    if (field.classList.contains('error')) {
      if (validate(field.value.trim())) clearFieldError(fieldId);
    }
  });
}


/* ==============================================
   LOCATION AUTOCOMPLETE
============================================== */

const MADURAI_AREAS = [
  'Anna Nagar', 'KK Nagar', 'Mattuthavani', 'Thiruppalai',
  'Simmakkal', 'Tallakulam', 'Arapalayam', 'Goripalayam',
  'Thirunagar', 'Villapuram', 'Palanganatham', 'Iyer Bungalow',
  'Nagamalai Pudukottai', 'Sellur', 'Surveyor Colony',
  'Teppakulam', 'Periyar Bus Stand', 'Kochadai', 'Gomathipuram',
  'Vandiyur', 'Othakadai', 'Subramaniapuram', 'Sathamangalam',
  'Ellis Nagar', 'Melur Road', 'Alagarkovil Road'
];

function initLocationAutocomplete(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  let wrapper = input.parentElement;
  if (!wrapper.classList.contains('location-wrapper')) {
    wrapper = document.createElement('div');
    wrapper.className = 'location-wrapper';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
  }

  const dropdown = document.createElement('div');
  dropdown.className = 'location-suggestions';
  wrapper.appendChild(dropdown);

  input.addEventListener('input', () => {
    const val = input.value.trim().toLowerCase();
    if (!val) { dropdown.classList.remove('active'); dropdown.innerHTML = ''; return; }

    const matches = MADURAI_AREAS.filter(a => a.toLowerCase().includes(val));
    if (!matches.length) { dropdown.classList.remove('active'); dropdown.innerHTML = ''; return; }

    dropdown.innerHTML = matches.slice(0, 6).map(m =>
      `<div class="location-suggestion-item">${m}, Madurai</div>`
    ).join('');
    dropdown.classList.add('active');
  });

  dropdown.addEventListener('click', (e) => {
    if (e.target.classList.contains('location-suggestion-item')) {
      input.value = e.target.textContent;
      dropdown.classList.remove('active');
      dropdown.innerHTML = '';
      input.dispatchEvent(new Event('change'));
    }
  });

  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });
}


/* ==============================================
   FILE UPLOAD
============================================== */

function initFileUpload(areaId, inputId, displayId, accept = '.pdf') {
  const area    = document.getElementById(areaId);
  const input   = document.getElementById(inputId);
  const display = document.getElementById(displayId);
  if (!area || !input || !display) return;

  area.addEventListener('click', () => input.click());

  area.addEventListener('dragover', (e) => {
    e.preventDefault();
    area.classList.add('dragover');
  });

  area.addEventListener('dragleave', () => area.classList.remove('dragover'));

  area.addEventListener('drop', (e) => {
    e.preventDefault();
    area.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      handleFileSelect(e.dataTransfer.files[0], input, display);
    }
  });

  input.addEventListener('change', () => {
    if (input.files.length) {
      handleFileSelect(input.files[0], input, display);
    }
  });
}

function handleFileSelect(file, input, display) {
  /* Validate PDF only */
  if (file.type !== 'application/pdf') {
    showToast('Only PDF files are accepted.', 'error');
    if (input) input.value = '';
    display.innerHTML = '';
    return;
  }

  /* 5 MB max */
  if (file.size > 5 * 1024 * 1024) {
    showToast('File size must be under 5 MB.', 'error');
    if (input) input.value = '';
    display.innerHTML = '';
    return;
  }

  display.innerHTML = `
    <div class="file-selected">
      <span class="material-symbols-outlined" style="font-size:1rem">picture_as_pdf</span>
      <span>${file.name}</span>
      <button type="button" class="file-remove" onclick="clearFile('${input.id}','${display.id}')">
        <span class="material-symbols-outlined" style="font-size:1rem">close</span>
      </button>
    </div>
  `;
}

function clearFile(inputId, displayId) {
  const input   = document.getElementById(inputId);
  const display = document.getElementById(displayId);
  if (input) input.value = '';
  if (display) display.innerHTML = '';
}


/* ==============================================
   DATE / ID HELPERS
============================================== */

function generateId(prefix = 'FC') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function now() {
  return new Date().toLocaleString('en-IN');
}


/* ==============================================
   DELIVERY STATUS LABELS
============================================== */

const DELIVERY_STATUSES = [
  'Request Received',
  'Request Accepted',
  'Food Packing',
  'Out for Delivery',
  'Delivered'
];

const REQUEST_STATUSES = [
  'Pending',
  'Accepted',
  'Preparing',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];


/* ==============================================
   COPY TO CLIPBOARD
============================================== */

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard', 'info');
  });
}


/* Init toasts on load */
document.addEventListener('DOMContentLoaded', initToasts);
