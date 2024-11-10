<?php
$clientId = 'CLIENT ID (google console dashboard)';
$clientSecret = 'SECRET KEY (google console dashboard)';
$refreshToken = 'REFRESH TOKEN (VEDI FILE README.md PER OTTENERE IL REFRESH TOKEN)';

$tokenUrl = 'https://oauth2.googleapis.com/token';

$postData = [
    'client_id' => $clientId,
    'client_secret' => $clientSecret,
    'refresh_token' => $refreshToken,
    'grant_type' => 'refresh_token',
];

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $tokenUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));

$response = curl_exec($ch);

if ($response === false) {
    die('Errore cURL: ' . curl_error($ch));
}

curl_close($ch);

$responseData = json_decode($response, true);

if (isset($responseData['access_token'])) {
    $accessToken = $responseData['access_token'];
    echo 'Access Token: ' . $accessToken;
} else {
    echo 'Errore: Nessun access token trovato';
    print_r($responseData);
}
?>