let allFiles = [];

function loadDriveFiles() {
  fetch("https://archidriveserver.x10.mx/get_files.php")
    .then((response) => response.json())
    .then((data) => {
      allFiles = data.files;
      displayFiles(allFiles);
    });
}

function displayFiles(files) {
  const fileList = document.getElementById("fileList");
  fileList.innerHTML = "";

  if (files.length === 0) {
    fileList.innerHTML = `
            <div class="file-list-empty">
                Nessun file trovato
            </div>
        `;
    return;
  }

  files.forEach((file) => {
    const listItem = document.createElement("li");
    listItem.className = "file-list-item search-result";
    listItem.innerHTML = `
            <div class="file-icon">📄</div>
            <div class="file-details">
                <div class="file-name">${file.name}</div>
                <div class="file-info">Modificato: ${new Date(
                  file.modifiedTime
                ).toLocaleDateString()}</div>
            </div>
        `;
    listItem.onclick = () => openFileViewer(file.id, file.name);
    fileList.appendChild(listItem);
  });
}

async function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const fileNameInput = document.getElementById('fileNameInput');
  const progressContainer = document.querySelector('.upload-progress-container');
  const progressBar = document.querySelector('.progress-bar-fill');
  const progressText = document.querySelector('.progress-percentage');
  const progressStatus = document.querySelector('.progress-text');
  const uploadSpeed = document.querySelector('.upload-speed');
  const fileName = document.querySelector('.file-name');
  
  const file = fileInput.files[0];
  if (!file) {
    alert('Seleziona un file per caricarlo!');
    return;
  }

  // Inizializza l'UI
  progressContainer.classList.add('active');
  progressBar.style.width = '0%';
  progressText.textContent = '0%';
  progressStatus.textContent = 'Preparazione del file...';
  fileName.textContent = file.name;
  
  let startTime = Date.now();
  let lastLoaded = 0;

  const updateSpeed = (loaded, elapsed) => {
    const speed = (loaded - lastLoaded) / (elapsed / 1000); // bytes per second
    lastLoaded = loaded;
    return speed > 1048576 
      ? `${(speed / 1048576).toFixed(2)} MB/s`
      : `${(speed / 1024).toFixed(2)} KB/s`;
  };

  try {
    // Simula il controllo del file
    const checkResponse = await fileCheck(file);
    if (!checkResponse) {
      throw new Error('File non idoneo');
    }

    // Prepara il FormData
    const formData = new FormData();
    formData.append('file', file, fileNameInput.value.trim() || file.name);

    // Configura la richiesta
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://archidriveserver.x10.mx/upload.php', true);

    // Gestione del progresso
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const elapsed = Date.now() - startTime;
        const percent = Math.round((e.loaded / e.total) * 100);
        const speed = updateSpeed(e.loaded, elapsed);
        
        requestAnimationFrame(() => {
          progressBar.style.width = `${percent}%`;
          progressText.textContent = `${percent}%`;
          uploadSpeed.textContent = speed;

          // Aggiorna il messaggio di stato
          if (percent < 30) {
            progressStatus.textContent = 'Caricamento iniziato...';
          } else if (percent < 60) {
            progressStatus.textContent = 'A metà strada...';
          } else if (percent < 90) {
            progressStatus.textContent = 'Quasi completato...';
          } else {
            progressStatus.textContent = 'Finalizzazione...';
          }
        });
      }
    };

    // Gestione completamento
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          progressBar.classList.add('upload-complete');
          progressStatus.textContent = 'Caricamento completato con successo!';
          progressText.textContent = '100%';
          
          setTimeout(() => {
            progressContainer.style.opacity = '0';
            setTimeout(() => {
              progressContainer.classList.remove('active');
              progressBar.classList.remove('upload-complete');
              alert('File caricato con successo!');
              window.location.reload();
            }, 300);
          }, 1000);
        } else {
          throw new Error('Errore nel caricamento del file');
        }
      }
    };

    // Gestione errori
    xhr.onerror = () => {
      throw new Error('Errore di rete durante il caricamento');
    };

    xhr.send(formData);

  } catch (error) {
    progressStatus.textContent = error.message;
    progressBar.style.backgroundColor = 'var(--error)';
    alert(error.message);
  }
}

// Funzione di controllo file (simulata)
async function fileCheck(file) {
  return new Promise(resolve => {
    setTimeout(() => resolve(true), 500);
  });
}

// Controllo del file caricato
async function fileCheck(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("https://archidriveserver.x10.mx/check_file.php", {
      method: "POST",
      body: formData,
    });

    const data = await response.text();
    console.log(data);

    return data.trim() === "ok";
  } catch (error) {
    console.error("Errore:", error);
    alert("Si è verificato un errore durante il controllo dell'immagine.");
    return false;
  }
}

function openFileViewer(fileId, fileName) {
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

function closeFileViewer() {
  const modal = document.getElementById("fileViewerModal");
  modal.style.display = "none";
  document.getElementById("fileContent").innerHTML = "";
}
