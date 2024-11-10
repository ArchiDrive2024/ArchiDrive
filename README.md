<h1>File Access Token.php e Refresh Token.php</h1>

Questi file sono essenziali per ottenere tutti i token richiesti da Google per comunicare tramite l'API di Google Drive. Prima di tutto bisogna ottenere il code; quest'ultimo è reperibile tramite questo link: <b>https://accounts.google.com/o/oauth2/v2/auth?client_id=CLIENT_ID&redirect_uri=REDIRECT_URL&response_type=code&scope=https://www.googleapis.com/auth/drive&access_type=offline&prompt=consent</b>
<br/><br/><br/>
Una volta copiato il "code", è necessario modificare il file inserendo le credenziali richieste all'inizio del codice e successivamente è possibile runnare il file "Refresh Token.php" (che deve essere hostato su un server con certificato SSL) e ottenere il REFRESH TOKEN. <br/><br/>Grazie al REFRESH TOKEN è possibile ripetere lo stesso procedimento visto in precedenza ma con il file Access token.php e utilizzando il REFRESH TOKEN al posto del "code". <br/><br/>A questo punto otteniamo l'ACCESS TOKEN, necessario per accedere a Google Drive tramite i file upload.php e get_files.php. <br/><br/>Bisogna quindi modificare questi file inserendo il corretto ACCESS TOKEN. <br/><br/>Questi file devono essere hostati su un server.
<br/><br/><br/>
Qualora dovesse spegnersi il server per i file .php, è necessario ripetere il procedimento.
