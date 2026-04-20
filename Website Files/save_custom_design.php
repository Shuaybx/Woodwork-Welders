<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = ""; 
$dbname = "woodwork_welders";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['success' => false, 'message' => "Connection failed: " . $conn->connect_error]);
    exit();
}

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

if (!$input) {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['success' => false, 'message' => 'No valid data received']);
    exit();
}

$sku = $input['id'];
$name = $input['params']['name'];
$category = $input['params']['item'];
$material = $input['params']['material'];
$finish = $input['params']['finish'];
$price = $input['pricing']['total'];
$stock_qty = 1; 
$is_active = 1; 


$description_parts = [
    "Customized furniture design.",
    "Dimensions: " . $input['params']['width'] . "x" . $input['params']['height'] . "x" . $input['params']['depth'] . "cm.",
    "Gloss: " . $input['params']['gloss'] . "%.",
    "Price Details: Base: £" . number_format($input['pricing']['base'], 2) . ", Size: £" . number_format($input['pricing']['dimensions'], 2) . ", Material: £" . number_format($input['pricing']['material'], 2) . ", Finish: £" . number_format($input['pricing']['finish'], 2) . "."
];
$description = implode(" ", $description_parts);


$stmt = $conn->prepare("INSERT INTO products (sku, name, category, material, finish, price, stock_qty, description, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssdisi", $sku, $name, $category, $material, $finish, $price, $stock_qty, $description, $is_active);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'id' => $sku]);
} else {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['success' => false, 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
exit();
?>