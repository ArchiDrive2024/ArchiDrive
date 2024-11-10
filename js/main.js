function toggleTheme() {
  const body = document.documentElement;
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  body.setAttribute("data-theme", newTheme);

  // Aggiorna l'icona
  const icon = document.getElementById("theme-icon");
  icon.textContent = newTheme === "dark" ? "🌙" : "☀️";

  // Salva la preferenza
  localStorage.setItem("theme", newTheme);
}

// Applica il tema salvato in precedenza
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
document.getElementById("theme-icon").textContent =
  savedTheme === "dark" ? "🌙" : "☀️";
