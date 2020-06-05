const express = require("express");
const bodyParser = require("body-parser");
const { User } = require("./models/User");
const config = require("./config/key");
const cookieParser = require("cookie-parser");
const {auth} = require('./middleware/auth')
const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true })); //application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 갖고오게 해줌
app.use(bodyParser.json()); //application/json 이렇게 된 데이터를 분석해서 갖고오게 해줌
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connect Success"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!! 크크루삥뽕");
});

app.post("/api/user/register", (req, res) => {
  //회원가입할 때 필요한 정보를 클라이언트에서 받아오면 얘네를 DB로 넣어줌
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.json({ Success: false, err });
    return res.status(200).json({
      Success: true,
    });
  }); //정보들을 Usermodel에 저장
});

//로그인
app.post("/api/user/login", (req, res) => {
  //요청된 이메일을 DB에서 찾는다.
  User.findOne({ email: req.body.email }, (err, userInfo) => {
    if (!userInfo) {
      return res.json({
        loginSuccess: "Fail",
        message: "이메일을 다시 확인해 주세요",
      });
    }
    //만약 요청된 이메일이 있다면 비밀번호를 비교한다
    userInfo.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: "Fail",
          message: "비밀번호가 틀립니다.",
        });
      }
      //다 맞다면 유저를 위한 토큰을 생성한다
      userInfo.generateToken((err, userInfo) => {
        if (err) return res.status(400).send(err);

        //토큰을 저장한다(쿠키 혹은 로컬스토리지 등등...)
        //난 쿠키에다가!
        res.cookie("x_auth", userInfo.token).status(200).json({
          loginSuccess: true,
          userId: userInfo._id,
        });
      });
    });
  });
});


app.get('/api/user/auth',auth,(req, res)=>{
  //여기까지 미들웨어를 통과를 했다면 auth가 true라는 소리
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0? false: true,
    isAuth: true,
    email: req.user.email,
    username: req.user.username,
    lastname: req.user.lastname
  })
})

app.get('/api/user/logout', auth, (req, res) => {
  // console.log('req.user', req.user)
  User.findOneAndUpdate({ _id: req.user._id },
    { token: "" }
    , (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true
      })
    })
})



app.listen(port, () => console.log(`App is running at Port ${port}`));
