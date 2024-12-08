// Updated file categorization and management system
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

  getSubjectIcon(subject) {
      const icons = {
          'Matematica': '📐',
          'Indirizzo Informatico': '💻',
          'Italiano': '📖',
          'Storia': '🏛️',
          'Inglese': '🇬🇧',
          'Fisica': '⚛️',
          'TTRG': '📏',
          'Telecomunicazioni': '📡',
          'Geografia': '🌍',
          'Diritto': '⚖️',
          'Indirizzo Meccanico': '🔧',
          'Indirizzo Chimico': '🧪',
          'Indirizzo di Automazione': '🤖',
          'Scienze Motorie': '🏀'
      };
      return icons[subject] || '📄';
  }

  showSubjectFiles(subject) {
      const modalContent = document.createElement('div');
      modalContent.className = 'subject-modal';
      modalContent.innerHTML = `
          <div class="modal-header">
              <h2>${subject}</h2>
              <button class="close-modal">×</button>
          </div>
          <ul class="full-file-list"></ul>
      `;

      const fileList = modalContent.querySelector('.full-file-list');
      subjectFiles[subject].forEach(file => {
          const fileItem = document.createElement('li');
          fileItem.innerHTML = `
              <div class="file-info">
                  <span class="file-name">${file.name}</span>
                  <small class="file-description">${file.description || 'Nessuna descrizione'}</small>
              </div>
              <button class="view-file-btn">Apri</button>
          `;
          fileItem.querySelector('.view-file-btn').onclick = () => this.openFileViewer(file.id, file.name);
          fileList.appendChild(fileItem);
      });

      // Create modal
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.appendChild(modalContent);
      document.body.appendChild(modal);

      // Close modal functionality
      modalContent.querySelector('.close-modal').onclick = () => {
          document.body.removeChild(modal);
      };
  }

  openFileViewer(fileId, fileName) {
      // Existing file viewer logic
      const modal = document.getElementById("fileViewerModal");
      const content = document.getElementById("fileContent");
      const loading = document.getElementById("loadingViewer");

      modal.style.display = "flex";
      content.style.display = "none";
      loading.style.display = "block";

      fetch(`https://archidriveserver.x10.mx/get_view_link.php?fileId=${fileId}`)
          .then((response) => response.json())
          .then((data) => {
              loading.style.display = "none";
              content.style.display = "block";

              if (data.webViewLink) {
                  content.innerHTML = `<iframe src="${data.webViewLink}" allowfullscreen></iframe>`;
              } else {
                  content.innerHTML = "Impossibile visualizzare il file";
              }
          })
          .catch((error) => {
              loading.style.display = "none";
              content.innerHTML = "Errore nel caricamento del file";
          });
  }
}

// Initialize file manager
const fileManager = new FileManager();

// Replace existing load files function
function loadDriveFiles() {
  fileManager.loadFiles();
}

function filterFiles() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const container2 = document.getElementById('fileList2');
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
    container2.innerHTML = '';
    if (globalResults.length > 0) {
      container2.appendChild(globalResultsContainer);
      resultsCountElement.textContent = `${globalResults.length} risultati trovati`;
    } else {
      // Nessun risultato trovato
      const noResultsMessage = document.createElement('div');
      noResultsMessage.className = 'no-results';
      noResultsMessage.textContent = 'Nessun file trovato';
      container2.appendChild(noResultsMessage);
      resultsCountElement.textContent = '0 risultati trovati';
    }
}

function closeFileViewer() {
  const modal2 = document.getElementById("fileViewerModal");
  modal2.style.display = "none";
  document.getElementById("fileContent").innerHTML = "";
}
