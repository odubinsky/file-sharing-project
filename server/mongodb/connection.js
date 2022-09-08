var mongoose = require("mongoose");

const conn = mongoose.createConnection("mongodb://localhost/project", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
conn.on('connected', function() {
    console.log('database is connected successfully');
});
conn.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
conn.on('error', console.error.bind(console, 'connection error:'));

module.exports = conn;