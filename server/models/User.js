const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

const saltRounds = 10;

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, //blank를 없애준다,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 8,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  var user = this;
  if (user.isModified("password")) { //비밀번호를 변경할때만 들어갈 수 있도록
    //비밀번호 암호화
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  }else{
    next() //비밀번호 수정아 아니면 다음으로....
  }
});

userSchema.methods.comparePassword= function(plainPassword, cb){
  bcrypt.compare(plainPassword, this.password, function(err, isMatch){
    if(err) return cb(err)
   cb(null, isMatch)

  })
}


userSchema.methods.generateToken = function(cb){
  var user = this
  var token = jwt.sign(user._id.toHexString(), 'secretToken')
  user.token = token
  user.save(function(err, user){
    if(err) return cb(err)
    cb(null, user)
  })  
}


userSchema.statics.findByToken = function(token, cb) {
  var user = this;
  // user._id + ''  = token
  //토큰을 decode 한다. 
  jwt.verify(token, 'secretToken', function (err, decoded) {
      //유저 아이디를 이용해서 유저를 찾은 다음에 
      //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
      user.findOne({ "_id": decoded, "token": token }, function (err, user) {
          if (err) return cb(err);
          cb(null, user)
      })
  })
}
const User = mongoose.model("User", userSchema);

module.exports = { User };
