function initGoogleAPI() {
  gapi.load("client:auth2", () => {
    gapi.client
      .init({
        apiKey: "AIzaSyCku-LLM-sMnUvVNZt8PtowR909ag8g6d4",
        clientId:
          "947691574776-9rgmarta3edcj4dtnt3du363ignti6ej.apps.googleusercontent.com",
        scope: "https://www.googleapis.com/auth/drive.file",
      })
      .then(() => {
        console.log("Google API Client inizializzato");
        loadDriveFiles();
      });
  });
}

window.onload = initGoogleAPI;

document
  .getElementById("fileViewerModal")
  .addEventListener("click", function (e) {
    if (e.target === this) {
      closeFileViewer();
    }
  });
