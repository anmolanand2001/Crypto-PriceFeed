const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

async function PriceFeed() {
    try {
        const siteUrl = "https://coinmarketcap.com/";
        const { data } = await axios({
            method: 'GET',
            url: siteUrl,
        })

        const $ = cheerio.load(data);
        const elemSelector = '#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div:nth-child(1) > div.h7vnx2-1.bFzXgL > table > tbody > tr';
        
        const keys = [
            'rank',
            'name',
            'price',
            '24h',
            '7d',
            'marketCap',
            'volume',
            'circulatingSupply'
        ]

        const coinArr=[];
        $(elemSelector).each((parentIdx, parentElem)=>{
            let keysIdx = 0;
            const coinsObj={};
            if(parentIdx <= 9){
                $(parentElem).children().each((childIdx, childElem) =>{
                    let tdValue = $(childElem).text();

                    if(keysIdx == 1 || keysIdx == 6){
                        tdValue = $('p:first-child',$(childElem).html()).text();
                    }
                    if(tdValue){
                        coinsObj[keys[keysIdx]] = tdValue                        
                        keysIdx++
                    }
                })
                coinArr.push(coinsObj);
            }
        })
        // console.log(coinArr);
        return coinArr;
    } catch (error) {
        console.error(error);
    }
}

// PriceFeed();

const app = express();
app.get('/api/Cypto-scraper', async(req, res)=>{
    try {
        const priceFeed = await PriceFeed();
        return res.status(200).json({
            result: priceFeed,
        })
    } catch (error) {
        return res.status(500).json({
            error: error.toString(),
        })
    }
})

app.listen(3000, ()=>{
    console.log("Running on port 3000");
})