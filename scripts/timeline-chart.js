let formatTime = d3.timeFormat("%d-%b");
let selectedDates = [];

function plotTimelineChart(deathDays) {
    let deathDaysDataset = [];

    let width = config.dimensions.lineWidth;
    let height = config.dimensions.lineHeight;
    let padding = 50;

    let lineChartSvg = d3
        .select("#line-chart-svg")
        .append("svg")
        .attr("width", width)
        .attr("height", height + 30)
        .attr("viewBox", "0 0 " + width + " " + (height + 30));

    deathDays.forEach(element => {
        deathDaysDataset.push({
            date: new Date(element.date + '-' + config.year),
            value: element.deaths
        });
    });

    let minDate = d3.min(deathDaysDataset, (d) => d.date);
    let maxDate = d3.max(deathDaysDataset, (d) => d.date);

    minDate.setDate(minDate.getDate());

    // Function
    let xScale = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([padding, width - padding]);

    // Function
    let yScale = d3.scaleLinear()
        .domain([0, (parseInt(d3.max(deathDays, function (d) { return +d.deaths; }) / 20) + 1) * 20])
        .range([height - padding, padding]);

    // x-axis
    let xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%d %b"))
        // .tickSize(5, 5, 0)
        .ticks(15);

    lineChartSvg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    // y-axis
    let yAxis = d3.axisLeft(yScale)
        .tickFormat((d) => d)
        .tickSize(5, 5, 0)
        .ticks(6);

    lineChartSvg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ", 0)")
        .call(yAxis);

    // Y Axis Label
    lineChartSvg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "end")
        .attr("x", 10)
        .attr("y", 100)
        .text("No. of Deaths")
        .attr("transform", "translate(-85, 125) rotate(-90)");

    let line = d3.line()
        .x((d) => xScale(d.date))
        .y((d) => yScale(d.value ?? 0));


    lineChartSvg.append("path")
        .attr("d", line(deathDaysDataset))
        .attr('fill', 'none')
        .attr('stroke', 'black');

    // // plot circles
    lineChartSvg.selectAll("circle")
        .data(deathDaysDataset)
        .enter()
        .append("circle")
        .attr("class", "data-point")
        .attr("id", (d) => "__" + formatTime(d.date))
        .attr("cx", (d) => xScale(d.date))
        .attr("cy", (d) => yScale(d.value))
        .attr("fill", (d) => shapesUtility.mapLegendColorScale("deaths"))
        .attr("r", (d) => d.value == 0 ? 0 : 4)
        .on("mouseover", (event, eventData) => {
            d3.selectAll("#__" + formatTime(eventData.date))
                .attr("r", 10);

            shapesUtility.tooltip.show({
                content: "<b>Date: </b>" + formatTime(eventData.date) + "<br/>" + "<b>No of Deaths: </b>" + eventData.value,
                x: event.pageX + 20,
                y: event.pageY - 25,
                duration: 200
            });
        })
        .on("mousemove", function (event, eventData) {
            shapesUtility.tooltip.move({
                x: event.pageX + 20,
                y: event.pageY - 25
            });
        })
        .on("mouseout", (event, eventData) => {
            shapesUtility.tooltip.hide(500);

            d3.selectAll("#__" + formatTime(eventData.date))
                .attr("r", 4);
        })
        .on("click", (event, eventData) => {
            const newId = formatTime(eventData.date);
            if (!selectedDates.includes(newId)) {
                selectedDates.push(newId);
            } else {
                selectedDates.splice(selectedDates.indexOf(newId), 1);
            }

            // Change opacity
            d3.selectAll(".data-point").attr("opacity", 0.2);

            if (selectedDates && selectedDates.length > 0) {
                for (let ind in selectedDates) {
                    d3.select("#__" + selectedDates[ind]).attr("opacity", 1);
                }
            } else {
                d3.selectAll(".data-point").attr("opacity", 1);
            }

            let newData = data.deathsAgeSexData.filter((x) => selectedDates.includes(x.date));

            if (!newData || newData.length === 0) {
                newData = data.deathsAgeSexData
            }

            plotDeaths(newData);
            drawGenderDonutChart(newData);
            drawAgeGroupDonutChart(newData);
        });

    drawGenderDonutChart(data.deathsAgeSexData);
    drawAgeGroupDonutChart(data.deathsAgeSexData)
}
