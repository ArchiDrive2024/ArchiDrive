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
  const container = document.getElementById('fileList');
  const resultsCountElement = document.getElementById('search-results-count');

  if (searchTerm === "") {
    // Se la ricerca è vuota, ripristina la visualizzazione originale
    fileManager.renderSubjectGrid();
    resultsCountElement.textContent = '';
    return;
  }

  // Crea un contenitore per i risultati globali
  const globalResultsContainer = document.createElement('div');
  globalResultsContainer.className = 'global-search-results';
  globalResultsContainer.innerHTML = `<h2>Risultati della ricerca: "${searchTerm}"</h2>`;

  // Variabile per tracciare i risultati globali
  const globalResults = [];

  // Ricerca in tutti i file di tutti i soggetti
  Object.entries(subjectFiles).forEach(([subject, subjectFileList]) => {
    const matchedFiles = subjectFileList.filter(file => 
      file.name.toLowerCase().includes(searchTerm) || 
      (file.description && file.description.toLowerCase().includes(searchTerm))
    );
    
    // Se ci sono risultati per questo soggetto, creali
    if (matchedFiles.length > 0) {
      const subjectResultContainer = document.createElement('div');
      subjectResultContainer.className = 'subject-search-result';
      
      const subjectHeader = document.createElement('h3');
      subjectHeader.innerHTML = `
        ${fileManager.getSubjectIcon(subject)} ${subject} 
        <span class="result-count">${matchedFiles.length} file</span>
      `;
      subjectResultContainer.appendChild(subjectHeader);

      const fileList = document.createElement('ul');
      fileList.className = 'search-result-file-list';
      
      matchedFiles.forEach(file => {
        const fileItem = document.createElement('li');
        fileItem.innerHTML = `
          <div class="file-info">
            <span class="file-name">${file.name}</span>
            <small class="file-description">${file.description || 'Nessuna descrizione'}</small>
          </div>
          <button class="view-file-btn">Apri</button>
        `;
        fileItem.querySelector('.view-file-btn').onclick = () => fileManager.openFileViewer(file.id, file.name);
        fileList.appendChild(fileItem);
      });

      subjectResultContainer.appendChild(fileList);
      globalResultsContainer.appendChild(subjectResultContainer);
      globalResults.push(...matchedFiles);
    }
  });

  // Svuota il container principale e aggiungi i risultati
  container.innerHTML = '';
  if (globalResults.length > 0) {
    container.appendChild(globalResultsContainer);
    resultsCountElement.textContent = `${globalResults.length} risultati trovati`;
  } else {
    // Nessun risultato trovato
    const noResultsMessage = document.createElement('div');
    noResultsMessage.className = 'no-results';
    noResultsMessage.textContent = 'Nessun file trovato';
    container.appendChild(noResultsMessage);
    resultsCountElement.textContent = '0 risultati trovati';
  }
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
