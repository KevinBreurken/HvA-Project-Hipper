console.log("ingeladen")

const fs = require('fs');
const query = require("./utils/databaseHelper");
const config = require("./server.js");
const res = require("express");

fs.readFile('./random_generated.json', 'utf-8', (err, data) => {
    //initialize some variables
    let serieNummer
    let datum
    let kwartierScore
    let pamScore
    let datums = []

    //read json file
    data = JSON.parse(data)

    //loop through each pam serial number
    for (let nummer = 0; nummer < data.length; nummer++) {
        //get serial numbers
        serieNummer = data[nummer].pamnr
        console.log("nummer: " + serieNummer)

        const connectionPool = query.init();
        query.handleQuery(connectionPool, {
                query: "SELECT serienummer, datum FROM pam_score WHERE serienummer = ?",
                values: [0]
            }, (queryData) => {
                //just give all data back as json
                //res.status(httpOkCode).json(queryData);
                console.log(queryData)

                for (let loopDatum = 0; loopDatum < queryData.length; loopDatum++) {
                    console.log(queryData[loopDatum].datum)
                }

                //loop through dates
                for (let dag = 0; dag < data[nummer].epochValues.length; dag++) {

                    //get datum
                    datum = data[nummer].epochValues[dag].date
                    console.log("   datum: " + datum)

                    if (datums.indexOf(datum) == -1) {
                        //get kwartier scores
                        //still need to get turned into binary
                        kwartierScore = data[nummer].epochValues[dag].scores
                        console.log("      kwartier: " + kwartierScore)
                        kwartierScore = hex2bin(kwartierScore)

                        //get pam score
                        pamScore = data[nummer].todayValues[dag].values[0].pam
                        console.log("      Pam: " + pamScore)

                        query.handleQuery(connectionPool, {
                                query: "INSERT INTO pam_score VALUES (0, ?, ?, ?, ?);",
                                values: [serieNummer, datum, pamScore, kwartierScore]
                            }, (data) => {
                                //just give all data back as json
                                //res.status(httpOkCode).json(data);
                            }, (err) => console.log("400")
                        );
                    }
                }
            }, (err) => res.status(400).json({reason: err})
        );


    }
})

//converts hexadecimal to binary
//copied from: https://stackoverflow.com/questions/45053624/convert-hex-to-binary-in-javascript
function hex2bin(hex){
    return ("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8);
}