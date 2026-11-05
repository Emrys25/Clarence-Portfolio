/* ==========================================================================
   CLARENCE EMRYS LION | DEVELOPER PORTFOLIO JS
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic Year Update
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Mobile Menu Toggle
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener("click", () => {
      const expanded =
        toggleBtn.getAttribute("aria-expanded") === "true" || false;
      toggleBtn.setAttribute("aria-expanded", !expanded);
      mobileMenu.classList.toggle("active");
      mobileMenu.setAttribute("aria-hidden", expanded);
    });
  }
});

// 3. WhatsApp Direct Submission Helper
function sendToWhatsApp() {
  const nameInput = document.getElementById("name");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");

  const name = nameInput ? nameInput.value.trim() : "";
  const subject = subjectInput ? subjectInput.value.trim() : "";
  const message = messageInput ? messageInput.value.trim() : "";

  if (!name || !message) {
    alert("Please fill in your name and message before sending via WhatsApp.");
    return;
  }

  const encodedText = `Hi Clarence, my name is ${encodeURIComponent(name)}.%0A%0ASubject: ${encodeURIComponent(subject)}%0A%0A${encodeURIComponent(message)}`;

  // Replace 27123456789 with your real South African WhatsApp phone number when ready
  const waNumber = "27123456789";
  const waUrl = `https://wa.me/${waNumber}?text=${encodedText}`;

  window.open(waUrl, "_blank");
}
