const express = require("express");
const https = require("https");
const app = express();
app.get("/", function(req, res) {
  const url = "https://api.thecatapi.com/v1/breeds?appid=0139dfbf-e4a6-43d7-999a-f8f7cb3c173"; //app key

  https.get(url, function(response) {
    console.log(response.statusCode);

    const chunks = [];

    response.on("data", function(chunk) {
      chunks.push(chunk);
    });

    response.on("end", function() {
      const data = Buffer.concat(chunks);
      let breedsData = JSON.parse(data);
      let topCatbreeds = {};
      let topRating = 15; // If max is 5, then combo of all ratings will become 15. The closest to this number is what we need
      let output = '';
      let n = 1;

      for (var i = 0; i < breedsData.length; i++) {
        let breedName = breedsData[i].name;
        let rating = breedsData[i].child_friendly + breedsData[i].dog_friendly + breedsData[i].stranger_friendly;

        //check if this rating is a new key?
        if (!topCatbreeds.hasOwnProperty(rating)) {
          topCatbreeds[rating] = []; // add the key and say it is an array
        }
        topCatbreeds[rating].push(breedName); //push the breed into its rating array
        topCatbreeds[rating].sort(); //optional, just for viewing ease
      }

      while (topRating >= 0) {

        if (typeof topCatbreeds[topRating] !== 'undefined') { //proceed only if ratings exist, can also use hasOwnProperty
          if (n <= 5) { //because we only want the top 5 categories
            output += '<p><h2><strong>Top ' + n + ' Cats based on rating:</strong></h2></p>';
            output += '<ul>';
            output += '<li>' + topCatbreeds[topRating].join('</li><li>') + '</li>';
            output += '</ul>';
          }
        }
        n++;
        topRating--; //decrease rating to look for new cats
      }
      res.send(output);
    });
  });
});
process.on('uncaughtException', function(exception) {
  console.log(exception);
});

app.listen(3000, function() {
  console.log("server started");
});
