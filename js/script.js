// ============================================================
// Amber Cup — site behavior
// One script for all pages. Each block checks that its element
// exists before wiring anything up, so this file is safe to
// include everywhere.
// ============================================================

// --- Mobile navigation toggle --------------------------------
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    // Keep the button's X look and screen-reader state in sync
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// --- Collapsing header ----------------------------------------
const header = document.querySelector(".site-header");

if (header) {
  // How far (in px) you must scroll before the header slims down
  const COLLAPSE_AT = 40;

  function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > COLLAPSE_AT);
  }

  updateHeader(); // handle a page loaded mid-scroll (e.g. refresh)
  // passive: scroll events fire often; this says we won't block scrolling
  window.addEventListener("scroll", updateHeader, { passive: true });
}

// --- Contact form validation ----------------------------------
const form = document.getElementById("contact-form");

if (form) {
  // Intentionally simple email check: something@something.something
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const fields = [
    {
      input: document.getElementById("name"),
      isValid: (value) => value.trim() !== "",
      message: "Please tell us your name.",
    },
    {
      input: document.getElementById("email"),
      isValid: (value) => EMAIL_PATTERN.test(value),
      message: "Please enter a valid email address.",
    },
    {
      input: document.getElementById("message"),
      isValid: (value) => value.trim() !== "",
      message: "Please enter a message.",
    },
  ];

  function showError(field) {
    const group = field.input.closest(".form-group");
    group.classList.add("invalid");
    group.querySelector(".error-message").textContent = field.message;
  }

  function clearError(field) {
    const group = field.input.closest(".form-group");
    group.classList.remove("invalid");
    group.querySelector(".error-message").textContent = "";
  }

  // Re-validate as the user types so errors disappear promptly
  fields.forEach((field) => {
    field.input.addEventListener("input", () => clearError(field));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // No backend — nothing is actually sent

    let firstInvalidInput = null;

    fields.forEach((field) => {
      if (field.isValid(field.input.value)) {
        clearError(field);
      } else {
        showError(field);
        if (!firstInvalidInput) firstInvalidInput = field.input;
      }
    });

    if (firstInvalidInput) {
      firstInvalidInput.focus();
      return;
    }

    // Pretend the message was sent
    form.hidden = true;
    document.getElementById("form-success").hidden = false;
  });
}
