const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});


app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }


  const jsonData = JSON.stringify(data);

  const url = "https://us1.api.mailchimp.com/3.0/lists/35531d2094"
  const options = {
    method: "POST",
    auth: "paul1:a7babca608b926bae7ed3a1ed399ff5a-us1"
  }

  const request = https.request(url, options, function(response){


    response.on("data", function(data){

      var newsLetterData = JSON.parse(data);
      const error = newsLetterData.error_count;

      if (error === 0) {
        res.sendFile(__dirname + "/success.html");
      }
      else {
        res.sendFile(__dirname + "/failure.html");
      }

    });
  });

  request.write(jsonData);
  request.end();
});


app.post("/failure", function(req, res){
  res.redirect("/");
});



app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000!");
});

//API KEY
//a7babca608b926bae7ed3a1ed399ff5a-us1

//LIST ID
//35531d2094
