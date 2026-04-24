// ============================================================
// GRAVITYY - Memory Capture Apps Script
// Paste this entire code into your Google Apps Script project
// and re-deploy as a Web App (Anyone, even anonymous).
// ============================================================

// ✏️ CHANGE THIS to your own Gmail address to receive notifications!
var NOTIFY_EMAIL = "YOUR_EMAIL@gmail.com";

// ✏️ CHANGE THIS to the Google Drive Folder ID where photos should be saved
//    (Get it from the folder URL: drive.google.com/drive/folders/THIS_PART)
var DRIVE_FOLDER_ID = "YOUR_GOOGLE_DRIVE_FOLDER_ID";

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var imageBase64 = data.image;
    var filename    = data.filename    || "Memory.jpg";
    var giftName    = data.giftName    || "a Gift";
    var source      = data.source      || "webcam";   // 'webcam' or 'upload'
    var sendEmail   = data.sendEmail   || false;

    // --- 1. Save to Google Drive ---
    var folder  = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    var base64  = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    var decoded = Utilities.base64Decode(base64);
    var blob    = Utilities.newBlob(decoded, "image/jpeg", filename);
    var file    = folder.createFile(blob);
    var fileUrl = file.getUrl();

    // --- 2. Send Email Notification ---
    if (sendEmail && NOTIFY_EMAIL !== "YOUR_EMAIL@gmail.com") {
      var sourceLabel = source === "upload" ? "📂 Uploaded from device" : "📸 Captured via webcam";
      var subject     = "💌 New Memory Saved – " + giftName;
      var htmlBody    = "<div style='font-family:sans-serif;max-width:600px;margin:auto;'>" +
        "<h2 style='color:#FFD700;'>✨ A New Memory Was Saved!</h2>" +
        "<p><strong>Gift:</strong> " + giftName + "</p>" +
        "<p><strong>Source:</strong> " + sourceLabel + "</p>" +
        "<p><strong>Filename:</strong> " + filename + "</p>" +
        "<p><a href='" + fileUrl + "' style='background:#FFD700;color:#000;padding:10px 20px;" +
        "border-radius:20px;text-decoration:none;font-weight:bold;'>📷 View Photo in Drive</a></p>" +
        "<hr/><p style='color:#888;font-size:12px;'>Sent automatically by Gravityy 💛</p>" +
        "</div>";

      MailApp.sendEmail({
        to:       NOTIFY_EMAIL,
        subject:  subject,
        htmlBody: htmlBody
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", fileUrl: fileUrl }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET handler (for testing the deployment is live)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "live", message: "Gravityy Apps Script is running!" }))
    .setMimeType(ContentService.MimeType.JSON);
}
