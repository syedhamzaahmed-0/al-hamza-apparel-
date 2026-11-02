
const SUPABASE_URL = "https://myrakbvclnknzuwnyqqm.supabase.co";
const SUPABASE_KEY = "sb_publishable_enl-tpMWqYVW4rVWo8F_Ug_ifJeaNOJ";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Load product images from Supabase
  loadProducts();

  // Product filters
  const filterButtons = document.querySelectorAll("[data-filter]");
  const productCards = document.querySelectorAll(".product-card");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach(item => item.classList.remove("active"));
      button.classList.add("active");

      productCards.forEach(card => {
        card.hidden =
          filter !== "all" && card.dataset.category !== filter;
      });
    });
  });

  // Configure product buttons
  document.querySelectorAll(".choose-product").forEach(button => {
    button.addEventListener("click", () => {
      const product = button.dataset.product;
      const productType = document.getElementById("productType");

      if (productType) {
        const option = Array.from(productType.options).find(
          item => item.textContent.trim() === product
        );

        if (option) productType.value = option.value;
      }

      document.getElementById("custom")?.scrollIntoView({
        behavior: "smooth"
      });
    });
  });

  // Reference image filename
  const referenceImage = document.getElementById("referenceImage");
  const fileName = document.getElementById("fileName");

  if (referenceImage && fileName) {
    referenceImage.addEventListener("change", () => {
      fileName.textContent = referenceImage.files.length
        ? referenceImage.files[0].name
        : "No image selected";
    });
  }

  // WhatsApp order form
  const orderForm = document.getElementById("orderForm");

  if (orderForm) {
    orderForm.addEventListener("submit", event => {
      event.preventDefault();

      const quantity = Number(
        document.getElementById("quantity").value
      );

      const messageBox = document.getElementById("formMessage");

      if (quantity < 100) {
        messageBox.textContent =
          "Minimum order quantity is 100 pieces.";
        return;
      }

      const getValue = id =>
        document.getElementById(id)?.value.trim() || "Not specified";

      const message = [
        "Hello Al Hamza Apparel, I would like a garment manufacturing quotation.",
        "",
        "Product: " + getValue("productType"),
        "Quantity: " + quantity + " pieces",
        "Fabric quality: " + getValue("quality"),
        "Fabric preference: " + getValue("fabric"),
        "Colour: " + getValue("colour"),
        "Size range: " + getValue("sizes"),
        "Branding: " + getValue("branding"),
        "Target price: " + getValue("targetPrice"),
        "Country: " + getValue("country"),
        "Extra requirements: " + getValue("details"),
        "",
        "Please share your quotation."
      ].join("\n");

      messageBox.textContent =
        "Opening WhatsApp. Please attach your reference picture manually if selected.";

      window.open(
        "https://wa.me/923132956340?text=" +
        encodeURIComponent(message),
        "_blank"
      );
    });
  }

  // Footer year
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});


// Match existing website cards with Supabase product names
function normalizeProductName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/&amp;/g, "and")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");
}


// Fetch saved products and update their website images
async function loadProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  try {
    const { data: products, error } = await db
      .from("products")
      .select("id,name,category,description,image_url,active")
      .eq("active", true);

    if (error) {
      console.error("Supabase product loading error:", error);
      return;
    }

    if (!products || products.length === 0) {
      console.log("No active products found in Supabase.");
      return;
    }

    const cards = grid.querySelectorAll(".product-card");

    products.forEach(product => {
      if (!product.name || !product.image_url) return;

      const savedName = normalizeProductName(product.name);

      cards.forEach(card => {
        const cardName = normalizeProductName(
          card.getAttribute("data-product")
        );

        if (savedName !== cardName) return;

        const image = card.querySelector(".product-photo");

        if (image) {
          image.src = product.image_url;
          image.removeAttribute("srcset");
          image.loading = "lazy";
          image.onerror = () => {
            console.error("Product image could not load:", product.image_url);
          };
        }

        card.dataset.supabaseProductId = product.id;
      });
    });

    console.log("Website product images updated from Supabase.");

  } catch (error) {
    console.error("Website product loading failed:", error);
  }
}
