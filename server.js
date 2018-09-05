const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/gofundme');

const axios = require('axios');
const cheerio = require('cheerio');
const db = require('./models/Fundraiser.js');

const scrape = function() {
    axios.get('https://www.gofundme.com/discover/medical-fundraiser')
    .then(function(response) {
        let $ = cheerio.load(response.data);

        $('div.react-campaign-tile').each(function(i, element) {
            let url = result;
            
            result = $(this)
              .children('a')
              .attr('href');

            axios.get(url).then(function(response) {
                let $ = cheerio.load(response.data);
                
                $('body').then(function(i, element) {
                    let result = {};

                    result.title = $(this)
                        .children('h1.campaign-title')
                        .text();

                    result.summary = $(this)
                        .children('div.co-story')
                        .text();

                    result.city = $(this)
                        .children('div.pills-contain')
                        .children('a')
                        .children('i')
                        .text();

                    result.moneyRaised = $(this)
                        .children('div.mb')
                        .children('h2')
                        .children('strong')
                        .text();

                    db.Fundraiser.create(result)
                        .then(function(dbFund) {
                            console.log(dbFund)
                        })
                        .catch(function(err) {
                            console.log(err);
                        });
                });
            });
        });       
    });
};

scrape();

app.listen(PORT, function() {
    console.log('App running on port ' + PORT);
});
