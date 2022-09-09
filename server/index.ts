
import express from "express"

import multer from "multer"
import fs from 'fs';
import cron from 'node-cron'
import mongoDbClient from './mongodb/mongoDbClient'
import { removeDeletedFiles } from "./scheduledJobs/removeDeletedFiles";

const port = 80;
const basePath = '/v1/'
const filesDir = './files';
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "DELETE, POST, GET, PUT ,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Expiration-Time");
  next();
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './files')
  }, filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const uploadMiddleware = multer({storage});


app.put(basePath + 'file', uploadMiddleware.single('file'), async (req, res) => {
  const expirationTime = req.headers['expiration-time'];
  const file = req.file;
  if(file && expirationTime) {
    const originalFileName = file.originalname;
    await mongoDbClient.addFile(originalFileName, expirationTime);
    res.send('localhost' + basePath + originalFileName);
  } else {
    res.status(400)
  }
});


app.get(basePath + ':fileUrl', (req, res) => {
  const {params: {fileUrl}} = req;
  try {
    mongoDbClient.getFileByName(fileUrl).then(doc => {
      if(doc) {
        const file = fs.readFileSync(filesDir + '/' + fileUrl);
        res.send(file);
      }
    });
  } catch(e) {
    res.status(404)
  }
});

app.listen(port, () => {
  console.log(`The application started
  successfully on port ${port}`);
});


cron.schedule('* */1 * * *', function() {
  console.log('cron running');
  removeDeletedFiles(mongoDbClient);
});