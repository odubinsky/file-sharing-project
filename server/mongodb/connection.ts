import mongoose from "mongoose"

export const dbconn = mongoose.createConnection("mongodb://localhost/project", {
  //@ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
dbconn.on('connected', async function() {
  /// TODO: check if collection exists
  // await dbconn.db.createCollection('files')
  // await dbconn.db.collection('files').createIndex( { "expireAt": 1 }, { expireAfterSeconds: 0 } )
  // await dbconn.db.collection('uploads.files').createIndex( { "expireAt": 1 }, { expireAfterSeconds: 0 } )
  // await dbconn.db.collection('uploads.chunks').createIndex( { "expireAt": 1 }, { expireAfterSeconds: 0 } )
  console.log('database is connected successfully');
});

dbconn.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
dbconn.on('error', console.error.bind(console, 'connection error:'));

