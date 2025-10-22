// app.js — improved single-file SPA + form validation
document.addEventListener("DOMContentLoaded", () => {
  // ----- Navigation (hash-based SPA) -----
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const pages = Array.from(document.querySelectorAll(".page"));

  function getDefaultPageId() {
    return "home";
  }

  function showPage(pageId) {
    // fallback to default if page doesn't exist
    const targetPage = document.getElementById(pageId) || document.getElementById(getDefaultPageId());
    if (!targetPage) return;

    // hide all pages, remove active from links
    pages.forEach((p) => p.classList.remove("active"));
    navLinks.forEach((l) => l.classList.remove("active"));

    // show target page
    targetPage.classList.add("active");

    // mark corresponding nav link (if exists)
    const targetLink = document.querySelector(`a[href="#${pageId}"]`);
    if (targetLink) targetLink.classList.add("active");

    // accessibility: move focus to a heading inside the page (if present)
    const heading = targetPage.querySelector("h1, h2, h3");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }

    // smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // add click handlers to nav links (only handle hash links)
  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    // Only intercept links that are hashes for SPA behavior
    if (!href.startsWith("#")) return;

    link.addEventListener("click", (e) => {
      e.preventDefault();
      const pageId = href.substring(1) || getDefaultPageId();
      showPage(pageId);
      // update URL hash and push history state
      history.pushState({ page: pageId }, "", `#${pageId}`);
    });
  });

  // handle back/forward (popstate) and direct hash changes
  window.addEventListener("popstate", () => {
    const pageId = (location.hash && location.hash.substring(1)) || getDefaultPageId();
    showPage(pageId);
  });

  // also react to hashchange just in case
  window.addEventListener("hashchange", () => {
    const pageId = (location.hash && location.hash.substring(1)) || getDefaultPageId();
    showPage(pageId);
  });

  // initial page on load
  const initialPage = (location.hash && location.hash.substring(1)) || getDefaultPageId();
  showPage(initialPage);

  // ----- Form Validation (robust + DRY) -----
  const contactForm = document.getElementById("contactForm");
  const successMessage = document.getElementById("successMessage");

  // helper to safely get element by id
  const $ = (id) => document.getElementById(id);

  const fields = {
    name: {
      element: $("name"),
      error: $("nameError"),
      validate: (v) => typeof v === "string" && v.trim().length >= 2,
    },
    email: {
      element: $("email"),
      error: $("emailError"),
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    },
    subject: {
      element: $("subject"),
      error: $("subjectError"),
      validate: (v) => typeof v === "string" && v.trim() !== "",
    },
    message: {
      element: $("message"),
      error: $("messageError"),
      validate: (v) => typeof v === "string" && v.trim().length >= 10,
    },
  };

  function validateField(fieldName) {
    const field = fields[fieldName];
    if (!field || !field.element) return true; // if a field is missing, treat as valid

    const value = field.element.value ?? "";
    const isValid = Boolean(field.validate(value));

    if (isValid) {
      field.element.classList.remove("error");
      field.error?.classList.remove("show");
      field.element.removeAttribute("aria-invalid");
    } else {
      field.element.classList.add("error");
      field.error?.classList.add("show");
      field.element.setAttribute("aria-invalid", "true");
    }

    return isValid;
  }

  // attach listeners for fields that actually exist
  Object.keys(fields).forEach((fieldName) => {
    const f = fields[fieldName];
    if (!f || !f.element) return;

    // blur validation
    f.element.addEventListener("blur", () => validateField(fieldName));

    // validate while typing only if already invalid to avoid noisy UX
    f.element.addEventListener("input", () => {
      if (f.element.classList.contains("error")) validateField(fieldName);
    });
  });

  // form submit handling
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let isFormValid = true;
      Object.keys(fields).forEach((fieldName) => {
        if (!validateField(fieldName)) isFormValid = false;
      });

      if (isFormValid) {
        // show success
        successMessage?.classList.add("show");

        // reset form
        contactForm.reset();

        // clear error states
        Object.keys(fields).forEach((fieldName) => {
          const f = fields[fieldName];
          if (f?.element) {
            f.element.classList.remove("error");
            f.error?.classList.remove("show");
            f.element.removeAttribute("aria-invalid");
          }
        });

        // hide success after a while
        setTimeout(() => successMessage?.classList.remove("show"), 5000);
      } else {
        // focus first invalid input
        const firstInvalid = Object.keys(fields).find(
          (name) => fields[name]?.element && fields[name].element.classList.contains("error")
        );
        if (firstInvalid) fields[firstInvalid].element.focus();
      }
    });
  }

  // Optional: keyboard accessible nav (activate link with Enter when focused)
  navLinks.forEach((link) => {
    link.addEventListener("keydown", (e) => {
      const href = link.getAttribute("href") || "";
      if ((e.key === "Enter" || e.key === " ") && href.startsWith("#")) {
        e.preventDefault();
        const pageId = href.substring(1) || getDefaultPageId();
        showPage(pageId);
        history.pushState({ page: pageId }, "", `#${pageId}`);
      }
    });
  });
});
