// Updated FileManager class with improved search capabilities
class FileManager {
  constructor() {
      this.allFiles = [];
      this.folderStructure = {
          'Matematica': ['Algebra', 'Geometria', 'Calcolo'],
          'Indirizzo Informatico': ['Programmazione', 'Sistemi', 'Reti'],
          'Italiano': ['Letteratura', 'Grammatica', 'Analisi'],
          'Storia': ['Storia Moderna', 'Storia Antica', 'Cronologia'],
          'Inglese': ['Grammar', 'Vocabulary', 'Conversation'],
          'Fisica': ['Meccanica', 'Termodinamica', 'Elettromagnetismo'],
          'TTRG': ['Disegno Tecnico', 'Progettazione'],
          'Telecomunicazioni': ['Reti', 'Protocolli', 'Comunicazione'],
          'Geografia': ['Geografia Fisica', 'Geopolitica'],
          'Diritto': ['Diritto Civile', 'Diritto Pubblico'],
          'Indirizzo Meccanico': ['Meccanica Applicata', 'Macchine'],
          'Indirizzo Chimico': ['Chimica Organica', 'Chimica Inorganica'],
          'Indirizzo di Automazione': ['Robotica', 'Sistemi di Controllo'],
          'Scienze Motorie': ['Teoria', 'Pratica']
      };
  }

  async loadFiles() {
      try {
          const response = await fetch("https://archidriveserver.x10.mx/get_files.php");
          const data = await response.json();
          this.allFiles = data.files.map(file => ({
              ...file,
              fullPath: this.extractFullPath(file.name)
          }));
          this.categorizeFiles();
          this.renderSubjectGrid();
      } catch (error) {
          console.error("Errore nel caricamento dei file:", error);
      }
  }

  extractFullPath(fileName) {
      // Extract potential folder structure from filename
      const pathParts = fileName.split('/');
      return pathParts.slice(0, -1).join('/');
  }

  determineSubject(fileName, description, fullPath) {
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
      const searchText = (fileName + ' ' + (description || '') + ' ' + fullPath).toLowerCase();

      // First, check for direct subject keywords
      for (const [subject, keywords] of Object.entries(subjectKeywords)) {
          if (keywords.some(keyword => searchText.includes(keyword))) {
              return subject;
          }
      }

      // Then, check folder structure
      for (const [subject, subfolders] of Object.entries(this.folderStructure)) {
          if (subfolders.some(subfolder => searchText.includes(subfolder.toLowerCase()))) {
              return subject;
          }
      }

      return null;
  }

  categorizeFiles() {
      // Reset subject files
      Object.keys(subjectFiles).forEach(subject => subjectFiles[subject] = []);

      this.allFiles.forEach(file => {
          const subjectMatch = this.determineSubject(file.name, file.description, file.fullPath);
          if (subjectMatch) {
              subjectFiles[subjectMatch].push(file);
          } else {
              // Default to a general category if no match
              subjectFiles['Matematica'].push(file);
          }
      });
  }
}

// Update the global filterFiles function
function filterFiles() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  
  if (searchTerm === "") {
      fileManager.renderSubjectGrid();
      return;
  }

  // Create a global result set
  const globalResults = [];

  // Search across ALL files in ALL subjects, now including full path
  Object.values(subjectFiles).forEach(subjectFileList => {
      const matchedFiles = subjectFileList.filter(file => 
          file.name.toLowerCase().includes(searchTerm) || 
          (file.description && file.description.toLowerCase().includes(searchTerm)) ||
          (file.fullPath && file.fullPath.toLowerCase().includes(searchTerm))
      );
      
      globalResults.push(...matchedFiles);
  });

  // Temporarily update categorization with search results
  fileManager.allFiles = globalResults;
  fileManager.categorizeFiles();
  fileManager.renderSubjectGrid();

  // Optional: Add search result count feedback
  const resultsCountElement = document.getElementById('search-results-count');
  if (resultsCountElement) {
      resultsCountElement.textContent = `${globalResults.length} risultati trovati`;
  }
}
function closeFileViewer() {
  const modal = document.getElementById("fileViewerModal");
  modal.style.display = "none";
  document.getElementById("fileContent").innerHTML = "";
}
