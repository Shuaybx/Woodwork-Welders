<?php
header('Content-Type: application/json');
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);
$email = isset($data['email']) ? filter_var($data['email'], FILTER_SANITIZE_EMAIL) : '';

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "Invalid email address."]);
    exit;
}

$mail = new PHPMailer(true);

try {
    // --- Server Settings (SMTP) ---
    $mail->isSMTP();                                      // Send using SMTP
    $mail->Host       = 'smtp.gmail.com';                 // Set the SMTP server to send through
    $mail->SMTPAuth   = true;                             // Enable SMTP authentication
    
    $mail->Username   = 'chocdim56@gmail.com';   
    $mail->Password   = 'tkwqzvxxmnwhmrjm'; // app password from google account security!
    
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;   // Enable TLS encryption
    $mail->Port       = 587;                              // TCP port for TLS

    // --- Sender and Recipient ---
    $mail->setFrom('YOUR_GMAIL_ADDRESS@gmail.com', 'Woodwork Welders');
    $mail->addAddress($email);                            // Add the subscriber's email

    // --- Email Content ---
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = 'Promo Email: Welcome to Woodwork Welders!';
    
    $websiteUrl = "https://yourwebsite.com/Traditional%20Product%20Promotion.html";
    
    // HTML Page that loaded in subscribed clients email's
    $mail->Body = "
    <!DOCTYPE html>
    <html>
    <head><meta charset='UTF-8'></head>
    <body style='margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;'>
      <table border='0' cellpadding='0' cellspacing='0' width='100%' style='padding: 20px 0;'>
        <tr>
          <td align='center'>
            <table border='0' cellpadding='0' cellspacing='0' width='600' style='background-color: #ffffff; border-radius: 8px; overflow: hidden;'>
              <tr>
                <td align='center' style='background-color: #3a2e18; padding: 40px 20px;'>
                  <h1 style='color: #c8a850; margin: 0; font-size: 28px;'>Woodwork Welders</h1>
                  <p style='color: #ffffff; margin: 10px 0 0 0;'>Unleash Your Vision with Exclusive Deals</p>
                </td>
              </tr>
              <tr>
                <td style='padding: 30px 40px; text-align: center;'>
                  <h2 style='color: #333333; margin-top: 0;'>Welcome to the Workshop!</h2>
                  <p style='color: #666666;'>Thank you for subscribing. I recommend using our special 3D model configurator to control the bespoke furniture designs that you want  <strong style='color: #c8a850;'>US</strong> to make for you!</p>
                </td>
              </tr>
              <tr>
                <td align='center' style='padding: 20px 40px 40px 40px;'>
                  <a href='{$websiteUrl}' style='background-color: #c8a850; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 4px; font-weight: bold; display: inline-block;'>Shop All Promotions</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    ";


    $mail->send();
    echo json_encode(["status" => "success", "message" => "✅ Subscribed! Check your email."]);

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
}
?>