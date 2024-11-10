export class Body {
  constructor() {
    this.initTheme(); // Imposta il tema salvato all'avvio
  }

  // Toggle theme
  toggleTheme() {
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

  // Formatta la data
  formatDate(dateString) {
    return new Date(dateString).toLocaleString();
  }

  // Ricevi icone files
  getMimeTypeIcon(mimeType) {
    if (mimeType.includes("image/")) return "🖼️";
    if (mimeType.includes("video/")) return "🎥";
    if (mimeType.includes("audio/")) return "🎵";
    if (mimeType.includes("pdf")) return "📄";
    if (mimeType.includes("spreadsheet")) return "📊";
    if (mimeType.includes("document")) return "📝";
    return "📁";
  }

  // Applica il tema salvato in precedenza
  initTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    document.getElementById("theme-icon").textContent =
      savedTheme === "dark" ? "🌙" : "☀️";
  }
}
