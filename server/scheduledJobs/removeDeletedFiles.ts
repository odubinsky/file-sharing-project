import { MongoDbClient } from "../mongodb/mongoDbClient";
import fs from 'fs';
import { filesDir } from "../consts";

export const removeDeletedFiles = async (mongoDbClient: MongoDbClient) => {
  const promisesArr: Promise<void>[] = []
  const list = fs.readdirSync(filesDir);
  list.forEach((fileName) => {
    const promise = mongoDbClient.getFileByName(fileName).then(doc => {
      if(!doc) {
        try {
          fs.rm(filesDir + '/' + fileName, () => {
            console.log('Removed expired file', fileName);
          })
        } catch(e) {
          console.log('Failed to remove expired file', fileName);
        }
      }
    });
    promisesArr.push(promise);
  })
  return Promise.all(promisesArr);
}