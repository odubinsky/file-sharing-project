

import  { dbconn, waitForConnectionPromise  } from "./connection";

const initFilesCollection = async () => {
  await dbconn.db.createCollection('files')
  await dbconn.db.collection('files').createIndex( { "expireAt": 1 }, { expireAfterSeconds: 0 } )
}

dbconn.on('connected', async function() {
  try {
    const listCollections = await dbconn.db.listCollections().toArray();
    let fileCollectionExists = listCollections.some((coll) => coll.name === 'files')
    if(!fileCollectionExists) {
      initFilesCollection()
    }
  } catch(e) {
    console.log('Did not crete collection ', e)
  }
});

const getFileByName = (fileName: string) => dbconn.db.collection('files').findOne({fileName});

const addFile = (fileName: string, expirationTime: string | string[]) => dbconn.db.collection('files').insertOne({fileName, expireAt: new Date(Number(expirationTime))})

const actions = {
  getFileByName,
  addFile,
  waitForConnectionPromise
}

export default actions
export type MongoDbClient = typeof actions;