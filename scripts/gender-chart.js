let pie = d3
    .pie()
    .value((d) => d[1].length)
    .sort(null);

let arc = d3
    .arc()
    .outerRadius(Math.min(config.dimensions.pieHeight, config.dimensions.pieWidth) / 2)
    .innerRadius(Math.min(config.dimensions.pieHeight, config.dimensions.pieWidth) / 5);

function drawGenderDonutChart(deathsAgeSexData) {
    shapesUtility.removeSvgGroup("#gender-chart-svg svg");

    let contextData = d3.group(deathsAgeSexData, (d) => +d.gender);

    let pieChartSvg = d3
        .select("#gender-chart-svg")
        .append("svg")
        .attr("width", config.dimensions.pieWidth)
        .attr("height", config.dimensions.pieHeight);

    let genderGroupContainer = pieChartSvg
        .append("g")
        .attr("class", "arcs")
        .attr("transform", `translate(${config.dimensions.pieWidth / 2}, ${config.dimensions.pieHeight / 2})`);

    genderGroupContainer
        .selectAll(".arc")
        .data(pie(contextData))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("class", "gender-arc")
        .attr("fill", (d) =>
            d.data[0] === 0
                ? shapesUtility.mapLegendColorScale("Male")
                : shapesUtility.mapLegendColorScale("Female")
        )
        .on("mouseover", (event, eventData) => {
            let hoverValue = eventData.data[0];
            d3.selectAll(".death-circle")
                .attr("opacity", (d) => (hoverValue === +d.gender ? 1 : 0));

            d3.selectAll(".gender-arc")
                .attr("opacity", (d) => +d.data[0] === hoverValue ? 1 : 0.3);

            shapesUtility.tooltip.show({
                content: `Sex: ${hoverValue === 0 ? "Male" : "Female"}
                <br/>
                Deaths: ${eventData.data[1].length}`,
                x: event.pageX - 10,
                y: event.pageY - 15,
                duration: 200
            });
        })
        .on("mousemove", function (event, eventData) {
            shapesUtility.tooltip.move({
                x: event.pageX + 10,
                y: event.pageY - 15
            });
        })
        .on("mouseout", (event, eventData) => {
            shapesUtility.tooltip.hide(500);

            d3.selectAll(".death-circle")
                .attr("opacity", 1);

            d3.selectAll(".gender-arc")
                .attr("opacity", 1);
        });

    genderGroupContainer
        .selectAll(".arc-text")
        .data(pie(contextData))
        .enter()
        .append("text")
        .attr("class", "arc-text")
        .attr("transform", (d) => `translate(${arc.centroid(d)[0]}, ${arc.centroid(d)[1] - 10})`)
        .attr("alignment-baseline", "middle")
        .text((d) => (+d.data[0] === 0 ? "Male" : "Female"));

    genderGroupContainer
        .selectAll(".arc-percentage")
        .data(pie(contextData))
        .enter()
        .append("text")
        .attr("class", "arc-percentage")
        .attr("transform", (d) => `translate(${arc.centroid(d)[0]}, ${arc.centroid(d)[1] + 10})`)
        .attr("alignment-baseline", "middle")
        .text((d) => ((d.data[1].length / deathsAgeSexData.length) * 100).toFixed(1) + '%')

}