const multer = require("multer");

const path = require("path");



// ==============================
// STORAGE CONFIG
// ==============================

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, "uploads/submissions");

  },

  filename: function (req, file, cb) {

    cb(
      null,
      Date.now() +
        path.extname(file.originalname)
    );

  },

});



// ==============================
// FILE FILTER
// ==============================

const fileFilter = (req, file, cb) => {

  const allowedTypes = [

    "application/pdf",

    "application/zip",

    "application/x-zip-compressed",

  ];

  if (
    allowedTypes.includes(file.mimetype)
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Only PDF and ZIP files are allowed"
      ),
      false
    );

  }

};



// ==============================
// MULTER CONFIG
// ==============================

const upload = multer({

  storage,

  fileFilter,

  limits: {

    fileSize: 20 * 1024 * 1024,

  },

});



module.exports = upload;