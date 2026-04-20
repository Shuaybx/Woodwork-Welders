<?php
// 🚨 THIS IS THE MAGIC LINE: It forces MySQL to stop hiding errors and throw exceptions instead!
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "woodwork_welders";

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit;
}

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $input) {
    
    $order_id_string = "WW-" . time(); 
    $total = $input['total'] ?? 0;
    $items = $input['items'] ?? [];
    $status = "pending"; 
    $user_id = NULL; // Changed to NULL. Sometimes 0 is rejected if there is no user #0.

    $conn->begin_transaction();

    try {
        // Insert into the main orders table
        $stmt = $conn->prepare("INSERT INTO orders (order_id, user_id, status, total_amount) VALUES (?, ?, ?, ?)");
        
        // "sdsd" = String, NULL string, String, Double
        $stmt->bind_param("sdsd", $order_id_string, $user_id, $status, $total);
        $stmt->execute();
        
        $internal_db_id = $conn->insert_id; 
        $stmt->close();

        // Insert into the order_items table
        if (!empty($items)) {
            $stmt_items = $conn->prepare("INSERT INTO order_items (order_id, product_id, product_name, unit_price, qty) VALUES (?, ?, ?, ?, ?)");
            
            foreach ($items as $item) {
                // If product_id is empty, set it to NULL instead of 0 to avoid Foreign Key crashes
                $product_id = !empty($item['product_id']) && $item['product_id'] !== 'Unknown' ? intval($item['product_id']) : NULL; 
                
                $name = $item['name'] ?? 'Unknown Item';
                $price = $item['price'] ?? 0;
                $quantity = $item['quantity'] ?? 1;
                
                // "sdsdi" = Integer, NULL/Int, String, Double, Integer
                $stmt_items->bind_param("idsdi", $internal_db_id, $product_id, $name, $price, $quantity);
                $stmt_items->execute();
            }
            $stmt_items->close();
        }

        $conn->commit();

        echo json_encode([
            "success" => true, 
            "order_id" => $order_id_string 
        ]);

    } catch (Exception $e) {
        $conn->rollback();
        // 🚨 NOW PHP WILL SEND THE EXACT MYSQL ERROR TO YOUR BROWSER
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }

} else {
    echo json_encode(["success" => false, "message" => "Invalid request."]);
}

$conn->close();
?>