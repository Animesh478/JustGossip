const multer = require("multer");

// Configure Multer to store the file in memory temporarily
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;
