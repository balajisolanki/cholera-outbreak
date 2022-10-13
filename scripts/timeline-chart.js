let formatTime = d3.timeFormat("%d-%b");
let selectedDates = [];

function plotTimelineChart() {
    let YEAR = 1854;
    let deathsByDate = {};
    let deathDaysDataset = [];

    let width = shapes_utility.config.dimensions.barWidth;
    let height = shapes_utility.config.dimensions.barHeight;
    let padding = 50;

    let line_chart_svg = d3
        .select("#line-chart-svg")
        .append("svg")
        .attr("width", width)
        .attr("height", height + 30)
        .attr("viewBox", "0 0 " + width + " " + (height + 30));

    death_days = data.deathdays_data;

    death_days.forEach(element => {
        deathsByDate[element.date] = element.deaths;
        deathDaysDataset.push({
            date: new Date(element.date + '-' + YEAR),
            value: element.deaths
        });
    });

    let minDate = d3.min(deathDaysDataset, (d) => d.date);
    let maxDate = d3.max(deathDaysDataset, (d) => d.date);

    minDate.setDate(minDate.getDate());

    let xScale = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([padding, width - padding]);

    let yScale = d3.scaleLinear()
        .domain([0, (parseInt(d3.max(death_days, function (d) { return +d.deaths; }) / 20) + 1) * 20])
        .range([height - padding, padding]);

    // x-axis
    let xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%d %b"))
        // .tickSize(5, 5, 0)
        .ticks(15);

    line_chart_svg.append("g")
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

    line_chart_svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ", 0)")
        .call(yAxis);

    // Y Axis Label
    line_chart_svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "end")
        .attr("x", 10)
        .attr("y", 100)
        .text("No. of Deaths")
        .attr("transform", "translate(-85, 125) rotate(-90)");

    let line = d3.line()
        .x((d) => xScale(d.date))
        .y((d) => yScale(d.value ?? 0));


    line_chart_svg.append("path")
        .attr("d", line(deathDaysDataset))
        .attr('fill', 'none')
        .attr('stroke', 'black');

    // // plot circles
    line_chart_svg.selectAll("circle")
        .data(deathDaysDataset)
        .enter()
        .append("circle")
        .attr("class", "data-point")
        .attr("id", (d) => "__" + formatTime(d.date))
        .attr("cx", (d) => xScale(d.date))
        .attr("cy", (d) => yScale(d.value))
        .attr("fill", (d) => shapes_utility.mapLegendColorScale("deaths"))
        .attr("r", (d) => d.value == 0 ? 0 : 4)
        .on("mouseover", (event, event_data) => {
            d3.selectAll("#__" + formatTime(event_data.date))
                .attr("r", 10);

            shapes_utility.tooltip.show({
                content: "<b>Date: </b>" + formatTime(event_data.date) + "<br/>" + "<b>No of Deaths: </b>" + event_data.value,
                x: event.pageX + 20,
                y: event.pageY - 25,
                duration: 200
            });
        })
        .on("mousemove", function (event, data) {
            shapes_utility.tooltip.move({
                x: event.pageX + 20,
                y: event.pageY - 25
            });
        })
        .on("mouseout", (event, event_data) => {
            shapes_utility.tooltip.hide(500);

            d3.selectAll("#__" + formatTime(event_data.date))
                .attr("r", 4);
        })
        .on("click", (event, event_data) => {
            debugger;
            const newId = "__" + formatTime(event_data.date);
            if (!selectedDates.includes(newId)) {
                selectedDates.push(newId);
            } else {
                selectedDates.splice(selectedDates.indexOf(newId), 1);
            }

            // Change opacity
            d3.selectAll(".data-point").attr("opacity", 0.2);
            showOrHideDeaths("death-circle", "hidden");

            if (selectedDates && selectedDates.length > 0) {
                for (let ind in selectedDates) {
                    d3.select("#" + selectedDates[ind]).attr("opacity", 1);
                    showOrHideDeaths(selectedDates[ind], "visible");
                }
            } else {

                d3.selectAll(".data-point").attr("opacity", 1);
            }
        });
}

function showOrHideDeaths(clazz, visibility) {
    d3.selectAll("." + clazz).transition().duration(900).style("visibility", visibility);
}