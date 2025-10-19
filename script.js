// Update timestamp on page load and every second
function updateTimestamp() {
  const timestamp = Date.now();
  document.getElementById("timestamp").textContent = timestamp;
}

// Initial update
updateTimestamp();

// Update every second
setInterval(updateTimestamp, 1000);

// Optional: Add smooth scroll reveal animation
document.addEventListener("DOMContentLoaded", () => {
  const card = document.querySelector(".card");
  (card.style.opacity = "0"), (card.style.transform = "translateY(30)");

  setTimeout(() => {
    card.style.transition = "all 0.6s ease";
    card.style.opacity = "1";
    card.style.transform = "translateY(0)";
  }, 100);
});

// Add hover effect to social icons
const socialIcons = document.querySelectorAll(".icon-link");
socialIcons.forEach((icon) => {
  icon.addEventListener("mouseenter", function () {
    (this.style.transform = translateY(-5)), scale(1.1);
  });

  icon.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});
