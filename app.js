const express = require("express");
const app = express();

const port = process.env.PORT || 3000;


app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/places', (req, res) => {
    const places = [
        {name: 'Shreebhumi', images: 'https://www.indianfestivaldiary.com/durgapuja/sreebhumi_sporting_club/2019/sreebhumi_sporting_club.jpg'},
        {name: 'TalaPark', images: 'https://1.bp.blogspot.com/-cRhBTrlrqMQ/XZlsjHfVeQI/AAAAAAAAKLM/QzzWgFe-uR0-HeeKyuy_QaLI6Ve-xkMjACLcBGAsYHQ/s1600/71518039_2686121451452480_1784166119548911616_o.jpg'},
        {name: 'Chetla Sharbojonin', images: 'https://www.amarpujo.com/wp-content/uploads/2016/10/ca-1800x900.jpg'}

    ]

    res.render('places', {places:places});
})



app.listen(port, () => {
    console.log('FestEve Server started.')
})