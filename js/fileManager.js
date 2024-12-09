// Updated file categorization and management system
let subjectFiles = {
  'Indirizzo Informatico': [],
  'Indirizzo di Automazione': [],
  'Indirizzo Meccanico': [],
  'Indirizzo Chimico': [],
  'Matematica': [],
  'Telecomunicazioni': [],
  'Italiano': [],
  'Storia': [],
  'Inglese': [],
  'Fisica': [],
  'TTRG': [],
  'Scienze Motorie': [],
  'Diritto': [],
  'Geografia': [],
  'Altro': []
};

class FileManager {
  constructor() {
      this.allFiles = [];
  }

async loadFiles() {
    try {
        const response = await fetch("https://archidriveserver.x10.mx/get_files.php");
        const data = await response.json();
        this.allFiles = data.files.map(file => ({
            ...file,
            fullPath: file.fullPath || ''
        }));
        this.categorizeFiles();
        this.renderSubjectGrid();
    } catch (error) {
        console.error("Errore nel caricamento dei file:", error);
    }
}

categorizeFiles() {
    // Resetta le categorie
    Object.keys(subjectFiles).forEach(subject => (subjectFiles[subject] = []));

    // Categorizza i file
    this.allFiles.forEach(file => {
        const folderPath = file.fullPath || '';
        const subjectMatch = this.determineSubject(file.name, file.description, folderPath);
        console.log("*" + folderPath + "* " + subjectMatch);
        const category = subjectMatch || 'Altro';
        subjectFiles[category].push(file);
    });

    // Log per debug
    console.log("Categorie aggiornate:", subjectFiles);
}

determineSubject(fileName, description, fullPath = '') {
    const folderSubjectMap = {
        'Matematica': '/1O6fI9sSjWfzCwloXZJHqLykx2NstQKC6',
        'Indirizzo Informatico': '/1viclutz7KMs5c29MwwhcK85oc5SRRzxO',
        'Storia': '/1ywtyKG6T7I-M65ytZkzXzfX7oI7ZGxxp',
        'Italiano': '/1VUxHXLeh9pDs4Z7OZNsckVImzcmz93Md',
        'Inglese': '/1e8c14rulIflCj91x9Ie_EZmAath048qd',
        'Fisica': '/1jrNZA0oCNR9KxT0lrWVad2BNj1jKaGbU',
        'TTRG': '/1pKOljjsMGoAqA6cymzJTdFC5k45pv0cA',
        'Telecomunicazioni': '/1I-xU5JFozX1g_6Aw28M34SNWEqBOiEg0',
        'Diritto': '/1JpFR3D4E8JytTOxovlQOhaL5E99xnP3Y',
        'Indirizzo Meccanico': '/1YAkiFCpiea05HepoZa3bxO_pjipXU49F',
        'Indirizzo Chimico': '/1d2Ve7r63WfPLkn6cv6F-dDQOzu22tBBH',
        'Indirizzo di Automazione': '/1l7uxr1TvFmkocJRppK2y6Hv_wKNucviD',
        'Scienze Motorie': '/1nEdV-I0TibE589bQJ_bPj4ohg0qmzXGF',
        'Geografia': '/1Il6s0a1srFNCILCfrxEDaYHsgsV8BudZ',
        'Altro': '/1Il6s0a1srFNCILCfrxEDaYHsgsV8BudZ'
    };

    // Controlla se il fullPath contiene uno dei percorsi mappati
    for (const [subject, folderPath] of Object.entries(folderSubjectMap)) {
        if (fullPath.includes(folderPath)) {
            console.log(`File assegnato a: ${subject}`);
            return subject;
        }
    }

    return 'Altro';
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
          'Indirizzo Informatico': '💻',
          'Indirizzo di Automazione': '🤖',
          'Indirizzo Meccanico': '🔧',
          'Indirizzo Chimico': '🧪',
          'Matematica': '📐',
          'Telecomunicazioni': '📡',
          'Italiano': '📖',
          'Storia': '🏛️',
          'Inglese': '🇬🇧',
          'Fisica': '⚛️',
          'TTRG': '📏',
          'Scienze Motorie': '🏀',
          'Diritto': '⚖️',
          'Geografia': '🌍',
          'Altro': '📃'
      };
      return icons[subject] || '📄';
  }

  showSubjectFiles(subject) {
      const modalContent = document.createElement('div');
      modalContent.className = 'subject-modal';
      modalContent.id = 'subject-modal';
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
          fileItem.querySelector('.view-file-btn').onclick = () => {
            this.openFileViewer(file.id, file.name);
            modalContent.style.display = "none";
            modal.style.display = "none";
        };
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

function closeFileViewer() {
  const modal2 = document.getElementById("fileViewerModal");
  modal2.style.display = "none";
  document.getElementById("fileContent").innerHTML = "";
}
