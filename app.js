const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const md5 = require("md5");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/registerDB", {useNewUrlParser: true});

const registerSchema = {
  username: String,
  password: String
};



const Register = mongoose.model("Register", registerSchema);


app.post("/signin",function(req,res){
  Register.find({username: req.body.username}, function(err,userFound){
        if(userFound.length==0){
          res.send("No user Found");
          console.log(userFound)
        }
        else{
          if(userFound[0].password== md5(req.body.password)){
            res.send("User Logged In");
            console.log(userFound);
          }
          else{
            res.send("Please Check Your Details");
          }
        }
  })
});

app.post("/signup",function(req,res){
  const register = new Register({
    username : req.body.username,
    password : md5(req.body.password)
  });
  register.save(function(err){
    if(!err){
      res.send("Successfully register");
    }
    else{
      console.log(err);
    }
  });
});

app.delete("/delete",function(req,res){
  Register.find({username: req.body.username}, function(err,userFound){
    if(userFound.length==0){
      res.send("No user Found");
    }
    else{
      if(userFound[0].password== md5(req.body.password)){
        Register.deleteOne({username: req.body.username},function(err){
          if(!err){
            res.send("User Deleted");
          }
        });
      }
      else{
        res.send("Please Check Your Details");
      }
    }
})
  
})



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
