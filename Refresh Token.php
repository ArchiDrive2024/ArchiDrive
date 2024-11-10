<?php
$client_id = 'CLIENT ID (google console dashboard)';
$client_secret = 'SECRET KEY (google console dashboard)';
$redirect_uri = 'https://archidrive2024.github.io/ArchiDrive/';
$code = 'CODE (VEDI FILE README.md PER IL CODE)';

$url = 'https://oauth2.googleapis.com/token';
$data = array(
    'client_id' => $client_id,
    'client_secret' => $client_secret,
    'code' => $code,
    'grant_type' => 'authorization_code',
    'redirect_uri' => $redirect_uri
);

$options = array(
    'http' => array(
        'header' => "Content-type: application/x-www-form-urlencoded\r\n",
        'method' => 'POST',
        'content' => http_build_query($data),
        'ignore_errors' => true
    )
);

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);

if ($result === FALSE) {
    die("Errore nella richiesta del token");
}

$response = json_decode($result, true);

if (isset($response['refresh_token'])) {
    echo "Il tuo refresh token è: " . $response['refresh_token'];

    file_put_contents('refresh_token.txt', $response['refresh_token']);
} else {
    echo "Errore: ";
    echo "<pre>";
    print_r($response);
    echo "</pre>";
}
?>