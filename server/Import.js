const fs = require('fs');
const query = require("./utils/databaseHelper");

fs.readFile('./random_generated.json', 'utf-8', (err, data) => {
    //initialize some variables
    let serieNummer
    let datum
    let kwartierScore
    let pamScore
    let datums = new array()

    //read json file
    data = JSON.parse(data)

    //loop through each pam serial number
    for (let nummer = 0; nummer < data.length; nummer++) {
        //get serial number
        serieNummer = data[nummer].pamnr
        console.log("nummer: " + serieNummer)

        query.handleQuery(connectionPool, {
                query: "SELECT serienummer, datum FROM pam_score WHERE serienummer = ?",
                values: [serieNummer]
            }, (queryData) => {
                //just give all data back as json
                res.status(httpOkCode).json(queryData);

                for (let loopDatum = 0; loopDatum < queryData.length; loopDatum++) {
                    datums.push(data[queryData].datum)
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
                        console.log("      kwartier: " + kwartierScores)

                        //get pam score
                        pamScore = data[nummer].todayValues[dag].values[0].pam
                        console.log("      Pam: " + pamScore)

                        db.handleQuery(connectionPool, {
                                query: "INSERT INTO pam_score VALUES (0, ?, ?, ?, ?);",
                                values: [serieNummer, datum, pamScore, kwartierScore]
                            }, (data) => {
                                //just give all data back as json
                                res.status(httpOkCode).json(data);
                            }, (err) => res.status(badRequestCode).json({reason: err})
                        );
                    }
                }
            }, (err) => res.status(badRequestCode).json({reason: err})
        );


    }
})