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
  
  // Reset display if search is empty
  if (searchTerm === "") {
      fileManager.renderSubjectGrid();
      if (resultsCountElement) resultsCountElement.textContent = '';
      return;
  }

  // Create a container for global search results
  container.innerHTML = '';
  const globalResultsSection = document.createElement('div');
  globalResultsSection.className = 'global-search-results';
  
  // Create header for global search results
  const searchHeader = document.createElement('h2');
  searchHeader.textContent = `Risultati della ricerca per: "${searchTerm}"`;
  globalResultsSection.appendChild(searchHeader);

  // Global results tracking
  const globalResults = [];

  // Search across ALL files in ALL subjects
  Object.entries(subjectFiles).forEach(([subject, subjectFileList]) => {
      const matchedFiles = subjectFileList.filter(file => 
          file.name.toLowerCase().includes(searchTerm) || 
          (file.description && file.description.toLowerCase().includes(searchTerm))
      );
      
      // If subject has matching files, create a subject section
      if (matchedFiles.length > 0) {
          const subjectSection = document.createElement('div');
          subjectSection.className = 'search-subject-section';
          
          const subjectTitle = document.createElement('h3');
          subjectTitle.innerHTML = `${fileManager.getSubjectIcon(subject)} ${subject}`;
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
              // Use an IIFE to capture the correct file for the event listener
              (function(currentFile) {
                  fileItem.querySelector('.view-file-btn').addEventListener('click', () => {
                      // Directly call the openFileViewer method with the file's ID
                      console.log("Ok");
                      fileManager.openFileViewer(currentFile.id, currentFile.name);
                  });
              })(file);
              
              fileList.appendChild(fileItem);
          });

          subjectSection.appendChild(fileList);
          globalResultsSection.appendChild(subjectSection);
          globalResults.push(...matchedFiles);
      }
  });

  // If no results found
  if (globalResults.length === 0) {
      const noResultsMessage = document.createElement('p');
      noResultsMessage.textContent = 'Nessun file trovato';
      noResultsMessage.className = 'no-results-message';
      globalResultsSection.appendChild(noResultsMessage);
  }

  // Update results count
  if (resultsCountElement) {
      resultsCountElement.textContent = `${globalResults.length} risultati trovati`;
  }

  // Append global results to container
  container.appendChild(globalResultsSection);
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
