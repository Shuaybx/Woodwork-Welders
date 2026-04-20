<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "woodwork_welders";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $input) {
    
    // The public order ID the customer types into the form (e.g., "WW-171...")
    $public_order_id = $input['order_id'] ?? ''; 
    
    $reason = $input['reason'] ?? 'not_as_described'; 
    $details = $input['details'] ?? '';

    $stmt_check = $conn->prepare("SELECT id, user_id FROM orders WHERE order_id = ?");
    $stmt_check->bind_param("s", $public_order_id);
    $stmt_check->execute();
    $result = $stmt_check->get_result();

    if ($result->num_rows > 0) {
        $order_data = $result->fetch_assoc();
        
        $internal_order_id = $order_data['id'];
        
        $user_id = $order_data['user_id']; 

        $stmt_check->close();

        $ref_code = "RET-" . time(); // Generates a unique return reference
        $status = "submitted";

        $stmt_insert = $conn->prepare("INSERT INTO returns (order_id, user_id, reason, details, status, ref_code) VALUES (?, ?, ?, ?, ?, ?)");
        
        $stmt_insert->bind_param("iissss", $internal_order_id, $user_id, $reason, $details, $status, $ref_code);

        if ($stmt_insert->execute()) {
            echo json_encode([
                "success" => true, 
                "message" => "Return request submitted successfully.",
                "ref_code" => $ref_code
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Error saving return: " . $conn->error]);
        }
        
        $stmt_insert->close();

    } else {
        echo json_encode(["success" => false, "message" => "Invalid Order ID. We could not find this order in our records."]);
    }

} else {
    echo json_encode(["success" => false, "message" => "Invalid request."]);
}

$conn->close();
?>