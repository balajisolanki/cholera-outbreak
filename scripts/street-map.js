const zoomInCircle = (event, eventData) =>
    d3.selectAll(`.${eventData.replaceAll(' ', '-').toLowerCase()}-circle`)
        .attr('r', 10);

const zoomOutCircle = (event, eventData) =>
    d3.selectAll(`.${eventData.replaceAll(' ', '-').toLowerCase()}-circle`)
        .attr('r', 8);

const drawStreetMap = (streetData) => {
    let streetMapSvg = d3
        .select("#street-map-svg")
        .append("svg")
        .attr("width", config.dimensions.mapWidth)
        .attr("height", config.dimensions.mapHeight + 30);

    let mapContainer = streetMapSvg
        .append("g")
        .attr("class", "map-container")
        .attr("transform", "translate(0, 30)");

    streetData.forEach((street) => {
        mapContainer
            .append("path")
            .attr("d", shapesUtility.line(street))
            .attr("stroke", "#aaa")
            .attr("stroke-width", 2)
            .attr("fill", "none");
    });

    mapContainer
        .append("circle")
        .attr("class", "work-house-circle")
        .attr("cx", 3.5 * (config.dimensions.mapWidth / 7))
        .attr("cy", 2.3 * (config.dimensions.mapHeight / 7))
        .attr("r", 8)
        .attr("fill", (d) => shapesUtility.mapLegendColorScale("Work House"))
        .on("mouseover", function (event, eventData) {
            shapesUtility.tooltip.show({
                content: 'Work House',
                x: event.pageX + 20,
                y: event.pageY - 10,
                duration: 200
            });
        })
        .on("mousemove", function (event, data) {
            shapesUtility.tooltip.move({
                x: event.pageX + 20,
                y: event.pageY - 10
            });
        })
        .on("mouseout", function (event) {
            shapesUtility.tooltip.hide(500);
        });;

    mapContainer
        .append("circle")
        .attr("class", "brewery-circle")
        .attr("cx", 4.45 * (config.dimensions.mapWidth / 7))
        .attr("cy", 3.1 * (config.dimensions.mapHeight / 7))
        .attr("r", 8)
        .attr("fill", (d) => shapesUtility.mapLegendColorScale("Brewery"))
        .on("mouseover", function (event, eventData) {
            shapesUtility.tooltip.show({
                content: 'Brewery',
                x: event.pageX + 20,
                y: event.pageY - 10,
                duration: 200
            });
        })
        .on("mousemove", function (event, data) {
            shapesUtility.tooltip.move({
                x: event.pageX + 20,
                y: event.pageY - 10
            });
        })
        .on("mouseout", function (event) {
            shapesUtility.tooltip.hide(500);
        });

    const mapLegend = streetMapSvg
        .append("g")
        .attr("id", "map-lenend-group")
        .attr("class", "map-legend")
        .attr("transform", "translate(10, 10)");

    mapLegend
        .selectAll("circle")
        .data(config.mapLabels)
        .enter()
        .append("circle")
        .attr('class', 'legend-circle')
        .attr("cx", (d, i) => i * (config.dimensions.mapWidth / config.mapLabels.length))
        .attr("cy", 0)
        .attr("r", 6)
        .attr("fill", (d) => shapesUtility.mapLegendColorScale(d))
        .on("mouseover", zoomInCircle)
        .on("mousemove", zoomInCircle)
        .on("mouseout", zoomOutCircle);

    mapLegend
        .selectAll("text")
        .data(config.mapLabels)
        .enter()
        .append("text")
        .attr("x", (d, i) => 15 + i * (config.dimensions.mapWidth / config.mapLabels.length))
        .attr("y", 0)
        .attr("dy", "0.35em")
        .text((d) => d)
        .on("mouseover", zoomInCircle)
        .on("mousemove", zoomInCircle)
        .on("mouseout", zoomOutCircle);

    let streets = [
        { name: 'Broad Street', x: 3.8, y: 3.25, angle: -28 },
        { name: 'Oxford Street', x: 2.8, y: 1.15, angle: -12 },
        { name: 'Regent Street', x: 1.78, y: 3.8, angle: 62 },
        { name: 'Dean Street', x: 5.84, y: 2.5, angle: 67 },
    ];

    mapLegend
        .selectAll(".streets")
        .data(streets)
        .enter()
        .append("text")
        .attr('class', 'street')
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("transform", (d) => `translate(${d.x * (config.dimensions.mapWidth / 7)}, ${d.y * (config.dimensions.mapHeight / 7)}) rotate(${d.angle})`)
        .text((d) => d.name);

    plotPumps(data.pumpsData);
}

const plotPumps = (pumpsData) => {
    shapesUtility.removeSvgGroup("#street-map-svg .map-container #pump-circle-group");

    mapContainer = d3.select("#street-map-svg")
        .select(".map-container")

    const pumpsGroup = mapContainer
        .append("g")
        .attr("id", "pump-circle-group")
        .selectAll(".pump-circle")
        .data(pumpsData);

    pumpsGroup
        .enter()
        .append("circle")
        .attr("class", "pump-circle")
        .attr("cx", (d) => shapesUtility.x(d.x))
        .attr("cy", (d) => shapesUtility.y(d.y))
        .attr("r", 6)
        .attr("fill", (d) => shapesUtility.mapLegendColorScale("Pump"));

    plotDeaths(data.deathsAgeSexData, true);
}

const plotDeaths = (deathsData, replotTimelineChart) => {
    shapesUtility.removeSvgGroup("#street-map-svg .map-container #death-circle-group");

    const deathsGroup = d3
        .select("#street-map-svg")
        .select(".map-container")
        .append("g")
        .attr("id", "death-circle-group")
        .selectAll(".death-circle")
        .data(deathsData);

    deathsGroup
        .enter()
        .append("circle")
        .attr("class", "death-circle")
        .attr("cx", (d) => shapesUtility.x(d.x))
        .attr("cy", (d) => shapesUtility.y(d.y))
        .attr("r", 4)
        .attr("fill", (d) =>
            +d.gender === 0
                ? shapesUtility.mapLegendColorScale("Male")
                : shapesUtility.mapLegendColorScale("Female")
        )
        .style("cursor", "pointer")
        .on("mouseover", function (event, eventData) {
            shapesUtility.tooltip.show({
                content: `Age: ${ages(eventData.age)}<br/>Sex: ${eventData.gender === "0" ? "Male" : "Female"}<br/>Death: ${eventData.date}`,
                x: event.pageX + 20,
                y: event.pageY - 10,
                duration: 200
            });
        })
        .on("mousemove", function (event, data) {
            shapesUtility.tooltip.move({
                x: event.pageX + 20,
                y: event.pageY - 10
            });
        })
        .on("mouseout", function (event) {
            shapesUtility.tooltip.hide(500);
        });

    if (replotTimelineChart) {
        plotTimelineChart(data.deathDaysData);
    }
}
