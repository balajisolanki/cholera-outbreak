
var data = {
    streetData: [],
    deathsAgeSexData: [],
    deathDaysData: [],
    pumpsData: [],
    streetDataReduced: [],

    loadData: async (callback) => {
        data.streetData = await d3.json("data/streets.json");
        data.pumpsData = await d3.csv("data/pumps.csv");
        data.deathsAgeSexData = await d3.csv("data/deaths_age_sex.csv");
        data.deathDaysData = await d3.csv("data/deathdays.csv");

        if (data.streetData && data.streetData.length > 0) {
            data.streetDataReduced = data.streetData.reduce((prev, curr) => prev.concat(curr), []);

            let index = 0;

            if (data.deathDaysData && data.deathDaysData.length > 0) {

                data.deathDaysData.map((item) => {
                    let countOfDeaths = item.deaths;
                    while (countOfDeaths > 0 && index < data.deathsAgeSexData.length) {
                        data.deathsAgeSexData[index].date = formatTime(new Date(item.date + '-' + config.year));
                        
                        countOfDeaths--;
                        index++;
                    }
                });

                callback(data.streetData);
            }
        }
    }
};