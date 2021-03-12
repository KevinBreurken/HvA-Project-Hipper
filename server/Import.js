let data = require("./random_generated.json")
let fs = require('fs');

fs.readFile('./random_generated.json', 'utf-8', (err,data) => {
    data = JSON.parse(data)

    //loop through each pam serial number
    for (let nummer = 0; nummer < data.length; nummer++) {
        //display serial number
        console.log(data[nummer].pamnr)

        for (let dag = 0; dag < data[nummer].epochValues.length; dag++) {
            console.log(" " + data[nummer].epochValues[dag].date)
            console.log("  " + data[nummer].epochValues[dag].scores)
            console.log("  " + data[nummer].todayValues[dag].values[0].pam)
        }
    }

})