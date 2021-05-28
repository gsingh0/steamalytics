/**
    objective is to fetch the 100 most popular games on a steam web link and cross check those games
    with the current dataset. For any game not in the dataset, add the game to an object collection.
    Then, use this object collection of games to fetch their respective appids. Finally, we can add
    the scraped games to the dataset. 
 */

const axios = require('axios').default;
const cheerio = require('cheerio');

const WEB_LINK_URL = 'https://store.steampowered.com/stats/';

async function main() {
    try {
        let response = await axios(WEB_LINK_URL);
        let topGames = await parseTopGames(response.data);
        
    } catch (error) {
        console.log(error);
    }
}

async function parseTopGames(data) {
    try {
        let topGames = [];
        let $ = cheerio.load(data);
        $('#detailStats')
            .children('table')
            .children('tbody')
            .children('tr')
            .each((i, elem) => {
                if ($(elem).attr('class') === 'player_count_row') {
                    let elemValue = $(elem).children()[3];
                    topGames.push($(elemValue).text().trim());
                }
            });
        return topGames
    } catch (error) {
        return error;
    }
}

main();