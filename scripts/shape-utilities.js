var config = {
    year: 1850,
    dimensions: {
        lineHeight: 300,
        lineWidth: 700,
        mapHeight: 530,
        mapWidth: 530,
        pieHeight: 250,
        pieWidth: 250,
    },
    mapLabels: ["Male", "Female", "Pump", "Brewery", "Work House"]
}

var shapesUtility = {
    mapLegendColorScale: (label) => {
        return d3.scaleOrdinal()
            .domain(config.mapLabels)
            .range(d3.schemeCategory10)(label);
    },

    x: (x) => {
        return d3.scaleLinear()
            .domain(d3.extent(data.streetDataReduced, (d) => d.x))
            .range([0, config.dimensions.mapWidth])(x);
    },

    y: (y) => {
        return d3.scaleLinear()
            .domain(d3.extent(data.streetDataReduced, (d) => d.y))
            .range([config.dimensions.mapHeight, 0])(y);
    },

    line: (lineData) => {
        return d3.line()
            .x((d) => shapesUtility.x(d.x))
            .y((d) => shapesUtility.y(d.y))(lineData);
    },

    removeSvgGroup: (selector) => {
        d3.select(selector).remove();
    },

    tooltip: {
        div: d3.select(".container")
            .append("div")
            .attr("class", "tooltip"),
        show: (config) => {
            shapesUtility.tooltip.div.html(config.content)
                .style("left", `${config.x}px`)
                .style("top", `${config.y}px`)
                .transition().duration(config.duration ?? 200).style("opacity", 1);
        },
        move: (config) => {
            shapesUtility.tooltip.div
                .style("left", `${config.x}px`)
                .style("top", `${config.y}px`)
        },
        hide: (duration) => {
            shapesUtility.tooltip.div.transition().duration(duration ?? 500).style("opacity", 0);
        }
    }
}
