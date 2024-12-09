class FileManager {
    constructor() {
        this.allFiles = [];
        this.folderSubjectMap = {
            '1d2Ve7r63WfPLkn6cv6F-dDQOzu22tBBH': 'Matematica',
            '1viclutz7KMs5c29MwwhcK85oc5SRRzxO': 'Indirizzo Informatico',
            '1ywtyKG6T7I-M65ytZkzXzfX7oI7ZGxxp': 'Storia',
            '1VUxHXLeh9pDs4Z7OZNsckVImzcmz93Md': 'Italiano',
            '1e8c14rulIflCj91x9Ie_EZmAath048qd': 'Inglese',
            '1jrNZA0oCNR9KxT0lrWVad2BNj1jKaGbU': 'Fisica',
            '1pKOljjsMGoAqA6cymzJTdFC5k45pv0cA': 'TTRG',
            '1I-xU5JFozX1g_6Aw28M34SNWEqBOiEg0': 'Telecomunicazioni',
            '1JpFR3D4E8JytTOxovlQOhaL5E99xnP3Y': 'Diritto',
            '1YAkiFCpiea05HepoZa3bxO_pjipXU49F': 'Indirizzo Meccanico',
            '1O6fI9sSjWfzCwloXZJHqLykx2NstQKC6': 'Indirizzo Chimico',
            '1l7uxr1TvFmkocJRppK2y6Hv_wKNucviD': 'Indirizzo di Automazione',
            '1nEdV-I0TibE589bQJ_bPj4ohg0qmzXGF': 'Scienze Motorie',
            '1Il6s0a1srFNCILCfrxEDaYHsgsV8BudZ': 'Geografia',
            '1tlx87JM_2eUqNfqQACdjVIfV0oxLBRWl': 'Altro'
        };
        this.subjectKeywords = {
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
        this.subjectFiles = {};
    }

    async loadFiles() {
        try {
            const response = await fetch("https://archidriveserver.x10.mx/get_files.php");
            const data = await response.json();
            this.allFiles = data.files.map(file => ({
                ...file,
                fullPath: file.fullPath || '',
                subject: this.determineSubject(file.name, file.description, file.fullPath)
            }));

            // Organizza i file per materia
            this.subjectFiles = this.organizeFilesBySubject(this.allFiles);
            this.renderSubjectGrid();
        } catch (error) {
            console.error("Error loading files:", error);
        }
    }

    determineSubject(fileName, description, fullPath = '') {
        const matchedFolder = Object.keys(this.folderSubjectMap).find(folderId =>
            fullPath.toLowerCase().includes(folderId.toLowerCase())
        );
        if (matchedFolder) {
            return this.folderSubjectMap[matchedFolder];
        }

        const searchText = (fileName + ' ' + (description || '') + ' ' + fullPath).toLowerCase();
        for (const [subject, keywords] of Object.entries(this.subjectKeywords)) {
            if (keywords.some(keyword => searchText.includes(keyword))) {
                return subject;
            }
        }

        return 'Altro';
    }

    organizeFilesBySubject(files) {
        const subjectFiles = {};
        files.forEach(file => {
            const subject = file.subject || 'Altro';
            if (!subjectFiles[subject]) {
                subjectFiles[subject] = [];
            }
            subjectFiles[subject].push(file);
        });
        return subjectFiles;
    }

    renderSubjectGrid() {
        const container = document.getElementById('fileList');
        container.innerHTML = '';
        container.className = 'subject-grid';

        Object.entries(this.subjectFiles).forEach(([subject, files]) => {
            const subjectCard = document.createElement('div');
            subjectCard.className = 'subject-card';

            // Header con icona e nome materia
            const subjectHeader = document.createElement('div');
            subjectHeader.className = 'subject-header';
            subjectHeader.innerHTML = `
                <div class="subject-icon">${this.getSubjectIcon(subject)}</div>
                <h2>${subject}</h2>
                <span class="file-count">${files.length} file</span>
            `;

            // Lista di file
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

            // Bottone "Vedi tutti"
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
