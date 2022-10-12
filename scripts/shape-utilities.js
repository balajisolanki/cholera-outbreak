
var shapes_utility = {
    config: {
        dimensions: {
            barHeight: 300,
            barWidth: 700,
            mapHeight: 600,
            mapWidth: 600,
            pieHeight: 300,
            pieWidth: 350,
        },
        mapLabels: ["Male", "Female", "Pump", "Brewery", "Work House"]
    },

    mapLegendColorScale: (label) => {
        return d3.scaleOrdinal()
            .domain(shapes_utility.config.mapLabels)
            .range(d3.schemeCategory10)(label);
    },

    x: (x) => {
        return d3.scaleLinear()
            .domain(d3.extent(data.street_data_reduced, (d) => d.x))
            .range([0, shapes_utility.config.dimensions.mapWidth])(x);
    },

    y: (y) => {
        return d3.scaleLinear()
            .domain(d3.extent(data.street_data_reduced, (d) => d.y))
            .range([shapes_utility.config.dimensions.mapHeight, 0])(y);
    },

    line: (line_data) => {
        return d3.line()
            .x((d) => shapes_utility.x(d.x))
            .y((d) => shapes_utility.y(d.y))(line_data);
    },

    tooltip: {
        div: d3.select(".container")
            .append("div")
            .attr("class", "tooltip"),
        show: (config) => {
            shapes_utility.tooltip.div.html(config.content)
                .style("left", `${config.x}px`)
                .style("top", `${config.y}px`)
                .transition().duration(config.duration ?? 200).style("opacity", 1);
        },
        move: (config) => {
            shapes_utility.tooltip.div
                .style("left", `${config.x}px`)
                .style("top", `${config.y}px`)
        },
        hide: (duration) => {
            shapes_utility.tooltip.div.transition().duration(duration ?? 500).style("opacity", 0);
        }

    }
}
