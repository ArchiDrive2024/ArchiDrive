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

        //console.log("Dati ricevuti dall'API:", data);

        this.allFiles = data.files.map(file => {
            //console.log("File ricevuto:", file);
            //console.log("\n\n\n\n\n\n" + file.parents[0] + "\n\n\n\n\n\n");
            return {
                ...file,
                fullPath: file.parents[0] || ''
            };
        });

        this.categorizeFiles();
        this.renderSubjectGrid();
    } catch (error) {
        console.error("Errore nel caricamento dei file:", error);
    }
}

categorizeFiles() {
    Object.keys(subjectFiles).forEach(subject => (subjectFiles[subject] = []));

    this.allFiles.forEach(file => {
        const folderPath = file.parents[0] || '';
        const subjectMatch = this.determineSubject(folderPath);
        
        //console.log("File categorizzato:", file.name, "| Path:", folderPath, "| Categoria:", subjectMatch);
        
        const category = subjectMatch || 'Altro';
        subjectFiles[category].push(file);
    });

    //console.log("Categorie aggiornate:", subjectFiles);
}

determineSubject(fullPath = '') {
    const folderSubjectMap = {
        'Matematica': '1O6fI9sSjWfzCwloXZJHqLykx2NstQKC6',
        'Indirizzo Informatico': '1pKOljjsMGoAqA6cymzJTdFC5k45pv0cA',
        'Storia': '1nEdV-I0TibE589bQJ_bPj4ohg0qmzXGF',
        'Italiano': '1YAkiFCpiea05HepoZa3bxO_pjipXU49F',
        'Inglese': '1JpFR3D4E8JytTOxovlQOhaL5E99xnP3Y',
        'Fisica': '1ywtyKG6T7I-M65ytZkzXzfX7oI7ZGxxp',
        'TTRG': '1tlx87JM_2eUqNfqQACdjVIfV0oxLBRWl',
        'Telecomunicazioni': '1Il6s0a1srFNCILCfrxEDaYHsgsV8BudZ',
        'Diritto': '1viclutz7KMs5c29MwwhcK85oc5SRRzxO',
        'Indirizzo Meccanico': '1I-xU5JFozX1g_6Aw28M34SNWEqBOiEg0',
        'Indirizzo Chimico': '1jrNZA0oCNR9KxT0lrWVad2BNj1jKaGbU',
        'Indirizzo di Automazione': '1e8c14rulIflCj91x9Ie_EZmAath048qd',
        'Scienze Motorie': '1l7uxr1TvFmkocJRppK2y6Hv_wKNucviD',
        'Geografia': '1VUxHXLeh9pDs4Z7OZNsckVImzcmz93Md',
        'Altro': '1d2Ve7r63WfPLkn6cv6F-dDQOzu22tBBH'
    };

    for (const [subject, folderPath] of Object.entries(folderSubjectMap)) {
        if (fullPath === folderPath) {
            //console.log(`File assegnato a: ${subject}`);
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
          
          const subjectHeader = document.createElement('div');
          subjectHeader.className = 'subject-header';
          subjectHeader.innerHTML = `
              <div class="subject-icon">${this.getSubjectIcon(subject)}</div>
              <h2>${subject}</h2>
              <span class="file-count">${files.length} file</span>
          `;

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

      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.appendChild(modalContent);
      document.body.appendChild(modal);

      modalContent.querySelector('.close-modal').onclick = () => {
          document.body.removeChild(modal);
      };
  }

  openFileViewer(fileId, fileName) {

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

const fileManager = new FileManager();

function loadDriveFiles() {
  fileManager.loadFiles();
}

function closeFileViewer() {
  const modal2 = document.getElementById("fileViewerModal");
  modal2.style.display = "none";
  document.getElementById("fileContent").innerHTML = "";
}
