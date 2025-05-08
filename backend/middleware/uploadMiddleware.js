const multer = require('multer');
const path = require('path');

// Configure storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads')); // Create an 'uploads' folder in your backend
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filter file types if needed
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'audio' && file.mimetype.startsWith('audio/')) {
        cb(null, true);
    } else if (file.fieldname === 'video' && file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 } // Example: 100MB limit
});

// Middleware to handle single audio upload
exports.uploadAudio = upload.single('audio');

// Middleware to handle single video upload
exports.uploadVideo = upload.single('video');

// Middleware to handle both audio and video (optional, adjust as needed)
exports.uploadPodcastFiles = upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'video', maxCount: 1 }]);