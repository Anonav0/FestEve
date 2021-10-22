const express    = require("express");
const app        = express();
const bodyParser = require("body-parser");
const port       = process.env.PORT || 8080;

//Integrating mongoDB
const mongoose   = require("mongoose");




mongoose.connect("mongodb://localhost/FestEve");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//SCHEMA SETUP
const pujaSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

const Puja = mongoose.model("Puja", pujaSchema);

// Puja.create({
//     name: "Tala Park Sharbojonin",
//     image: "https://1.bp.blogspot.com/-cRhBTrlrqMQ/XZlsjHfVeQI/AAAAAAAAKLM/QzzWgFe-uR0-HeeKyuy_QaLI6Ve-xkMjACLcBGAsYHQ/s1600/71518039_2686121451452480_1784166119548911616_o.jpg",
//     description: "DARUN PUJA TA! KINTU ONEK BHIR"
// }, (err, puja)=> {
//     if(err) {
//         console.log(err);
//     }else {
//         console.log('NEWLY CREATED PUJA ENTRY');
//         console.log(puja);
//     }
// });


//INDEX ROUTE - shows all the puja entries
app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/pujas', (req, res) => {
    //get all pujas from DB
    Puja.find({}, (err, allPujas) => {
        if(err){
            console.log(err);
        } else {
            res.render('index', {pujas: allPujas});
        }
    })
   
});

//CREATE ROUTE - to create a new puja entry
app.post('/pujas', (req,res) => {
    // res.send('YOU HIT THE POST ROUTE');

    //get data from form and add to places array
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const newPuja = {name: name, image : image, description : desc };
    //Create a new Puja and save to DB
    Puja.create(newPuja, (err, Newpuja) =>  {
        if(err) {
            console.log(err);
        } else {
            //redirect back to places page
            res.redirect('/pujas');
        }
    })

    
});

//NEW - show form to create new puja entry
app.get('/pujas/new', (req, res) => {
    res.render('new.ejs');
});

//SHOW - show more info about one Puja entry
app.get("/pujas/:id", (req,res)=> {

    //find the puja with provided Id and show to puja.
    Puja.findById(req.params.id, (err,foundPuja)=> {
        if(err) {
            console.log(err);
        } else {
            res.render("show", {puja: foundPuja});
        }

    });

});




app.listen(port, () => {
    console.log('FestEve Server started.')
})