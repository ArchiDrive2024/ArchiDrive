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
      fileManager.renderSubjectGrid();
      return;
  }

  // Creare un contenitore per i risultati di ricerca se non esiste
  let searchResultsContainer = document.getElementById('global-search-results');
  if (!searchResultsContainer) {
      searchResultsContainer = document.createElement('div');
      searchResultsContainer.id = 'global-search-results';
      searchResultsContainer.className = 'global-search-results';
      document.body.insertBefore(searchResultsContainer, document.getElementById('fileList'));
  }

  // Reset del contenitore dei risultati
  searchResultsContainer.innerHTML = '<h2>Risultati della ricerca</h2>';

  // Variabile per tracciare i risultati globali
  const globalResults = [];

  // Ricerca in tutti i file di tutti i subject
  Object.entries(subjectFiles).forEach(([subject, subjectFileList]) => {
      const matchedFiles = subjectFileList.filter(file => 
          file.name.toLowerCase().includes(searchTerm) || 
          (file.description && file.description.toLowerCase().includes(searchTerm))
      );
      
      if (matchedFiles.length > 0) {
          // Creare una sezione per ogni subject con risultati
          const subjectSection = document.createElement('div');
          subjectSection.className = 'search-subject-section';
          
          const subjectTitle = document.createElement('h3');
          subjectTitle.textContent = `${subject} (${matchedFiles.length} risultati)`;
          subjectSection.appendChild(subjectTitle);

          const fileList = document.createElement('ul');
          fileList.className = 'search-file-list';

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

          subjectSection.appendChild(fileList);
          searchResultsContainer.appendChild(subjectSection);
          globalResults.push(...matchedFiles);
      }
  });

  // Nascondere la griglia originale dei subject
  document.getElementById('fileList').style.display = 'none';

  // Aggiornare il conteggio dei risultati
  const resultsCountElement = document.getElementById('search-results-count');
  if (resultsCountElement) {
      resultsCountElement.textContent = `${globalResults.length} risultati trovati`;
  }

  // Aggiungere un pulsante per tornare alla visualizzazione originale
  if (globalResults.length > 0) {
      const resetButton = document.createElement('button');
      resetButton.textContent = 'Torna alla vista originale';
      resetButton.className = 'reset-search-btn';
      resetButton.onclick = () => {
          searchResultsContainer.innerHTML = '';
          document.getElementById('fileList').style.display = 'grid';
          document.getElementById('search-results-count').textContent = '';
      };
      searchResultsContainer.appendChild(resetButton);
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
