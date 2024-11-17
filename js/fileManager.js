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

  if (!file) {
    alert("Seleziona un file per caricarlo!");
    return;
  }

  let fileName = fileNameInput.value.trim();
  if (fileName === "") {
    fileName = file.name;
  }

  // Controllo del file
  const checkResponse = await fileCheck(file);

  if (checkResponse) {
    // Aggiungi la filigrana
    const canvas = document.createElement("canvas");
    const fileWithWatermark = await addWatermark(file, canvas);

    // Mostra la progress bar
    document.getElementById("progress-container").style.display = "block";

    // Carica il file con la progress bar
    const formData = new FormData();
    formData.append("file", fileWithWatermark, fileName);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://archidriveserver.x10.mx/upload.php", true);

    // Imposta l'evento per tracciare il progresso
    xhr.upload.addEventListener("progress", function (e) {
      if (e.lengthComputable) {
        const percent = (e.loaded / e.total) * 100;
        document.getElementById("progress-bar").style.width = percent + "%";
      }
    });

    xhr.onload = function () {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        if (data.success) {
          alert("File caricato con successo!");
          window.location.reload(true);
        } else {
          alert("Errore nel caricare il file.");
        }
      } else {
        alert("Si è verificato un errore nel caricamento del file.");
      }
    };

    xhr.onerror = function () {
      alert("Errore nel caricamento del file.");
    };

    xhr.send(formData);
  } else {
    alert(
      "Stai cercando di caricare un file non idoneo! Assicurati che il file caricato non contenga nudità, droga, violenza o altro materiale offensivo!"
    );
  }
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
