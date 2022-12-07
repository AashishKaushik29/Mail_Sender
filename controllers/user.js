const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    encryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });
    const token = jwt.sign(
      { user_id: user._id, email },
      "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJhZG1pbiI6dHJ1ZSwiaWQiOiJtb25ldEAxMjMifQ.1g3Fn9IIbnNIx4IhMnhR8j6S28BxQZMUg_WhtXlYMAy2rU5RT7xaPCQ8HeF0qJYM17oapbrnXrVKdqK-sVPAFA",
      // {
      //   expiresIn: "2h",
      // }
    );
    user.token = token;
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJhZG1pbiI6dHJ1ZSwiaWQiOiJtb25ldEAxMjMifQ.1g3Fn9IIbnNIx4IhMnhR8j6S28BxQZMUg_WhtXlYMAy2rU5RT7xaPCQ8HeF0qJYM17oapbrnXrVKdqK-sVPAFA",
        // {
        //   expiresIn: "2h",
        // }
      );

      user.token = token;

      res.status(200).send({ Message: "login Successfully", data: user });
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
};
