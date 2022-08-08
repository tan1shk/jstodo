const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js")

const app = express();

app.set("view engine","ejs")

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const todoSchema = new mongoose.Schema({
    name: String
})

const Todo = mongoose.model("todo", todoSchema);

const todo1 = new Todo ({
    name: "Do Workout"
});

const todo2 = new Todo ({
    name: "Read atleast 10-12 pages"
});

const todo3 = new Todo ({
    name: "Practice Speedcubing"
});

const defaultTodo = [todo1,todo2,todo3] ;


app.get("/", (req, res) => {
    
    Todo.find({}, (err,founditems) =>{

        let day = date();

        if (founditems.length === 0) {
            Todo.insertMany(defaultTodo, (err) => {
                if(err){
                    console.log(err);
                } else {
                    console.log("success")
                }
            });
            res.redirect("/");
        } else {
            res.render("todo" , {listTitle: day, newListItems: founditems});
        }
    });
});

app.post("/", (req,res) => {

    const newitemName = req.body.newItem;

    const todonew = new Todo ({
        name: newitemName 
    });

    todonew.save();

    res.redirect("/");
       
});

app.post("/delete", (req,res) =>{

    const checked = req.body.check;

    Todo.findByIdAndRemove(checked,(err) => {
        if(!err){
            console.log("deleted")
        } 
    });

    res.redirect("/");
});

app.listen(3000, () => {
    console.log("server started on port 3000");
})
