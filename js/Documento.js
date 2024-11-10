export class Documento {
  constructor() {
    this.loadFiles = this.loadFiles.bind(this);
  }

  // Aggiunta della filigrana
  async aggiungiFiligrana(fileInput, canvas, e, loading, status, uploadForm) {
    const file = fileInput.files[0];
    let processedFile = null;

    if (file && file.type === "application/pdf") {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();

        // Aggiungi la filigrana a ogni pagina del pdf
        pages.forEach((page) => {
          const { width, height } = page.getSize();
          page.drawText("I.S.S. ARCHIMEDE (BG)      I.S.S. ARCHIMEDE (BG)", {
            x: width / 2 - 250,
            y: height / 2 + 260,
            size: 60,
            color: PDFLib.rgb(0, 0, 1),
            opacity: 0.1,
            rotate: PDFLib.degrees(-45),
          });
        });

        const pdfBytes = await pdfDoc.save();

        this.uploadFile(e, fileInput, loading, status, uploadForm);

        processedFile = new Blob([pdfBytes], { type: "application/pdf" });
        return processedFile;
      } catch (error) {
        console.error("Errore durante l'elaborazione del PDF:", error);
        throw error;
      }
    } else if (
      file &&
      (file.type === "image/png" || file.type === "image/jpeg")
    ) {
      return new Promise((resolve, reject) => {
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
          try {
            canvas.width = img.width;
            canvas.height = img.height;

            // Prima disegna l'immagine
            ctx.drawImage(img, 0, 0);

            // Salva lo stato corrente del contesto
            ctx.save();

            // Configura e applica la filigrana
            const K = 40;
            const fontValue = `${
              (img.width * img.height * 250) / 9000000 + K
            }px Arial`;
            ctx.font = fontValue;

            const angleInRadians = -40 * (Math.PI / 180);

            // Sposta il punto di origine al centro dell'immagine
            ctx.translate(canvas.width / 2, canvas.height / 2);

            // Applica la rotazione
            ctx.rotate(angleInRadians);

            ctx.fillStyle = "rgba(0, 0, 139, 0.2)";
            ctx.textAlign = "center";

            // Disegna il testo centrato
            ctx.fillText(
              "I.S.S. ARCHIMEDE (BG)      I.S.S. ARCHIMEDE (BG)",
              0,
              0
            );

            // Ripristina lo stato salvato
            ctx.restore();

            canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(
                  new Error("Errore nella creazione del blob dell'immagine")
                );
              }
            }, file.type);
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () =>
          reject(new Error("Errore nel caricamento dell'immagine"));
        img.src = URL.createObjectURL(file);
        this.uploadFile(e, fileInput, loading, status, uploadForm);
      });
    } else {
      throw new Error("Seleziona un'immagine (JPG o PNG) o un PDF.");
    }
  }

  uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
      alert("Seleziona un file per caricarlo!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Invia il file al server per caricarlo su Google Drive tramite PHP
    fetch("upload.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("File caricato con successo!");
          loadDriveFiles(); // Ricarica la lista dei file
        } else {
          alert("Errore nel caricare il file.");
        }
      });
  }

  // Funzione per visualizzare i file dal Google Drive
  loadDriveFiles() {
    fetch("get_files.php")
      .then((response) => response.json())
      .then((data) => {
        const fileList = document.getElementById("fileList");
        fileList.innerHTML = ""; // Pulisce la lista esistente
        data.files.forEach((file) => {
          const listItem = document.createElement("li");
          listItem.textContent = file.name;
          fileList.appendChild(listItem);
        });
      });
  }

  // Inizializza la Google API Client
  initGoogleAPI() {
    gapi.load("client:auth2", () => {
      gapi.client
        .init({
          apiKey: "AIzaSyBXUGgEfjge2cmBMT0oAnj1tRZjYEW2Rdk", // Inserisci la tua API Key qui
          clientId:
            "41970276207-3789u0o77d5tm4srqnmh4mspj6di0dkh.apps.googleusercontent.com", // Inserisci il tuo Client ID qui
          scope: "https://www.googleapis.com/auth/drive.file",
        })
        .then(() => {
          console.log("Google API Client inizializzato");
          loadDriveFiles(); // Carica i file quando l'API è pronta
        });
    });
  }

  // Helper methods
  getMimeTypeIcon(mimeType) {
    if (mimeType.includes("image/")) return "🖼️";
    if (mimeType.includes("video/")) return "🎥";
    if (mimeType.includes("audio/")) return "🎵";
    if (mimeType.includes("pdf")) return "📄";
    if (mimeType.includes("spreadsheet")) return "📊";
    if (mimeType.includes("document")) return "📝";
    return "📁";
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleString();
  }
}
