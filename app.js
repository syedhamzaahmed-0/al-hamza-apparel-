
document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#mainNav");

  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = menu.getAttribute("aria-expanded") === "true";
      menu.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
      menu.setAttribute(
        "aria-label",
        open ? "Open navigation" : "Close navigation"
      );
    });
  }

  // Product filters
  const filterButtons = document.querySelectorAll("[data-filter]");
  const productCards = document.querySelectorAll(".product-card");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach(item => {
        item.classList.toggle("active", item === button);
      });

      productCards.forEach(card => {
        card.hidden =
          filter !== "all" &&
          card.dataset.category !== filter;
      });
    });
  });

  // Product Configure buttons
  document.querySelectorAll(".choose-product").forEach(button => {
    button.addEventListener("click", () => {
      const product = button.dataset.product;
      const productSelect = document.getElementById("productType");
      const form = document.getElementById("custom");

      if (productSelect) {
        const matchingOption = Array.from(productSelect.options)
          .find(option => option.text.trim() === product);

        if (matchingOption) {
          productSelect.value = matchingOption.value;
        }
      }

      if (form) {
        form.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Reference image filename
  const imageInput = document.getElementById("referenceImage");
  const fileName = document.getElementById("fileName");

  if (imageInput && fileName) {
    imageInput.addEventListener("change", () => {
      fileName.textContent =
        imageInput.files.length > 0
          ? "Selected: " + imageInput.files[0].name
          : "No image selected";
    });
  }

  // Order enquiry to WhatsApp
  const form = document.getElementById("orderForm");
  const formMessage = document.getElementById("formMessage");

  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();

      const getValue = id =>
        document.getElementById(id)?.value.trim() || "";

      const product = getValue("productType");
      const quantity = Number(getValue("quantity"));
      const quality = getValue("quality");

      if (!product || !quality || !Number.isInteger(quantity) ||
          quantity < 100) {
        if (formMessage) {
          formMessage.textContent =
            "Please select a product and fabric quality, and enter a quantity of at least 100.";
        }
        return;
      }

      const image = imageInput?.files?.[0];

      const message = [
        "Hello Al Hamza Apparel!",
        "",
        "I would like a garment manufacturing quotation.",
        "",
        "ORDER DETAILS",
        "Product: " + product,
        "Quantity: " + quantity + " pieces",
        "Fabric quality: " + quality,
        "Fabric preference: " + getValue("fabric"),
        "Colour: " + getValue("colour"),
        "Size range: " + (getValue("sizes") || "Not specified"),
        "Branding: " + getValue("branding"),
        "Target price per piece: " +
          (getValue("targetPrice") || "Please quote"),
        "Destination country: " +
          (getValue("country") || "Not specified"),
        "Extra requirements: " +
          (getValue("details") || "None"),
        "Reference image: " +
          (image ? image.name + " (will attach separately)" : "Not provided"),
        "",
        "Please review my requirements and provide a quotation.",
        "",
        "Thank you."
      ].join("\n");

      const whatsappURL =
        "https://wa.me/923132956340?text=" +
        encodeURIComponent(message);

      if (formMessage) {
        formMessage.textContent =
          "Opening WhatsApp with your enquiry...";
      }

      // Open WhatsApp from the customer's submit action
      window.location.href = whatsappURL;
    });
  }

  // Footer year
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const currentYear = document.getElementById("current-year");
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
});
                                          
