document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");

  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = menu.getAttribute("aria-expanded") === "true";
      menu.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
  }

  // WhatsApp enquiry buttons
  document.querySelectorAll(".whatsapp-button, [data-whatsapp]")
    .forEach(button => {
      button.addEventListener("click", event => {
        const message =
          button.dataset.message ||
          "Hello Al Hamza Apparel, I want information about your garments.";

        const url =
          "https://wa.me/923132956340?text=" +
          encodeURIComponent(message);

        window.open(url, "_blank", "noopener,noreferrer");
      });
    });

  // Product enquiry buttons
  document.querySelectorAll("[data-product]").forEach(button => {
    button.addEventListener("click", () => {
      const product = button.dataset.product;
      const message = `Hello Al Hamza Apparel, I am interested in ${product}. Please share details and quotation.`;

      window.open(
        "https://wa.me/923132956340?text=" +
        encodeURIComponent(message),
        "_blank"
      );
    });
  });

  // Footer year
  const year = document.querySelector("#current-year");
  if (year) year.textContent = new Date().getFullYear();
});
