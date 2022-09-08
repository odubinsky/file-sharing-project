import mongoose from "mongoose"

export const dbconn = mongoose.createConnection("mongodb://localhost/project", {
  //@ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
dbconn.on('connected', async function() {
  console.log('database is connected successfully');
});

dbconn.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
dbconn.on('error', console.error.bind(console, 'connection error:'));

