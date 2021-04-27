require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const client = require("@mailchimp/mailchimp_marketing");
app.use(express.urlencoded({
  extended: true
}));


//local files in our project are called static files. and to serve these files on our server we need to use static functon
app.use(express.static("public")); //to send the local information or static information like css file and images to the servers.

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
var first = req.body.fname;
  var second = req.body.lname;
  var email = req.body.email;

///////////////////      Mailchip Add a member function         ////////////////////////
client.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: "us1",
  });

  if (email) {
    const run = async () => {
      client.lists.addListMember(process.env.AUDIENCE_ID, {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: first,
            LNAME: second
          }
        })
        .then(response => {
            if (response) {
            res.sendFile(__dirname + "/success.html")
          } else {
            res.sendFile(__dirname + "/failure.html")
          }
        })
        .catch(err => console.log(err))
    };
    run();
  } else {
    res.status(404).sendFile(__dirname + "/failure.html")
  }
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});
app.post("/success", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("This Server is running just fine.");
});
