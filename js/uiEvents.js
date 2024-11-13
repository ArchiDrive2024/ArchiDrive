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

function toggleUploadContainer() {
  const uploadContainer = document.getElementById("uploadContainer");
  if (uploadContainer.style.display === "none") {
    uploadContainer.style.display = "flex";
    uploadContainer.classList.add("animate__animated", "animate__fadeInDown");
  } else {
    uploadContainer.classList.add("animate__animated", "animate__fadeOutUp");
    setTimeout(() => {
      uploadContainer.style.display = "none";
      uploadContainer.classList.remove(
        "animate__animated",
        "animate__fadeInDown",
        "animate__fadeOutUp"
      );
    }, 500);
  }
}

function fileUploadNext() {
  const fileNameInput = document.getElementById("fileName");
  const fileInput = document.getElementById("fileInput");
  const btnNext = document.getElementById("file_btnNext");
  const btnFile = document.getElementById("file_btn");
  const btnBack = document.getElementById("btnBack");

  if (
    fileNameInput.style.display === "none" ||
    fileInput.style.display === "block" ||
    btnNext.style.display === "block" ||
    btnFile.style.display === "none" ||
    btnBack.style.display === "none"
  ) {
    fileNameInput.style.display = "block";
    fileInput.style.display = "none";
    btnNext.style.display = "none";
    btnFile.style.display = "block";
    btnBack.style.display = "block";
  } else {
    fileNameInput.style.display = "none";
    fileInput.style.display = "block";
    btnNext.style.display = "block";
    btnFile.style.display = "none";
    btnBack.style.display = "none";
  }
}
