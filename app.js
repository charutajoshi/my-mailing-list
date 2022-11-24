const express = require("express");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const listId = "df71f88591";
const port = 3000;
const app = express();
let responseID = "";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

mailchimp.setConfig({
  apiKey: "",
  server: "us9"
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  const subscribingUser = {
    firstName: req.body.fName,
    lastName: req.body.lName,
    email: req.body.email
  };

  addMember(subscribingUser)
    .then(addedMember => {
      res.sendFile(__dirname + "/success.html")
    })
    .catch(err => {
      res.sendFile(__dirname + "/failure.html")
    })
});

async function addMember(subscribingUser) {
  const response = await mailchimp.lists.addListMember(listId, {
    email_address: subscribingUser.email,
    status: "subscribed",
    merge_fields: {
      FNAME: subscribingUser.firstName,
      LNAME: subscribingUser.lastName
    }
  });

  console.log(
    `Successfully added contact as an audience member. The contact's id is ${
        response.id
      }.`
  );

  return response;
};

app.listen(port, function() {
  console.log("Started running server on port " + port);
});

// List ID
// df71f88591
