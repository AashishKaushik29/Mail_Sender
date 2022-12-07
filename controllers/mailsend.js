const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");

const reader = require("xlsx");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  service: "gmail",
  auth: {
    user: "admin@monetlive.com",
    pass: "xnfoogozwbfoemgm",
  },
});

const template = Handlebars.compile(
  fs.readFileSync(path.join("./views/admin.handlebars"), "utf-8")
);

exports.mailsend = (req, res) => {
  const file = reader.readFile(path.resolve("./uploads/leave.xlsx"));
  let data = [];
  const sheets = file.SheetNames;
  for (let i = 0; i < sheets.length; i++) {
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
    temp.forEach((res) => {
      data.push(res);
    });
  }

  data.forEach(async (item) => {
    const email = item.Email;
    let locals = {
      Name: item.Name,
      SL: item.SL || "Not Provided",
      PL: item.PL || "Not Provided",
      CL: item.CL || "Not Provided",
    };

    const options = (local) => {
      return {
        from: "admin@monetlive.com",
        to: email,
        subject: "Your Remaining Leaves ",

        html: template(local),
      };
    };
    const sentMail = await transporter.sendMail(options(locals));
  });
  res.send({ message: " mail send succesfully" });
};
