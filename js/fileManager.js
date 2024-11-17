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
  const fileNameInput = document.getElementById("fileNameInput");
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  const progressContainer = document.querySelector('.progress-container');
  const progressFill = document.querySelector('.progress-fill');
  const progressText = document.querySelector('.progress-text');

  if (!file) {
      alert("Seleziona un file per caricarlo!");
      return;
  }

  let fileName = fileNameInput.value.trim();
  if (fileName === "") {
      fileName = file.name;
  }

  // File check
  const checkResponse = await fileCheck(file);

  if (checkResponse) {
      // Add watermark
      const canvas = document.createElement("canvas");
      const fileWithWatermark = await addWatermark(file, canvas);

      // Create FormData and append file
      const formData = new FormData();
      formData.append("file", fileWithWatermark, fileName);

      // Show progress container
      progressContainer.style.display = 'block';
      progressFill.style.width = '0%';
      progressText.textContent = '0%';

      try {
          const response = await fetch("https://archidriveserver.x10.mx/upload.php", {
              method: "POST",
              body: formData,
          });

          const reader = response.body.getReader();
          const contentLength = +response.headers.get('Content-Length');

          let receivedLength = 0;
          const chunks = [];

          while (true) {
              const { done, value } = await reader.read();

              if (done) {
                  break;
              }

              chunks.push(value);
              receivedLength += value.length;

              // Calculate and update progress
              const progress = (receivedLength / contentLength) * 100;
              progressFill.style.width = `${progress}%`;
              progressText.textContent = `${Math.round(progress)}%`;
          }

          // Concatenate chunks into single Uint8Array
          const chunksAll = new Uint8Array(receivedLength);
          let position = 0;
          for (const chunk of chunks) {
              chunksAll.set(chunk, position);
              position += chunk.length;
          }

          // Convert to text and parse JSON
          const result = JSON.parse(new TextDecoder("utf-8").decode(chunksAll));

          // Hide progress container
          progressContainer.style.display = 'none';

          if (result.success) {
              alert("File caricato con successo!");
              window.location.reload(true);
          } else {
              alert("Errore nel caricare il file.");
          }

      } catch (error) {
          // Hide progress container in case of error
          progressContainer.style.display = 'none';
          console.error("Errore:", error);
          alert("Si è verificato un errore durante il caricamento del file.");
      }

  } else {
      alert("Stai cercando di caricare un file non idoneo! Assicurati che il file caricato non contenga nudità, droga, violenza o altro materiale offensivo!");
  }
}

// Helper function for file check (kept as is)
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
