
import express from "express"
import  { dbconn  } from "./mongodb/connection";
import multer from "multer"
import fs from 'fs';
import cron from 'node-cron'
import path from 'path';

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
    await dbconn.db.collection('files').insertOne({fileName: originalFileName, expireAt: new Date(Number(expirationTime))});
    res.send('localhost' + basePath + originalFileName);
  } else {
    res.status(500)
  }
});


app.get(basePath + ':fileUrl', (req, res) => {
  const {params: {fileUrl}} = req;
  try {
    const file = fs.readFileSync('./files/' + fileUrl)
    res.send(file)
  } catch(e) {
    res.status(404)
  }
});

app.listen(port, () => {
  console.log(`The application started
  successfully on port ${port}`);
});


cron.schedule('*/20 * * * * *', function() {
  console.log('cron running');
  fs.readdir(filesDir, (err, list) => {
    if(err) {
      return;
    } else {
      list.forEach(function(fileName) {
        dbconn.db.collection('files').findOne({fileName}).then(doc => {
          if(!doc) {
            try {
              fs.rmSync(filesDir + '/' + fileName)
            } catch(e) {
              console.log('Failed to remove expired file', fileName)
            }
          }
        });
      })
    }
  })
});