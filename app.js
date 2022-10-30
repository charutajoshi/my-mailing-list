const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const https = require("https");
const app = express();
const port = 3000;
const listId = "cf2b830dca";

mailchimp.setConfig({
  apiKey: "880dd329dfe4b341c5782653401f5938-us9",
  server: "us9",
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res) {
  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;
  // console.log(fName, lName, email);

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fName,
        LNAME: lName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us9.api.mailchimp.com/3.0/lists/cf2b830dca";

  const options = {
    method: "POST",
    auth: "charuta:880dd329dfe4b341c5782653401f5938-us9"
  }

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

  //   response.on("data", function(data) {
  //     console.log(JSON.parse(data));
  //   })
  // })

  request.write(jsonData);
  request.end();
})

app.post("/failure", function(req, res) {
  res.redirect("/");
})

app.listen(port, function() {
  console.log("Started running server on port " + port);
})

//880dd329dfe4b341c5782653401f5938-us9
//cf2b830dca
