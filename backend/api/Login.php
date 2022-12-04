<?php
require_once(__DIR__ . '/../../../config/Config.class.php');
define('__BACKEND_ROOT__', $_SERVER['DOCUMENT_ROOT'].'/backend');
require_once(__BACKEND_ROOT__.'/dao/DBConnection.php');
$data = json_decode(file_get_contents("php://input"), true);
$email = $data["email"];
$password = $data["password"];
$db_config = new Config();
$conn = new DBConnection($db_config);

if (empty($email) || empty($password)) {
    echo json_encode(array("valid" => 0));
    exit;
} else {
    if ($stmt = $conn->prepare("SELECT `uid`, `password` FROM `users` WHERE `email` = ?")) {
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $stmt->store_result();
        
        if ($stmt->num_rows > 0) {
            $stmt->bind_result($uid, $pw);
            $stmt->fetch();
            if ($password === $pw) {
                // Verification success! User has logged-in!
                // Create sessions, so we know the user is logged in, they basically act like cookies but remember the data on the server.
                session_start();
                $_SESSION['loggedin'] = TRUE;
                $_SESSION['email'] = $email;
                $_SESSION['uid'] = $uid;
                echo json_encode(array("valid" => 1));
                exit;
            }
        }
    }
}
?>
