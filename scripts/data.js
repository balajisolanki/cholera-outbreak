
var data = {
    street_data: [],
    deaths_age_sex_data: [],
    deaths_age_sex_data: [],
    pumps_data: [],
    street_data_reduced: [],

    load_data: async (callback) => {
        data.street_data = await d3.json("data/streets.json");
        data.pumps_data = await d3.csv("./data/pumps.csv");
        data.deaths_age_sex_data = await d3.csv("./data/deaths_age_sex.csv");
        data.deathdays_data = await d3.csv("./data/deathdays.csv");

        if (data.street_data && data.street_data.length > 0) {
            data.street_data_reduced = data.street_data.reduce((prev, curr) => prev.concat(curr), []);
            callback();
        }
    }
};