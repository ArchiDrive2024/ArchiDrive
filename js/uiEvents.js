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
      fileManager.renderSubjectGrid();
      if (resultsCountElement) resultsCountElement.textContent = '';
      return;
  }

  container.innerHTML = '';
  container.classList.remove("subject-grid")
  const globalResultsSection = document.createElement('div');
  globalResultsSection.className = 'global-search-results';
  
  const searchHeader = document.createElement('h2');
  searchHeader.textContent = `Risultati della ricerca per: "${searchTerm}"`;
  globalResultsSection.appendChild(searchHeader);

  const globalResults = [];

  Object.entries(subjectFiles).forEach(([subject, subjectFileList]) => {
      const matchedFiles = subjectFileList.filter(file => 
          file.name.toLowerCase().includes(searchTerm) || 
          (file.description && file.description.toLowerCase().includes(searchTerm))
      );

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
                      <small class="file-description">${"- " + file.description || 'Nessuna descrizione'}</small>
                  </div>
                  <button class="view-file-btn">Apri</button>
              `;
              (function(currentFile) {
                  fileItem.querySelector('.view-file-btn').addEventListener('click', () => {
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

  if (globalResults.length === 0) {
      const noResultsMessage = document.createElement('p');
      noResultsMessage.textContent = 'Nessun file trovato';
      noResultsMessage.className = 'no-results-message';
      globalResultsSection.appendChild(noResultsMessage);
  }

  if (resultsCountElement) {
      resultsCountElement.textContent = `${globalResults.length} risultati trovati`;
  }

  container.appendChild(globalResultsSection);
}