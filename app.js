const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 8080;


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const places = [
    {name: 'Shreebhumi', image: 'https://www.indianfestivaldiary.com/durgapuja/sreebhumi_sporting_club/2019/sreebhumi_sporting_club.jpg'},
    {name: 'TalaPark', image: 'https://1.bp.blogspot.com/-cRhBTrlrqMQ/XZlsjHfVeQI/AAAAAAAAKLM/QzzWgFe-uR0-HeeKyuy_QaLI6Ve-xkMjACLcBGAsYHQ/s1600/71518039_2686121451452480_1784166119548911616_o.jpg'},
    {name: 'Chetla Sharbojonin', image: 'https://www.amarpujo.com/wp-content/uploads/2016/10/ca-1800x900.jpg'},
    {name: 'Shreebhumi', image: 'https://www.indianfestivaldiary.com/durgapuja/sreebhumi_sporting_club/2019/sreebhumi_sporting_club.jpg'},
    {name: 'TalaPark', image: 'https://1.bp.blogspot.com/-cRhBTrlrqMQ/XZlsjHfVeQI/AAAAAAAAKLM/QzzWgFe-uR0-HeeKyuy_QaLI6Ve-xkMjACLcBGAsYHQ/s1600/71518039_2686121451452480_1784166119548911616_o.jpg'},
    {name: 'Chetla Sharbojonin', image: 'https://www.amarpujo.com/wp-content/uploads/2016/10/ca-1800x900.jpg'}

]

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/places', (req, res) => {
    res.render('places', {places:places});
});

app.post('/places', (req,res) => {
    // res.send('YOU HIT THE POST ROUTE');

    //get data from form and add to places array
    const name = req.body.name;
    const image = req.body.image;
    const newPlace = {name: name, image : image};
    places.push(newPlace);

    //redirect back to places page
    res.redirect('/places');
});

app.get('/places/new', (req, res) => {
    res.render('new.ejs');
});



app.listen(port, () => {
    console.log('FestEve Server started.')
})