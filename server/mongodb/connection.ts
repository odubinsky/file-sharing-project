import mongoose from "mongoose"
export const dbconn = mongoose.createConnection("mongodb://localhost/project", {
  //@ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const waitForConnectionPromise = new Promise((resolve, reject) => {
  dbconn.on('connected', async function() {
    resolve(true);
  });
})

const initCollection = async () => {
  await dbconn.db.createCollection('files')
  await dbconn.db.collection('files').createIndex( { "expireAt": 1 }, { expireAfterSeconds: 0 } )
}

dbconn.on('connected', async function() {
  try {
    const listCollections = await dbconn.db.listCollections().toArray();
    let fileCollectionExists = listCollections.some((coll) => coll.name === 'files')
    if(!fileCollectionExists) {
      initCollection()
    }
  } catch(e) {
    console.log('Did not crete collection ', e)
  }
  console.log('database is connected successfully');
});

dbconn.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
dbconn.on('error', console.error.bind(console, 'connection error:'));

