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

  const fileType = file.type;

  // Converte il file in immagine se necessario
  const imageFile = await convertToImageIfNeeded(file, fileType);

  if (!imageFile) {
    alert("Errore durante la conversione del file in immagine.");
    return;
  }

  // Controllo sull'immagine
  const checkResponse = await fileCheck(imageFile);

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
async function convertToImageIfNeeded(file, fileType) {
  if (fileType.startsWith("image/")) {
    // Il file è già un'immagine
    return file;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (fileType === "text/plain") {
    // Renderizza il testo su un canvas
    const text = await file.text();
    canvas.width = 800;
    canvas.height = 400;
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(text, 10, 50);
  } else if (fileType === "application/pdf") {
    // Usa librerie come PDF.js per convertire PDF in immagine
    const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2 });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: ctx, viewport }).promise;
  } else {
    alert("Formato file non supportato per la conversione in immagine.");
    return null;
  }

  // Converte il canvas in file immagine
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob], "converted-image.png", { type: "image/png" }));
    }, "image/png");
  });
}

// Controllo del file immagine
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
