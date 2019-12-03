const express = require('express');
const mariadb = require('mysql');
const bodyParser = require('body-parser');
const hostname = 'greenbusiness.ctoj3jsxqwtc.us-west-1.rds.amazonaws.com'; //Endpoint acquired from AWS
const username = 'root';
const password = 'password';
const port = 3000;

//establish connection to database using express
const  db = mariadb.createConnection({
    host: hostname,
    user: username,
    password: password,
    database: 'greenbusinessDB',
    port: 3306
});

      
const app = express();  

app.set('view engine','ejs');

app.use(bodyParser.json()); //using bodyParser to obtain user input for search query
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('./assets'));


app.get('/',(req, res) => {
    //redirect so that once launch, the page will go straight to search page listing all companies
    res.redirect('/search'); 
});
//create a get template for business page
app.get('/business',(req, res) => {
    res.render('view-business',{
        business:{
            name: '<Name>',
            category: '<Category>',
            street: '<Street>',
            city: '<City>',
            zip: '<ZIP>',
            phoneNumber: 'Phone Number',
            description: '<Description>',
            mapSrc: ''
        },
        user: null
    });
});
//Create a profile business subpage
app.get('/business/:name',(req, res) => {
    
    console.log('it works');
    var sql = `SELECT * FROM BUSINESS WHERE BUS_NAME = "${req.params.name}"`;
    db.query(sql, (err, result) => {
        if(err) throw err;
        var path = result[0];
        
        
        var object = {
            name: path.BUS_NAME,
            category: path.BUS_CATEGORY,
            street: path.BUS_ADDRESS,
            city: path.BUS_CITY,
            zip: path.BUS_ZIP,
            phoneNumber: path.BUS_CONTACT,
            description: path.BUS_DESCRIPTION,
            photo: path.BUS_LOGO,
            pdf: path.BUS_CERT
        }

        console.log(object);
        res.render('view-business',{
        business: object,
        user: null
        });
    });  
});

//create search page listing all business in the database
app.get('/search',(req, res) => {

    console.log('search works');
    var sql = `SELECT * FROM BUSINESS`;
    db.query(sql, (err, result)=>{
        if(err) throw err;
        console.log(result);
        res.render('view-search',{
            businesses:result,
            user: null
        })
    });
});

//create a post query allowing users to search for a business 
app.post('/search/query',(req, res)=>{

    var qr = req.body.query;
    var sql = `SELECT * FROM BUSINESS WHERE BUS_NAME LIKE '%${qr}%' OR BUS_ADDRESS LIKE '%${qr}%' OR BUS_CATEGORY LIKE '%${qr}%' `+
     `OR BUS_CITY LIKE '%${qr}%' OR BUS_DESCRIPTION LIKE '%${qr}%'`;
    
    db.query(sql, (err, result)=>{
        if(err) throw err;
        console.log(result);
        res.render('view-search',{
            businesses:result,
            user: null
        })
    });

});


app.listen(process.env.PORT || port);
console.log(`Green Business running on port ${process.env.PORT || port}`);


