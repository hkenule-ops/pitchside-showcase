// ============================================================
// GOOGLE APPS SCRIPT — NAIJA STARS FC BACKEND
// ============================================================
// SETUP INSTRUCTIONS:
//
// 1. Go to https://script.google.com and create a new project
// 2. Copy-paste this entire file into Code.gs
// 3. Create a Google Sheet with 4 tabs named exactly:
//    - "Players"
//    - "Gallery"
//    - "Videos"
//    - "Admins"
//
// 4. In the "Players" sheet, add these headers in Row 1:
//    id | name | position | age | jersey | image | images | videoUrl | resumeUrl | goals | assists | appearances | rating | bio | featured
//
// 5. In the "Gallery" sheet, add these headers in Row 1:
//    id | src | title | category | type | videoUrl
//
// 6. In the "Videos" sheet, add these headers in Row 1:
//    id | title | thumbnail | videoUrl | category | duration | date
//
// 7. In the "Admins" sheet, add these headers in Row 1:
//    username | password
//    Then add a row: admin | admin123 (change this!)
//
// 8. Replace SPREADSHEET_ID below with your Google Sheet ID
//    (found in the sheet URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit)
//
// 9. Replace DRIVE_FOLDER_ID with your Google Drive folder ID for uploads
//    (create a folder in Drive, get ID from URL)
//
// 10. Deploy: Click Deploy → New Deployment → Web App
//     - Execute as: Me
//     - Who has access: Anyone
//     - Copy the web app URL
//
// 11. Paste the web app URL into your frontend app's Settings page
// ============================================================

const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";
const DRIVE_FOLDER_ID = "YOUR_DRIVE_FOLDER_ID_HERE";

// ---- CORS & Response Helpers ----

function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---- Sheet Helpers ----

function getSheet(name) {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(name);
}

function getSheetData(sheetName) {
  var sheet = getSheet(sheetName);
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var headers = data[0];
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    rows.push(row);
  }
  return rows;
}

function addRow(sheetName, rowData) {
  var sheet = getSheet(sheetName);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var row = headers.map(function(h) { return rowData[h] || ""; });
  sheet.appendRow(row);
}

function updateRow(sheetName, id, rowData) {
  var sheet = getSheet(sheetName);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf("id");
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idCol]) === String(id)) {
      for (var j = 0; j < headers.length; j++) {
        if (rowData.hasOwnProperty(headers[j])) {
          sheet.getRange(i + 1, j + 1).setValue(rowData[headers[j]]);
        }
      }
      return true;
    }
  }
  return false;
}

function deleteRow(sheetName, id) {
  var sheet = getSheet(sheetName);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf("id");
  for (var i = data.length - 1; i >= 1; i--) {
    if (String(data[i][idCol]) === String(id)) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  return false;
}

// ---- Auth ----

function authenticateAdmin(username, password) {
  var admins = getSheetData("Admins");
  for (var i = 0; i < admins.length; i++) {
    if (admins[i].username === username && admins[i].password === password) {
      // Generate a simple session token
      var token = Utilities.getUuid();
      // Store token in Properties
      var props = PropertiesService.getScriptProperties();
      props.setProperty("session_" + token, JSON.stringify({
        username: username,
        created: new Date().toISOString()
      }));
      return { success: true, token: token, username: username };
    }
  }
  return { success: false, error: "Invalid credentials" };
}

function validateToken(token) {
  if (!token) return false;
  var props = PropertiesService.getScriptProperties();
  var session = props.getProperty("session_" + token);
  return !!session;
}

// ---- File Upload to Drive ----

function uploadFileToDrive(base64Data, fileName, mimeType) {
  var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, fileName);
  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return {
    fileId: file.getId(),
    url: "https://drive.google.com/uc?id=" + file.getId(),
    previewUrl: "https://drive.google.com/file/d/" + file.getId() + "/preview"
  };
}

function deleteFileFromDrive(fileId) {
  try {
    var file = DriveApp.getFileById(fileId);
    file.setTrashed(true);
    return true;
  } catch(e) {
    return false;
  }
}

// ---- GET Handler ----

