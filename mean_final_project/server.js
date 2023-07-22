const express = require("express");
const app = express();
const port = 5000;
const path = require("path");

const mongojs = require("mongojs");
const db = mongojs("contactlist", ["contactlist"]);

const bodyParser = require("body-parser");

app.listen(port);

app.use("/", function(req,res,next){
    next();
})

app.use(express.static(path.join(__dirname,"public")));

app.use(bodyParser.json()); // middleware

app.get("/", function(req,res){
    res.sendFile(__dirname + "/index.html");

})


app.get('/contactlist', function(req,res){
    console.log("I got a request from the Controller for /contactlist");

    db.contactlist.find(function(err,docs){
        console.log(" I receive data from the MongoDB Server");
        console.log(docs);
        res.json(docs);
    })

 

})


app.post("/contactlist", function(req,res){
    console.log("Yes I received the New Data ...");
    console.log(req.body);

    db.contactlist.insert(req.body, function(err, doc){
        res.json(doc);
        })
})

app.delete("/contactlist/:id", function(req,res){
    var id = req.params.id;
    console.log(id);

db.contactlist.remove({_id: mongojs.ObjectID(id)}, function(err,docs){
    res.json(docs);
})

})

app.get("/contactlist/:id", function(req,res){
    var id = req.params.id;
    console.log(id);

    db.contactlist.findOne({_id: mongojs.ObjectID(id)}, function(err,doc){
        res.json(doc);
        })
})

app.put("/contactlist/:id", function(req,res){
    var id = req.params.id;
    console.log(id);

    db.contactlist.findAndModify({query: {_id: mongojs.ObjectID(id)}, 
    update: {$set : {name: req.body.name, email: req.body.email, mobile: req.body.mobile}},
    new: true}, function(err,docs){
        console.log(docs);

        res.json(docs);
    })
})


console.log("Server is Running");