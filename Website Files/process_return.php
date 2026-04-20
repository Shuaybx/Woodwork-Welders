<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "woodwork_welders";

$conn = new mysqli($servername, $username, $password, $dbname);

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($input['return_id']) && isset($input['action'])) {
    
    $return_id = intval($input['return_id']);
    
    $new_status = ($input['action'] === 'approve') ? 'approved' : 'rejected';

    $stmt = $conn->prepare("UPDATE returns SET status = ?, resolved_at = current_timestamp() WHERE id = ?");
    $stmt->bind_param("si", $new_status, $return_id);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => $conn->error]);
    }
    
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request."]);
}

$conn->close();
?>