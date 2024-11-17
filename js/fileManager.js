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

  // Verifica se il file è un'immagine
  const isImage = file.type.startsWith("image/");

  let fileForCheck;

  if (isImage) {
    fileForCheck = file;
  } else {
    // Converte il file non immagine in immagine
    fileForCheck = await convertFileToImage(file);
  }

  // Controlla il file (immagine o convertito)
  const checkResponse = await fileCheck(fileForCheck);

  if (checkResponse) {
    // Carica il file originale
    const formData = new FormData();
    formData.append("file", file, fileName);

    fetch("https://archidriveserver.x10.mx/upload.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("File caricato con successo!");
          window.location.reload(true);
        } else {
          alert("Errore nel caricare il file.");
        }
      })
      .catch((error) => {
        console.error("Errore:", error);
        alert("Si è verificato un errore durante il caricamento del file.");
      });
  } else {
    alert(
      "Stai cercando di caricare un file non idoneo! Assicurati che il file caricato non contenga nudità, droga, violenza o altro materiale offensivo!"
    );
  }
}

// Converte file non immagine in immagine
async function convertFileToImage(file) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (file.type === "text/plain" || file.type === "text/csv") {
    // Legge il contenuto del file
    const text = await file.text();

    // Crea un'immagine con il testo
    canvas.width = 800;
    canvas.height = 600;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(text, 10, 50);
  } else if (file.type === "application/pdf") {
    // Converti PDF in immagine (usando PDF.js o lato server)
    alert("Per i file PDF, la conversione è gestita lato server.");
    return null;
  } else {
    alert("Tipo di file non supportato per la conversione.");
    return null;
  }

  // Restituisce il file immagine
  return new Promise((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });
}

// Controllo del file (come prima)
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
