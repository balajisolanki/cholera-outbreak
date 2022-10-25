function drawAgeGroupDonutChart(deathsAgeSexData) {
    shapesUtility.removeSvgGroup("#age-group-chart-svg svg");
    let contextData = d3.sort(d3.group(deathsAgeSexData, (d) => +d.age), (d) => d[0]);

    let barChartSvg = d3
        .select("#age-group-chart-svg")
        .append("svg")
        .attr("width", config.dimensions.pieWidth)
        .attr("height", config.dimensions.pieHeight);

    let donutColorScale = (label) => {
        return d3.scaleOrdinal()
            .domain(["0-10", "11-21", "21-40", "41-60", "61-80", "80+"])
            .range(d3.schemeCategory10)(label);
    }

    let ageGroupContainer = barChartSvg
        .append("g")
        .attr("class", "arcs")
        .attr("transform", `translate(${config.dimensions.pieWidth / 2}, ${config.dimensions.pieHeight / 2})`);

    ageGroupContainer
        .selectAll(".arc")
        .data(pie(contextData))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("class", "age-arc")
        .attr("fill", (d) => donutColorScale(ages(d.data[0])))
        .on("mouseover", (event, eventData) => {
            let hoverValue = eventData.data[0];

            d3.selectAll(".death-circle")
                .attr("opacity", (d) => hoverValue === +d.age ? 1 : 0);

            d3.selectAll(".age-arc")
                .attr("opacity", (d) => +d.data[0] === hoverValue ? 1 : 0.3);

            shapesUtility.tooltip.show({
                content: `Age Group: ${ages(+hoverValue)}
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

            d3.selectAll(".age-arc")
                .attr("opacity", 1);
        });

    ageGroupContainer
        .selectAll(".arc-text")
        .data(pie(contextData))
        .enter()
        .append("text")
        .attr("class", "arc-text")
        .attr("transform", (d) => `translate(${arc.centroid(d)[0]}, ${arc.centroid(d)[1] - 10})`)
        .attr("alignment-baseline", "middle")
        .text((d) => `${ages(+d.data[0])}`);

    ageGroupContainer
        .selectAll(".arc-percentage")
        .data(pie(contextData))
        .enter()
        .append("text")
        .attr("class", "arc-percentage")
        .attr("transform", (d) => `translate(${arc.centroid(d)[0]}, ${arc.centroid(d)[1] + 10})`)
        .attr("alignment-baseline", "middle")
        .text((d) => ((d.data[1].length / deathsAgeSexData.length) * 100).toFixed(1) + '%')

}