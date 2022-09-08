
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

// const { GridFsStorage } = require('multer-gridfs-storage');
// const Grid = require('gridfs-stream');

// let gfs;

// dbconn.once('open', async  () => {
//   gfs = Grid(dbconn.db, mongoose.mongo);  
//   await gfs.collection('uploads');
// });

// const storage = new GridFsStorage({
//   url: "mongodb://localhost/project",
//   file: (req: any, file:any) => {
//     return new Promise((resolve, reject) => {
//         const filename = file.originalname;
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'uploads',
//           expireAt: new Date(),
//         };
//         resolve(fileInfo);
//     });
//   }
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './files')
  }, filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.fieldname + '-' + uniqueSuffix)
    cb(null, file.originalname)
  }
})

const uploadMiddleware = multer({storage});
const basePath = '/v1/'

app.put(basePath + 'file', uploadMiddleware.single('file'), async (req, res) => {
  const expirationTime = req.headers['expiration-time'];
  const file = req.file;
  if(file && expirationTime) {
    const fileInMemory = fs.existsSync(file.originalname);
    const fileName = file.originalname + (fileInMemory ? ('_' + Date.now()) : '');
    await dbconn.db.collection('files_collection').insertOne({fileName: file.originalname, expiresAt: new Date(Number(expirationTime))});
    res.send('localhost' + basePath + 'file/' + file.originalname);
  } else {
    res.status(500)
  }
});


// app.put(basePath + 'file', uploadMiddleware.single('file'), async (req, res) => {
//   const expirationTime = req.headers['expiration-time'];
//   const file = req.file;
//   if(file && expirationTime) {
//     await dbconn.db.collection('files').insertOne({fileName: file.originalname, file, expireAt: new Date(Number(expirationTime))})
//     res.send(basePath + 'file/' + file.filename);
//   } else {
//     res.status(500)
//   }
// });

// const download = async (req:any, res: any) => {
  // try {
  //   const bucket = new GridFSBucket(dbconn.db, {
  //     bucketName: 'uploads',
  //   });
  //   let downloadStream = bucket.openDownloadStreamByName(req.params.fileUrl);
  //   downloadStream.on("data", function (data) {
  //     return res.status(200).write(data);
  //   });
  //   downloadStream.on("error", function (err) {
  //     return res.status(404).send({ message: "Cannot download the Image!" });
  //   });
  //   downloadStream.on("end", () => {
  //     return res.end();
  //   });
  // } catch (error) {
  // return res.status(500).send({
  //   message: error.message,
  // });
  // }
// };

app.get(basePath + ':fileUrl', (req, res) => {
  const {params: {fileUrl}} = req;
  try {
    const file = fs.readFileSync('./files/' + fileUrl)
    res.send(file)
  } catch(e) {
    res.status(404)
  }
  // download(req, res)
  // dbconn.db.collection('files').findOne({fileName: fileUrl}).then((doc: any) => {
  //   res.set({
  //     "Content-Type": doc.file.mimetype,
  //     'Content-Disposition': 'attachment;filename*=UTF-8\'\'' + fileUrl
  //   });
  //   console.log(doc.file.buffer)
    
  //   res.send(doc.file.buffer.toString)
  // })
});

app.listen(port, () => {
  console.log(`The application started
  successfully on port ${port}`);
});


cron.schedule('* * * * *', function() {
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