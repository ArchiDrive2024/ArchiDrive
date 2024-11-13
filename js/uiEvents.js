function toggleTheme() {
  const body = document.documentElement;
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  body.setAttribute("data-theme", newTheme);
  const icon = document.getElementById("theme-icon");
  icon.textContent = newTheme === "dark" ? "🌙" : "☀️";
  localStorage.setItem("theme", newTheme);
}

function filterFiles() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();

  if (searchTerm === "") {
    displayFiles(allFiles);
    return;
  }

  const filteredFiles = allFiles.filter((file) =>
    file.name.toLowerCase().includes(searchTerm)
  );

  const fileList = document.getElementById("fileList");
  fileList.innerHTML = "";

  if (filteredFiles.length === 0) {
    fileList.innerHTML = `
            <div class="file-list-empty">
                Nessun risultato per "${searchTerm}"
            </div>
        `;
    return;
  }

  filteredFiles.forEach((file) => {
    const listItem = document.createElement("li");
    listItem.className = "file-list-item search-result";

    const fileName = file.name.replace(
      new RegExp(searchTerm, "gi"),
      (match) => `<span class="highlight">${match}</span>`
    );

    listItem.innerHTML = `
            <div class="file-icon">📄</div>
            <div class="file-details">
                <div class="file-name">${fileName}</div>
                <div class="file-info">Modificato: ${new Date(
                  file.modifiedTime
                ).toLocaleDateString()}</div>
            </div>
        `;
    listItem.onclick = () => openFileViewer(file.id, file.name);
    fileList.appendChild(listItem);
  });
}

function toggleFileUploadSection() {
  const fileUploadSection = document.getElementById("fileUploadSection");
  fileUploadSection.classList.toggle("open");
  fileUploadSection.classList.toggle("close");
}
