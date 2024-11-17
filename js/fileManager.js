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
                <div class="file-info">Caricato: ${new Date(
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
  const loadingElement = document.getElementById("loading");
  const status = document.getElementById("status");
  const file = fileInput.files[0];

  uploadStatus.classList.remove("success", "error");

  if (!file) {
      status.textContent = "Seleziona un file per caricarlo.";
      status.classList.add("error");
      //alert("Seleziona un file per caricarlo!");
      return;
  }

  let fileName = fileNameInput.value.trim();

  if(!isFileNameValid(fileName)) {
    status.textContent = "Inserisci un nome valido! \n\nIl nome non può iniziare o finire con '<', '>' o '\\' e non può contenere un punto";
    status.classList.add("error");
    return 0;
  }

  loadingElement.style.display = "flex";

  const checkResponse = await fileCheck(file);

  if (checkResponse) {
      const canvas = document.createElement("canvas");
      const fileWithWatermark = await addWatermark(file, canvas);

      const formData = new FormData();
      formData.append("file", fileWithWatermark, fileName);

      try {
          const response = await fetch("https://archidriveserver.x10.mx/upload.php", {
              method: "POST",
              body: formData,
          });

          const result = await response.json();
          
          if (result.success) {
              //alert("File caricato con successo!");
              status.textContent = "File caricato con successo!";
              status.classList.add("success");
              window.location.reload(true);
          } else {
              loadingElement.style.display = "none";
              status.textContent = "Errore nel caricare il file.";
              status.classList.add("error");
              //alert("Errore nel caricare il file.");
          }
      } catch (error) {
          loadingElement.style.display = "none";
          console.error("Errore:", error);
          //alert("Si è verificato un errore durante il caricamento del file.");
          status.textContent = "Si è verificato un errore durante il caricamento del file.";
          status.classList.add("error");
      }
  } else {
      loadingElement.style.display = "none";
      //alert("Stai cercando di caricare un file non idoneo! Assicurati che il file caricato non contenga nudità, droga, violenza o altro materiale offensivo!");
      status.textContent = "Stai cercando di caricare un file non idoneo! Assicurati che il file caricato non contenga nudità, droga, violenza o altro materiale offensivo!";
      status.classList.add("error");
    }
}

async function fileCheck(file) {
  var status = document.getElementById("status");
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
    //alert("Si è verificato un errore durante il controllo dell'immagine.");
    status.textContent = "Si è verificato un errore durante il controllo dell'immagine.";
    status.classList.add("error");
    return false;
  }
}

function isFileNameValid(fileName) {
  
    var containChar = false, firstChar = fileName[0], lastChar = fileName[fileName.length-1];
    console.log(fileName.length);
    if (fileName != "") {
      for(var i=0; i<fileName.length; i++) {
        console.log(i);
        if(fileName[i] !== " " && fileName[i] != ".") {
          containChar = true;
          i = fileName.length;
        } else if (fileName[i] == ".") {
          containChar = false;
        }
      }
      if (containChar && firstChar !== "<" && firstChar !== ">" && lastChar !== "<" && lastChar !== ">" && firstChar !== "\\" && lastChar !== "\\") {
        return true;
      }
    } else {
        return false;
    }
}function isFileNameValid(fileName) {
  
    var containChar = false, firstChar = fileName[0], lastChar = fileName[fileName.length-1];
    if (fileName != "") {
      for(var i=0; i<fileName.length; i++) {
        if(fileName[i] !== " " && fileName[i] != ".") {
          containChar = true;
        } else if (fileName[i] == ".") {
          containChar = false;
          i = fileName.length;
        }
      }
      if (containChar && firstChar !== "<" && firstChar !== ">" && lastChar !== "<" && lastChar !== ">" && firstChar !== "\\" && lastChar !== "\\") {
        return true;
      }
    } else {
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
