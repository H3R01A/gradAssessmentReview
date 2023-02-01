const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs');


//! need to make sure to define the SALT WORK FACTOR FOR ENCRYPTION
const SALT_WORK_FACTOR = 10;


const userSchema = Schema({

    username: {type: String, required: true, unique: true},
    password: {type: String, required: true },
    items: [{name: {type: String}, status: {type: Boolean , default: false}}]
});


//implementing bcrypt

userSchema.pre('save', function (next) {

    bcrypt.hash(this.password, SALT_WORK_FACTOR, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      return next();
  
    })
  
  });

module.exports = mongoose.model('User', userSchema);