var data = [{
    "country": "United States of America",
        "region": "North America",
        "population": [
        
        [2006,300],
        [2007,303],
        [2008,306],
        [2009,309],
        [2010,312]
        
    ],
        "ecc": [
        
        [2006,333],
        [2007,336],
        [2008,326],	
        [2009,308],
        [2010,316]
        
    ],
        "gdp": [
        
        [2006,13.8],
        [2007,14.4],
        [2008,14.7],
        [2009,14.4],
        [2010,14.9]
      
    ]
}, {
    "country": "China",
        "region": "Aisa",
        "population": [
        
        [2006,1326],
        [2007,1334],
        [2008,1342],
        [2009,1351],
        [2010,1359] 
    ],
        "ecc": [
        [2006,56],
        [2007,60],
        [2008,64],
        [2009,71],
        [2010,75]

        
    ],
        "gdp": [
     
        [2006,2.71],
        [2007,3.49],
        [2008,4.52],
        [2009,4.99],
        [2010,5.93]
    ]
}];

// Define Margin
var margin = { top: 20, right: 20, bottom: 20, left: 40 },
    width = 960 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

// Define X-Y Scale
var xScale = d3.scale.linear().domain([0, 15]).range([0, width]),
    yScale = d3.scale.linear().domain([0, 400]).range([height, 0]);

// Define X-Y Axis

var xAxis = d3.svg.axis().scale(xScale).orient("bottom"),
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// Define  Color
var color = d3.scale.category10();

// Define SVG
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
   .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   
// Add X-Axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// Add Y-Axis
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

// Add X-Axis label.
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("GDP");

// Add Y-Axis label.
svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Energy Consumption Per Capita");

// Year Transition Label 
var label = svg.append("text")
    .attr("class", "year label")
    .attr("text-anchor", "end")
    .attr("y", height - 24)
    .attr("x", width)
    .text(2006);

var country = svg.append("text")
    .attr("class", "country")
    .attr("y", height - margin.bottom)
    .attr("x", margin.left)
    .text("");

// Load Data.
draw(data);

function draw(nations) {

    // Bisector - See API Reference > Core > Arrays. Look for d3.bisector
    var bisect = d3.bisector(function (d) {
        return d[0];
    }); 

    // Tooltip
    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden");
    
    // Defie Dot(cricle to represet data)
    var dot = svg.selectAll(".dot")
        .data(interpolateData(2000))
        .enter().append("circle")
        .attr("class", "dot")
        .style("fill", function (d) {
        return color(d.region);
    })
        
        .on("mouseover", function (d) {
        tooltip.html("<strong>Country:</strong> " + d.country + "<br><strong>Population:</strong> " + d.population.toLocaleString() + " million" + "<br><strong>Energy Consumption per Capita:</strong> " + d.ecc + "<br><strong>GDP:</strong> " + d.gdp);
        tooltip.attr('class', 'd3-tip');
        return tooltip.style("visibility", "visible");
    })
        .on("mousemove", function (d) {
        tooltip.html("<strong>Country:</strong> " + d.country + "<br><strong>Population:</strong> " + d.population.toLocaleString() + " million" + "<br><strong>Energy Consumption per Capita:</strong> " + d.ecc + "<br><strong>GDP:</strong> " + d.gdp);
        return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
    })
        .on("mouseout", function (d) {
        return tooltip.style("visibility", "hidden");
    });
      
    var box = label.node().getBBox();

    var overlay = svg.append("rect")
        .attr("class", "overlay")
        .attr("x", box.x)
        .attr("y", box.y)
        .attr("width", box.width)
        .attr("height", box.height);
         
    svg.transition()
        .duration(2000)
        .ease("linear")
        .tween("year", tweenYear)
        .each("end", enableInteraction);
    
    function position(dot) {
        dot.attr("cx", function (d) { return xScale(d.gdp); })
            .attr("cy", function (d) { return yScale(d.ecc); })
            .attr("r", 20)
    
    }
    
    function order(a, b) {
        return b.population - a.population;
    }
    
    function enableInteraction() {
        var yearScale = d3.scale.linear()
            .domain([2006, 2010])
            .range([box.x + 10, box.x + box.width - 10])
            .clamp(true);
        
        overlay.on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("mousemove", mousemove)
            .on("touchmove", mousemove);

        function mouseover() {
            label.classed("active", true);
        }

        function mouseout() {
            label.classed("active", false);
        }

        function mousemove() {
            displayYear(yearScale.invert(d3.mouse(this)[0]));
        }
    }

    function tweenYear() {
        var year = d3.interpolateNumber(2006, 2010);
        return function (t) {
            displayYear(year(t));
        };
    }

    function displayYear(year) {
        dot.data(interpolateData(year), function(d) { return d.country; }).call(position).sort(order);
        label.text(Math.round(year));
    }

    function interpolateData(year) {
        return nations.map(function (d) {
            return {
                country: d.country,
                region: d.region,
                population: interpolateValues(d.population, year),
                ecc: interpolateValues(d.ecc, year),
                gdp: interpolateValues(d.gdp, year)
            };
        });
    }
    
    function interpolateValues(values, year) {
        var i = bisect.left(values, year, 0, values.length - 1),
            a = values[i];
        if (i > 0) {
            var b = values[i - 1],
                t = (year - a[0]) / (b[0] - a[0]);
            return a[1] * (1 - t) + b[1] * t;
        }
        return a[1];
    }
}