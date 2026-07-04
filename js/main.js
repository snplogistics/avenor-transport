const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const year = document.querySelector("[data-year]");
const forms = document.querySelectorAll("[data-form]");

if (year) {
  year.textContent = new Date().getFullYear();
}

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  header?.classList.toggle("is-open", Boolean(isOpen));
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    header?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

forms.forEach((form) => {
  const status = form.querySelector(".form-status");
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const action = form.getAttribute("action") || "";
    const endpoint = action.replace("https://formsubmit.co/", "https://formsubmit.co/ajax/");

    if (action.includes("YOUR_EMAIL_HERE")) {
      status.textContent = "This form is not connected yet.";
      status.dataset.state = "error";
      return;
    }

    submitButton.disabled = true;
    status.textContent = "Sending...";
    status.dataset.state = "pending";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      form.reset();
      status.textContent = "Thanks. Your message has been sent.";
      status.dataset.state = "success";
    } catch (error) {
      status.textContent = "Sorry, the message could not be sent. Please email manager@avenortransport.com directly.";
      status.dataset.state = "error";
    } finally {
      submitButton.disabled = false;
    }
  });
});
