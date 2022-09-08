
import express from "express"
import path from "path"
import mongoose, { Cursor } from "mongoose"
import  { dbconn  } from "./mongodb/connection";
import multer from "multer"
import {GridFSBucket} from 'mongodb'
import fs from 'fs';
import cron from 'node-cron'

const port = 80;
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
const basePath = '/v1/'

app.put(basePath + 'file', uploadMiddleware.single('file'), async (req, res) => {
  const expirationTime = req.headers['expiration-time'];
  const file = req.file;
  if(file && expirationTime) {
    const originalFileName = file.originalname;
    const fileInMemory = fs.existsSync(originalFileName);
    // const fileName = originalFileName + (fileInMemory ? ('_' + Date.now()) : '');
    !fileInMemory && await dbconn.db.collection('files_collection').insertOne({fileName: originalFileName, expiresAt: new Date(Number(expirationTime))});
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


cron.schedule('*/1 * * * *', function() {
  console.log('cron running')
  const cursor = dbconn.db.collection('files_collection').find({expiresAt: {$lt: new Date()}});
  cursor.forEach(doc => {
    const path = './files/' + doc.fileName;
    if(fs.existsSync(path)) {
      fs.rmSync(path)
    }
    dbconn.db.collection('files_collection').deleteOne({_id: doc._id})
    console.log('removed ' + doc.fileName)
  })
});