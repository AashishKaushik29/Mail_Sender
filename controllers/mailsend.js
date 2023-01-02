const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const { unlink } = require("node:fs");
const viewsPath = path.resolve(
  path.join(__dirname, "../views/Ashmar logo 1.png")
);
const reader = require("xlsx");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  service: "gmail",
  auth: {
    // user: "admin@monetlive.com",
    // pass: "xnfoogozwbfoemgm",
    user: "admin@ashmar.in",
    pass: "Ansuman_1",
  },
});

const template = Handlebars.compile(
  fs.readFileSync(path.join("./views/mail2.handlebars"), "utf-8")
);

exports.mailsend = (req, res) => {
  try {
    const file = reader.readFile(path.resolve("./uploads/leave.xlsx"));
    let data = [];
    const sheets = file.SheetNames;
    for (let i = 0; i < sheets.length; i++) {
      const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
      temp.forEach((res) => {
        data.push(res);
      });
    }

    data.forEach(async (item, index) => {
      console.log(item);
      const email = item.Email;
      const date = new Date().toLocaleDateString();

      let locals = {
        Name: item.Name,
        SL: item.SL || "Not Provided",
        PL: item.PL || "Not Provided",
        CL: item.CL || "Not Provided",
        Date: date,
      };
      const options = (local) => {
        return {
          from: "admin@ashmar.in",
          to: email,
          subject: "Your Remaining Leaves ",

          html: template(local),
          attachments: [
            {
              filename: "logo.png",
              path: `${viewsPath}`,
              cid: "logo",
            },
          ],
        };
      };
      setTimeout(() => {
        const sentMail = transporter.sendMail(
          options(locals),
          function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent" + info.response);
            }
          }
        );
      }, 1000 * index);
    });

    unlink(path.resolve("./uploads/leave.xlsx"), (err) => {
      if (err) throw err;
      console.log("path/file.txt was deleted");
    });
    res.send({ message: "Mail Sending " });
  } catch (error) {
    res.send({ message: "Error: " + error.message });
    console.log(error.message);
  }
};
