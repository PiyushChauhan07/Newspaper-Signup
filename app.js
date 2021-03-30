const express = require('express');
const fetch = require('node-fetch');
var MD5 = require("crypto-js/md5");
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

client.setConfig({
    apiKey: "6a2674aaf6c06770a01fb5987da7cebd-us1",
    server: "us1",
  });

  if (email) {
//   var bak = MD5(email).toString();
    const run = async () => {
      //     // const response = await
      // ///get info
      //    client.lists.getListMember(
      //       "9f060e7e2b",
      //       // "C560B5F32ED062EAC9BCDEB863E5A498"
      //       bak
      //     )
      //     .then(result => {
      //       // console.log(result);
      //       if(result.text.status !== "200"){
      //         res.sendFile(__dirname + "/failure.html")
      //       }else{
      //         // const run = async () => {
      client.lists.addListMember("9f060e7e2b", {
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

// mailchimp api key
//6a2674aaf6c06770a01fb5987da7cebd-us1


// list/audience Id
// 9f060e7e2b

// test scripts
//"test": "echo \"Error: no test specified\" && exit 1"
