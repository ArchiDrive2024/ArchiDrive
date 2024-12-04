let subjectFiles = {
  'Matematica': [],
  'Indirizzo Informatico': [],
  'Italiano': [],
  'Storia': [],
  'Inglese': [],
  'Fisica': [],
  'TTRG': [],
  'Telecomunicazioni': [],
  'Geografia': [],
  'Diritto': [],
  'Indirizzo Meccanico': [],
  'Indirizzo Chimico': [],
  'Indirizzo di Automazione': [],
  'Scienze Motorie': []
};

class FileManager {
  constructor() {
      this.allFiles = [];
  }

  async loadFiles() {
      try {
          const response = await fetch("https://archidriveserver.x10.mx/get_files.php");
          const data = await response.json();
          this.allFiles = data.files;
          this.categorizeFiles();
          this.renderSubjectGrid();
      } catch (error) {
          console.error("Errore nel caricamento dei file:", error);
      }
  }

  categorizeFiles() {
      // Reset subject files
      Object.keys(subjectFiles).forEach(subject => subjectFiles[subject] = []);

      this.allFiles.forEach(file => {
          const subjectMatch = this.determineSubject(file.name, file.description);
          if (subjectMatch) {
              subjectFiles[subjectMatch].push(file);
          } else {
              // Default to a general category if no match
              subjectFiles['Matematica'].push(file);
          }
      });
  }

  determineSubject(fileName, description) {
      // Implement intelligent subject matching logic
      const subjectKeywords = {
          'Matematica': ['math', 'matematica', 'algebra', 'geometria', 'calcolo'],
          'Indirizzo Informatico': ['coding', 'programmazione', 'informatica', 'code', 'software'],
          'Italiano': ['italiano', 'letteratura', 'grammatica', 'analisi'],
          'Storia': ['storia', 'storico', 'evento', 'cronologia'],
          'Inglese': ['english', 'lingua inglese', 'grammar', 'vocabulary'],
          'Fisica': ['fisica', 'energia', 'movimento', 'fisica'],
          'TTRG': ['ttrg', 'disegno', 'tecnico', 'progettazione'],
          'Telecomunicazioni': ['telecomunicazioni', 'network', 'comunicazione'],
          'Geografia': ['geografia', 'mappe', 'territorio', 'geologia'],
          'Diritto': ['diritto', 'legge', 'giuridico', 'normativa'],
          'Indirizzo Meccanico': ['meccanica', 'motore', 'macchina', 'ingranaggio'],
          'Indirizzo Chimico': ['chimica', 'reazione', 'molecola', 'elemento'],
          'Indirizzo di Automazione': ['automazione', 'robotica', 'controllo', 'sistema'],
          'Scienze Motorie': ['sport', 'movimento', 'fisico', 'attività']
      };

      // Check both filename and description
      const searchText = (fileName + ' ' + (description || '')).toLowerCase();

      for (const [subject, keywords] of Object.entries(subjectKeywords)) {
          if (keywords.some(keyword => searchText.includes(keyword))) {
              return subject;
          }
      }

      return null;
  }

  renderSubjectGrid() {
      const container = document.getElementById('fileList');
      container.innerHTML = '';
      container.className = 'subject-grid';

      Object.entries(subjectFiles).forEach(([subject, files]) => {
          const subjectCard = document.createElement('div');
          subjectCard.className = 'subject-card';
          
          // Subject icon and name
          const subjectHeader = document.createElement('div');
          subjectHeader.className = 'subject-header';
          subjectHeader.innerHTML = `
              <div class="subject-icon">${this.getSubjectIcon(subject)}</div>
              <h2>${subject}</h2>
              <span class="file-count">${files.length} file</span>
          `;

          // File list
          const fileList = document.createElement('ul');
          fileList.className = 'subject-file-list';
          
          files.slice(0, 3).forEach(file => {
              const fileItem = document.createElement('li');
              fileItem.innerHTML = `
                  <span class="file-name">${file.name}</span>
                  <small class="file-description">${file.description || 'Nessuna descrizione'}</small>
              `;
              fileItem.onclick = () => this.openFileViewer(file.id, file.name);
              fileList.appendChild(fileItem);
          });

          // View all button
          const viewAllBtn = document.createElement('button');
          viewAllBtn.textContent = 'Vedi tutti i file';
          viewAllBtn.className = 'view-all-btn';
          viewAllBtn.onclick = () => this.showSubjectFiles(subject);

          subjectCard.appendChild(subjectHeader);
          subjectCard.appendChild(fileList);
          subjectCard.appendChild(viewAllBtn);

          container.appendChild(subjectCard);
      });
  }

  // Enhanced filterFiles method
  filterFiles() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const searchResultsCountElement = document.getElementById('search-results-count');
    
    if (searchTerm === "") {
        this.renderSubjectGrid();
        searchResultsCountElement.textContent = '';
        return;
    }

    // Create a comprehensive search across all subjects
    const globalResults = [];

    // Search method that checks multiple attributes and subject context
    const advancedFileSearch = (file, term) => {
        const searchAttributes = [
            file.name.toLowerCase(), 
            (file.description || '').toLowerCase(),
            this.determineSubject(file.name, file.description) || ''
        ];

        // Check if any attribute contains the search term
        return searchAttributes.some(attr => attr.includes(term));
    };

    // Search across ALL files in ALL subjects
    Object.values(subjectFiles).forEach(subjectFileList => {
        const matchedFiles = subjectFileList.filter(file => 
            advancedFileSearch(file, searchTerm)
        );
        
        globalResults.push(...matchedFiles);
    });

    // Temporarily update categorization with search results
    this.allFiles = globalResults;
    this.categorizeFiles();
    this.renderSubjectGrid();

    // Update search results count
    if (searchResultsCountElement) {
        searchResultsCountElement.textContent = `${globalResults.length} risultati trovati`;
    }
  }
}

function closeFileViewer() {
  const modal2 = document.getElementById("fileViewerModal");
  modal2.style.display = "none";
  document.getElementById("fileContent").innerHTML = "";
}
