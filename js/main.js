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

  form.addEventListener("submit", (event) => {
    const action = form.getAttribute("action") || "";

    if (action.includes("YOUR_EMAIL_HERE")) {
      event.preventDefault();
      status.textContent = "Form email is not connected yet. Replace YOUR_EMAIL_HERE in index.html with your FormSubmit email.";
      return;
    }

    status.textContent = "Sending...";
  });
});

/*
  Email setup options:

  FormSubmit:
  1. Replace both form action values in index.html:
     https://formsubmit.co/YOUR_EMAIL_HERE -> https://formsubmit.co/your@email.com
  2. Submit once from the live site and confirm the activation email from FormSubmit.

  EmailJS alternative:
  1. Add the EmailJS browser SDK script in index.html.
  2. Replace the normal submit handler above with emailjs.sendForm("SERVICE_ID", "TEMPLATE_ID", form).
  3. Add your public key with emailjs.init("PUBLIC_KEY").

  Cloudflare Workers or Netlify Forms can also be connected later by changing each form action.
*/
