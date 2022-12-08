const express = require("express");
const dotenv = require("dotenv");
const app = express();
const mail = require("./controllers/mailsend");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const user = require("./controllers/user");
app.use(cors());
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(null, "leave.xlsx");
  },
});
const upload = multer({ storage: storage });
// dotenv.config({ path: path.resolve("./config/config.env") });
app.use(express.json());
connectDB();
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.post("/register", (req, res) => {
  user.register(req, res);
});
app.post("/login", (req, res) => {
  user.login(req, res);
});

app.post("/sendEmail",cors(), upload.single("uploaded_file"), mail.mailsend);

app.listen(3333, () => {
  console.log("server runing on 3333 PORT");
});
