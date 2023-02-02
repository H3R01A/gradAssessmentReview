const mongoose = require("mongoose");
const { Schema } = mongoose;

const sessionSchema = new Schema({
  cookieId: { type: String, required: true, unique: true },

  //!if you want to make a session controller where it expires, do the following
  //add the "expires" property and put a time in seconds. For more information - https://mongoosejs.com/docs/schematypes.html
  //createdAt has an automatic expiry of 30 seconds, you either need to set yourself or change it

    //more information on TTL https://www.mongodb.com/docs/manual/core/index-ttl/
    //more information on where to find TTL on mongo server mongodb.com/community/forums/t/document-entries-gets-deleted-after-a-couple-of-minutes-mongodb-atlas/153267
    //86400 seconds = 24 hours
  createdAt: { type: Date, expires: 86400, default: Date.now },
});

module.exports = mongoose.model("Session", sessionSchema);
