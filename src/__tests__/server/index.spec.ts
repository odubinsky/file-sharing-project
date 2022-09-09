import { wait } from '@testing-library/user-event/dist/utils';
import fs from 'fs';
import {filesDir} from '../../../server/consts'
import { removeDeletedFiles } from '../../../server/scheduledJobs/removeDeletedFiles';

global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
let mongoDbClient: any;


test('Should add file and delete it after expiration', async () =>{
  mongoDbClient = await (await import('../../../server/mongodb/mongoDbClient')).default
  await mongoDbClient.waitForConnectionPromise;
  const testFileName = '/test.txt';
  fs.writeFileSync(filesDir + testFileName, '');
  await mongoDbClient.addFile(testFileName, Date.now().toString())
  await removeDeletedFiles(mongoDbClient);
  await wait(1000)
  let exists;
  try {
    exists = fs.readFileSync(filesDir + testFileName);
  } catch(e) {

  }
  expect(exists).toBeUndefined();
})