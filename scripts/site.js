const ages = d3
    .scaleOrdinal()
    .domain([0, 1, 2, 3, 4, 5])
    .range(["0-10", "11-21", "21-40", "41-60", "61-80", ">80"]);

data.load_data(draw_street_map);