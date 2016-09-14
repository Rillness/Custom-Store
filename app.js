// var PriceFinder = require('price-finder');
// var priceFinder = new PriceFinder();
// var amazon = require('amazon-product-api');
var scraperjs = require('scraperjs');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var request = require('request');
var cheerio = require('cheerio');
///////////////////////////////////////////////////////////////
                /////// Mongoose Model ////////

mongoose.connect('mongodb://localhost/Custom-Store');

var ProductSchema = new mongoose.Schema({

    Full : [{
        store_name : String,
        link : String,
        title : String,
        price : String,
        image : [],
        index : String
    }]
});

var Product = mongoose.model('Products', ProductSchema);


///////////////////////////////////////////////////////////////

// var testtt = Product({
//
//     Full : [{
//       store_name : 'Target',
//       link : 'http://www.google.com',
//       price : '8.99',
//       image : 'test.jpeg'
//     }]
//
// }).save(function(err,body){
//   if(err){
//     console.log(err);
//   }else{
//     console.log('SAVED');
//   }
// });

///////////////////////////////////////////////////////////////
//Walmart URL
var WalmartUrl = "https://www.walmart.com/search/?query=Arduino";

//Target URL
var targetUrl = "http://www.target.com/s?category=0%7CAll%7Cmatchallpartial%7Call+categories&searchTerm=car";

//Best Buy URL
var bestBuyUrl = "http://www.bestbuy.com/site/searchpage.jsp?st=car&_dyncharset=UTF-8&id=pcat17071&type=page&sc=Global&cp=1&nrp=&sp=&qp=&list=n&af=true&iht=y&usc=All+Categories&ks=960&keys=keys";

///////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////
                        // URLS THAT WORK //
//eBay URL --> Works.
var ebay = "http://www.ebay.com/sch/i.html?_from=R40&_trksid=p2050601.m570.l1313.TR12.TRC2.A0.H0.Xcheese.TRS0&_nkw=" + 'ENTER QUERY' + "&_sacat=0";


//Jet.com URL --> Works.
var Jet = "https://jet.com/search?term=car";

//WalgreensUrl --> Works
var Walgreens = "https://www.walgreens.com/search/results.jsp?Ntt=cars";

                        // URLS THAT WORK //
//////////////////////////////////////////////////////////////

request(Walgreens, function(err, resp, body){


  if(!err){

    var $ = cheerio.load(body);


var testText = $('a', '.wag-product-card-details');


$('.ng-binding').each(function(){

    var aliLink = $(this).text();

        console.log(aliLink);


  });




  }

})


//Here is the main home page.
app.get('/', function(req,res){

  //Removing everything from the DB.
    Product.remove({}, function(err){
      if(!err){
        console.log('REMOVED ALL');
      }
    });

    res.render('index.ejs');
  });


//Here is the save page.
app.get('/searched', function(req,res){

//Console.log to see what you searched for.
console.log('Searched for: ' + req.query.search);


//////////////////////////////////////////////////////////////
                    // URLs //
var searchItem = req.query.search;

var ebayUrl = "http://www.ebay.com/sch/i.html?_from=R40&_trksid=p2050601.m570.l1313.TR12.TRC2.A0.H0.Xcheese.TRS0&_nkw=" + searchItem + "&_sacat=0";

var AliBabaUrl = "http://www.alibaba.com/trade/search?fsb=y&IndexArea=product_en&CatId=&SearchText=" +  searchItem  + "+";

var JetUrl = "https://jet.com/search?term=" + searchItem;

var WalgreensUrl = "https://www.walgreens.com/search/results.jsp?Ntt=" + searchItem;

//////////////////////////////////////////////////////////////



// Ebay Request/Database //
//////////////////////////////////////////////////////////////


request(ebayUrl, function(err, resp, body){
  if(!err){

    var $ = cheerio.load(body);
  }


  var ebayImages = [];


  $('img', '.img').each(function(){

        var image = $(this).attr('src');

        ebayImages.push(image);


});


//console.log(images);


 $('a', '.lvtitle').each(function(num){

   var title = $(this).text();

   var link = $(this).attr("href");

   var number = num;


    var testtt = Product({

        Full : [{
          store_name : 'eBay',
          link : link,
          title : title,
          price : "price",
          image : ebayImages,
          index : number
        }]

    }).save(function(err,body){
      if(err){
        console.log(err);
      }else{
      console.log(body);
      }
    });

  });

});

// Ebay Request/Database //
//////////////////////////////////////////////////////////////




Product.find({}, function(err,body){
  if(err){
    console.log(err);
  }else{
    res.render('test.ejs', { body : body });
  }
});


});



// app.get('/', function(req,res){
//   res.send('ON');
//
// });




app.listen('3000', function(){
    console.log('Listening on PORT 3000');
});
