<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database config
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "woodwork_welders";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Get form data safely
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$subject = $_POST['subject'] ?? '';
$message = $_POST['message'] ?? '';

// Prepare SQL 
// REMOVED 'attachment' and reduced placeholders to 5
$stmt = $conn->prepare("INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)");

if (!$stmt) {
    die("Prepare failed: " . $conn->error);
}

// Bind parameters
// Changed "ssssss" to "sssss" and removed the undefined $attachmentName variable
$stmt->bind_param("sssss", $name, $email, $phone, $subject, $message);

// Execute
if ($stmt->execute()) {
    // Added htmlspecialchars to prevent XSS attacks when reflecting user input
    echo "<h2>✅ Thank you, " . htmlspecialchars($name) . "! Your message has been stored successfully.</h2>";
} else {
    echo "<h3>❌ Error: " . $stmt->error . "</h3>";
}

// Close execution
$stmt->close();
$conn->close();
?>