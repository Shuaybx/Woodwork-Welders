<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "woodwork_welders";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

// Fetch from the returns table and join the related order and item info
$sql = "SELECT 
            r.id AS return_id, r.reason, r.status AS return_status, r.submitted_at, r.ref_code,
            o.order_id AS public_order_id,
            oi.product_id, oi.product_name, oi.unit_price, oi.qty
        FROM returns r
        JOIN orders o ON r.order_id = o.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE r.status = 'submitted' OR r.status = 'under_review'
        ORDER BY r.submitted_at DESC";

$result = $conn->query($sql);

$returns_data = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $ret_id = $row['return_id'];
        
        if (!isset($returns_data[$ret_id])) {
            $returns_data[$ret_id] = [
                "return_id" => $ret_id,
                "order_ref" => $row['public_order_id'],
                "ref_code" => $row['ref_code'],
                "status" => $row['return_status'],
                "date" => $row['submitted_at'],
                "reason" => $row['reason'],
                "items" => []
            ];
        }
        
        if ($row['product_name']) {
            $returns_data[$ret_id]["items"][] = [
                "product_id" => $row['product_id'],
                "name" => $row['product_name'],
                "price" => $row['unit_price'],
                "quantity" => $row['qty']
            ];
        }
    }
}

echo json_encode(array_values($returns_data));
$conn->close();
?>