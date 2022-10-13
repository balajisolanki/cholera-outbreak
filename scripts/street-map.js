const draw_street_map = () => {
    let street_map_svg = d3
        .select("#street-map-svg")
        .append("svg")
        .attr("width", shapes_utility.config.dimensions.mapWidth)
        .attr("height", shapes_utility.config.dimensions.mapHeight + 30);

    let mapContainer = street_map_svg
        .append("g")
        .attr("class", "map-container")
        .attr("transform", "translate(0, 30)");

    data.street_data.forEach((street) => {
        mapContainer
            .append("path")
            .attr("d", shapes_utility.line(street))
            .attr("stroke", "#aaa")
            .attr("stroke-width", 2)
            .attr("fill", "none");
    });

    mapContainer
        .append("circle")
        .attr("class", "work-house-circle")
        .attr("cx", 3.5 * (shapes_utility.config.dimensions.mapWidth / 7))
        .attr("cy", 2.3 * (shapes_utility.config.dimensions.mapHeight / 7))
        .attr("r", "8px")
        .attr("fill", (d) => shapes_utility.mapLegendColorScale("Work House"))
        .on("mouseover", function (event, event_data) {
            shapes_utility.tooltip.show({
                content: 'Work House',
                x: event.pageX + 20,
                y: event.pageY - 10,
                duration: 200
            });
        })
        .on("mousemove", function (event, data) {
            shapes_utility.tooltip.move({
                x: event.pageX + 20,
                y: event.pageY - 10
            });
        })
        .on("mouseout", function (event) {
            shapes_utility.tooltip.hide(500);
        });;

    mapContainer
        .append("circle")
        .attr("class", "brewery-circle")
        .attr("cx", 4.45 * (shapes_utility.config.dimensions.mapWidth / 7))
        .attr("cy", 3.1 * (shapes_utility.config.dimensions.mapHeight / 7))
        .attr("r", "8px")
        .attr("fill", (d) => shapes_utility.mapLegendColorScale("Brewery"))
        .attr("stroke", "none")
        .on("mouseover", function (event, event_data) {
            shapes_utility.tooltip.show({
                content: 'Brewery',
                x: event.pageX + 20,
                y: event.pageY - 10,
                duration: 200
            });
        })
        .on("mousemove", function (event, data) {
            shapes_utility.tooltip.move({
                x: event.pageX + 20,
                y: event.pageY - 10
            });
        })
        .on("mouseout", function (event) {
            shapes_utility.tooltip.hide(500);
        });

    const mapLegend = street_map_svg
        .append("g")
        .attr("class", "map-legend")
        .attr("transform", "translate(10, 10)");

    mapLegend
        .selectAll("circle")
        .data(shapes_utility.config.mapLabels)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => i * (shapes_utility.config.dimensions.mapWidth / shapes_utility.config.mapLabels.length))
        .attr("cy", 0)
        .attr("r", 6)
        .attr("fill", (d) => shapes_utility.mapLegendColorScale(d));

    mapLegend
        .selectAll("text")
        .data(shapes_utility.config.mapLabels)
        .enter()
        .append("text")
        .attr("x", (d, i) => 15 + i * (shapes_utility.config.dimensions.mapWidth / shapes_utility.config.mapLabels.length))
        .attr("y", 0)
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .text((d) => d);

    plot_pumps(mapContainer);
}

const plot_pumps = (mapContainer) => {
    const pump = mapContainer
        .append("g")
        .selectAll(".pump-circle")
        .data(data.pumps_data);

    pump
        .enter()
        .append("circle")
        .attr("class", "pump-circle")
        .attr("cx", (d) => shapes_utility.x(d.x))
        .attr("cy", (d) => shapes_utility.y(d.y))
        .attr("r", 6)
        .attr("fill", (d) => shapes_utility.mapLegendColorScale("Pump"));

    plot_deaths(mapContainer);
}

const plot_deaths = (mapContainer) => {
    const death = mapContainer
        .append("g")
        .selectAll(".death-circle")
        .data(data.deaths_age_sex_data);

    death
        .enter()
        .append("circle")
        .attr("class", "death-circle")
        .attr("cx", (d) => shapes_utility.x(d.x))
        .attr("cy", (d) => shapes_utility.y(d.y))
        .attr("r", 4)
        .attr("fill", (d) =>
            +d.gender === 0
                ? shapes_utility.mapLegendColorScale("Male")
                : shapes_utility.mapLegendColorScale("Female")
        )
        .style("cursor", "pointer")
        .on("mouseover", function (event, event_data) {
            shapes_utility.tooltip.show({
                content: `Age: ${ages(event_data.age)}<br/>Sex: ${event_data.gender === "0" ? "Male" : "Female"}`,
                x: event.pageX + 20,
                y: event.pageY - 10,
                duration: 200
            });
        })
        .on("mousemove", function (event, data) {
            shapes_utility.tooltip.move({
                x: event.pageX + 20,
                y: event.pageY - 10
            });
        })
        .on("mouseout", function (event) {
            shapes_utility.tooltip.hide(500);
        });


    plotTimelineChart();

}
