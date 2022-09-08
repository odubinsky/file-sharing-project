
var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var dbconn = require("./mongodb/connection")
const port = 80;
const app = express();
console.log(path.join(__dirname, "..", "build"))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "DELETE, POST, GET, PUT ,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
// app.get('/static', express.static(path.join(__dirname, "..", "build")))
const multer  = require('multer')
// const uploadMiddleware = multer({
//  }).single('file');

let gfs;

dbconn.once('open', () => {
  gfs = Grid(dbconn.db, mongoose.mongo);  
  gfs.collection('uploads');
});

const storage = new GridFsStorage({
  url: "mongodb://localhost/project",
  file: (req, file) => {
    return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
    });
  }
});

const uploadMiddleware = multer({ storage });

const basePath = '/v1/'

app.put(basePath + 'file', uploadMiddleware.single('file'), (req, res) => {
  console.log("file", req.file);
  res.send(true)
});

app.get(basePath + ':file-url', (req, res) => {
  console.log("file", req.file);
  res.send(true)
});

app.listen(port, () => {
  console.log(`The application started
  successfully on port ${port}`);
});