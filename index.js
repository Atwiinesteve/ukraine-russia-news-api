// Import Modules.
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { response } = require('express');

//Application Setup.
const app = express();
const PORT = process.env.PORT || 5000;

// Newspapers
let newspapers = [

    {
        name: 'guardian',
        address: 'https://www.theguardian.com/international',
        base: ''
    },
    {
        name: 'NYdailynews',
        address: 'https://www.nydailynews.com/search/ukraine%2Brussia%2Bwar/100-y/ALL/score/1/?',
        base: ''
    },
    {
        name: 'dailynews',
        address: 'https://tdn.com/search/?sd=desc&l=25&s=start_time&f=html&t=article%2Cvideo%2Cyoutube%2Ccollection&app=editorial&nsa=eedition&q=Ukraine+Russia+war',
        base: ''
    },
    {
        name: 'thedailybeast',
        address: 'https://www.thedailybeast.com/search?q=Ukraine+Russia+War',
        base: ''
    },
    {
        name: 'yahoo',
        address: 'https://search.yahoo.com/search?p=ukraine+russia+conflict+latest+news&fr=news&fr2=sa-gp-ybar',
        base: ''
    }

];

// News Articles.
let articles = [];

// Getting all newspapers.
app.get('/news', async(req, res) => {

    newspapers.forEach((newspaper) => {
        axios.get(newspaper.address)
            .then((response) => {
                const html = response.data;
                const $ = cheerio.load(html);

                $('a:contains("Russia")', html).each(function() {
                    const title = $(this).text();
                    const url = $(this).attr('href');


                    articles.push({
                        title,
                        url: newspaper.base + url,
                        source: newspaper.name
                    })
                })

                res.json(articles);

            }).catch((error) => { console.log(error); })
    })

})

// Getting a specific newsletter
app.get('/news/:newspaperID', async(req, res) => {

    const newspaperID = req.params.newspaperID;
    const newspaperAddress = newspapers.filter((newspaper) => newspaper.name === newspaperID)[0].address;
    const newspaperBase = newspapers.filter((newspaper) => newspaper.name === newspaperID)[0].base;

    axios.get(newspaperAddress)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            let specificNews = [];

            $('a:contains("Russia")', html).each(function() {
                const title = $(this).text();
                const url = $(this).attr('href');

                specificNews.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperID
                })
            })

            res.json(specificNews);

        })
        .catch((error) => {
            console.log(error);
            res.send('An Error Occurred trying to Access the Data.')
        })

})



// Home Route.
app.get('/', (request, response) => { response.send('Welcome to the Ukraine - Russia News API. Get to now what is happening in the world concerning Ukraine and Russia.'); });

//Server Setup.
app.listen(PORT, () => { console.log(`Server Application Running at http://localhost:${PORT}`); });