
var mongoose = require("mongoose");

var fileSchema = new mongoose.Schema({
  name: String,
  desc: String,
  file:
    {
        data: Buffer,
        contentType: String
    }
});

module.exports = new mongoose.model('File', fileSchema);