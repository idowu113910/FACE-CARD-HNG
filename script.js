// Contact Form Validation
(function () {
  const form = document.getElementById("contactFor");
  const successMessage = document.getElementById("successMessage");

  // Field configurations
  const fields = {
    fullName: {
      element: document.querySelector('[data-testid="test-contact-name"]'),
      error: document.querySelector('[data-testid="test-contact-error-name"]'),
      validate: (value) => {
        if (!value.trim()) {
          return "Full name is required";
        }
        if (value.trim().length < 2) {
          return "Full name must be at least 2 characters";
        }
        return "";
      },
    },
    email: {
      element: document.querySelector('[data-testid="test-contact-email"]'),
      error: document.querySelector('[data-testid="test-contact-error-email"]'),
      validate: (value) => {
        if (!value.trim()) {
          return "Email address is required";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return "Please enter a valid email address (e.g., name@example.com)";
        }
        return "";
      },
    },
    subject: {
      element: document.querySelector('[data-testid="test-contact-subject"]'),
      error: document.querySelector(
        '[data-testid="test-contact-error-subject"]'
      ),
      validate: (value) => {
        if (!value.trim()) {
          return "Subject is required";
        }
        if (value.trim().length < 3) {
          return "Subject must be at least 3 characters";
        }
        return "";
      },
    },
    message: {
      element: document.querySelector('[data-testid="test-contact-message"]'),
      error: document.querySelector(
        '[data-testid="test-contact-error-message"]'
      ),
      validate: (value) => {
        if (!value.trim()) {
          return "Message is required";
        }
        if (value.trim().length < 10) {
          return "Message must be at least 10 characters";
        }
        return "";
      },
    },
  };

  // Show error message
  function showError(fieldName, message) {
    const field = fields[fieldName];
    field.error.textContent = message;
    field.error.style.display = message ? "block" : "none";
    field.element.classList.toggle("input-error", !!message);
    field.element.setAttribute("aria-invalid", !!message);
  }

  // Clear error message
  function clearError(fieldName) {
    showError(fieldName, "");
  }

  // Validate single field
  function validateField(fieldName) {
    const field = fields[fieldName];
    const value = field.element.value;
    const errorMessage = field.validate(value);
    showError(fieldName, errorMessage);
    return !errorMessage;
  }

  // Validate all fields
  function validateForm() {
    let isValid = true;
    Object.keys(fields).forEach((fieldName) => {
      if (!validateField(fieldName)) {
        isValid = false;
      }
    });
    return isValid;
  }

  // Add real-time validation on blur
  Object.keys(fields).forEach((fieldName) => {
    const field = fields[fieldName];

    field.element.addEventListener("blur", () => {
      validateField(fieldName);
    });

    field.element.addEventListener("input", () => {
      if (field.error.textContent) {
        validateField(fieldName);
      }
    });

    // Clear error on focus
    field.element.addEventListener("focus", () => {
      field.element.classList.remove("input-error");
    });
  });

  // Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Hide success message if visible
    successMessage.style.display = "none";

    // Validate all fields
    const isValid = validateForm();

    if (isValid) {
      // Show success message
      successMessage.style.display = "block";

      // Scroll to success message
      successMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });

      // Reset form
      form.reset();

      // Clear all error states
      Object.keys(fields).forEach((fieldName) => {
        clearError(fieldName);
        fields[fieldName].element.classList.remove("input-error");
        fields[fieldName].element.setAttribute("aria-invalid", "false");
      });

      // Focus on success message for screen readers
      successMessage.focus();

      // Hide success message after 5 seconds
      setTimeout(() => {
        successMessage.style.display = "none";
      }, 5000);
    } else {
      // Focus on first error field
      const firstErrorField = Object.keys(fields).find(
        (fieldName) => fields[fieldName].error.textContent
      );
      if (firstErrorField) {
        fields[firstErrorField].element.focus();
      }
    }
  });

  // Make success message focusable for accessibility
  successMessage.setAttribute("tabindex", "-1");
})();