function doGet(e) {
  var action = e.parameter.action;

  try {
    switch(action) {
      case "getPlayers":
        var players = getSheetData("Players");
        players = players.map(function(p) {
          return {
            id: String(p.id),
            name: p.name,
            position: p.position,
            age: Number(p.age),
            jersey: Number(p.jersey),
            image: p.image,
            images: p.images ? String(p.images).split(",").map(function(s) { return s.trim(); }).filter(Boolean) : [],
            videoUrl: p.videoUrl || "",
            resumeUrl: p.resumeUrl || "",
            stats: {
              goals: Number(p.goals) || 0,
              assists: Number(p.assists) || 0,
              appearances: Number(p.appearances) || 0,
              rating: Number(p.rating) || 0
            },
            bio: p.bio || "",
            featured: p.featured === true || p.featured === "TRUE" || p.featured === "true"
          };
        });
        return createJsonResponse({ success: true, data: players });

      case "getGallery":
        var gallery = getSheetData("Gallery");
        gallery = gallery.map(function(g) {
          return {
            id: String(g.id),
            src: g.src,
            title: g.title,
            category: g.category,
            type: g.type || "image",
            videoUrl: g.videoUrl || ""
          };
        });
        return createJsonResponse({ success: true, data: gallery });

      case "getVideos":
        var videos = getSheetData("Videos");
        videos = videos.map(function(v) {
          return {
            id: String(v.id),
            title: v.title,
            thumbnail: v.thumbnail,
            videoUrl: v.videoUrl,
            category: v.category,
            duration: v.duration,
            date: v.date
          };
        });
        return createJsonResponse({ success: true, data: videos });

      default:
        return createJsonResponse({ success: false, error: "Unknown action" });
    }
  } catch(err) {
    return createJsonResponse({ success: false, error: err.message });
  }
}

// ---- POST Handler ----

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action;
    var token = body.token;

    // Auth action doesn't require token
    if (action === "login") {
      var result = authenticateAdmin(body.username, body.password);
      return createJsonResponse(result);
    }

    // All other actions require authentication
    if (!validateToken(token)) {
      return createJsonResponse({ success: false, error: "Unauthorized" });
    }

    switch(action) {
      // ---- Players ----
      case "addPlayer":
        var playerData = body.data;
        playerData.id = Utilities.getUuid();
        playerData.images = (playerData.images || []).join(",");
        addRow("Players", playerData);
        return createJsonResponse({ success: true, id: playerData.id });

      case "updatePlayer":
        var updateData = body.data;
        if (updateData.images && Array.isArray(updateData.images)) {
          updateData.images = updateData.images.join(",");
        }
        var updated = updateRow("Players", body.id, updateData);
        return createJsonResponse({ success: updated });

      case "deletePlayer":
        var deleted = deleteRow("Players", body.id);
        return createJsonResponse({ success: deleted });

      // ---- Gallery ----
      case "addGalleryItem":
        var galleryData = body.data;
        galleryData.id = Utilities.getUuid();
        addRow("Gallery", galleryData);
        return createJsonResponse({ success: true, id: galleryData.id });

      case "deleteGalleryItem":
        var gDeleted = deleteRow("Gallery", body.id);
        return createJsonResponse({ success: gDeleted });

      // ---- Videos ----
      case "addVideo":
        var videoData = body.data;
        videoData.id = Utilities.getUuid();
        addRow("Videos", videoData);
        return createJsonResponse({ success: true, id: videoData.id });

      case "deleteVideo":
        var vDeleted = deleteRow("Videos", body.id);
        return createJsonResponse({ success: vDeleted });

      // ---- File Upload ----
      case "uploadFile":
        var fileResult = uploadFileToDrive(body.fileData, body.fileName, body.mimeType);
        return createJsonResponse({ success: true, ...fileResult });

      case "deleteFile":
        var fDeleted = deleteFileFromDrive(body.fileId);
        return createJsonResponse({ success: fDeleted });

      // ---- Logout ----
      case "logout":
        var props = PropertiesService.getScriptProperties();
        props.deleteProperty("session_" + token);
        return createJsonResponse({ success: true });

      default:
        return createJsonResponse({ success: false, error: "Unknown action" });
    }
  } catch(err) {
    return createJsonResponse({ success: false, error: err.message });
  }
}
