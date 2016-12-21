//some of the following code is from http://bl.ocks.org/mbostock/3885211

//Define Margin
var margin = {
        left: 80,
        right: 80,
        top: 50,
        bottom: 50
    },
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y")
    .parse,
    formatPercent = d3.format(".0%");

var x = d3.time.scale()
    .range([0, width])
    .clamp(true);

var y = d3.scale.linear()
    .domain([0, 0.4])
    .range([height, 0]);

var color = d3.scale.category20();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var area = d3.svg.area()
    .x(function(d) {
        return x(d.year);
    })
    .y0(function(d) {
        return y(d.y0);
    })
    .y1(function(d) {
        return y(d.y0 + d.y);
    })
    .interpolate('basis');

var stack = d3.layout.stack()
    .values(function(d) {
        return d.values;
    });

//global variable holding year to animate pie chart
var slider_year = '1850';

var svg = d3.select("#chart1")
    .append("svg")
    .attr("width", width + margin.left + margin.right + 200)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//svg2 is for slider
var svg2 = d3.select("#chart2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", 50)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + 0 + ")");


var svg3 = d3.select("#chart3")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + width / 3 + "," + height / 1.5 + ")");


d3.csv("immigration.csv", function(error, data) {
    color.domain(d3.keys(data[0])
        .filter(function(key) {
            return key !== "year" && key !== "Percent Foreign" &&
                key !== "Natives";
        }));

    data.forEach(function(d) {
        d.year = parseDate(d.year);
    });

    var regions = stack(color.domain()
        .map(function(name) {
            return {
                name: name,
                values: data.map(function(d) {
                    return {
                        year: d.year,
                        y: d[name] / 100
                    };
                })
            };
        }));
    x.domain(d3.extent(data, function(d) {
        return d.year;
    }));


    var browser = svg.selectAll(".browser")
        .data(regions)
        .enter()
        .append("g")
        .attr("class", "browser");

    browser.append('line')
        .attr("class", "slide")
        .attr("stroke", "black")
        .attr("stroke-width", 1);

    browser.append("path")
        .attr("class", "area")
        .attr("d", function(d) {
            return area(d.values);
        })
        .style("fill", function(d) {
            return color(d.name);
        })
        .attr("id", function(d, i) { return "path-" + i; });

    // legend text
    browser.append("text")
        .datum(function(d) {
            return {
                name: d.name,
                value: d.values[d.values.length - 1] };
        })
        .attr("transform", function(d) {
            return "translate(" + x(d.value.year) + "," + y(d.value
                .y0 + d.value.y / 2) + ")"; })
        .attr("x", 18)
        .attr("y", 4)
        .attr("font-size", ".5em")
        .style("text-anchor","start") 
        .text(function(d) { return d.name; })
        .on('mouseover', function(d, i) {
                d3.select('#path-' + i)
                    .style("opacity", 0.75)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1);
            })
        .on('mouseout', function(d, i) {
                d3.select('#path-' + i)
                    .style("opacity", 1)
                    .attr("stroke", "none");
            });

    // legend colors/squares
    browser.append('rect')
        .datum(function(d) {
            return {
                name: d.name,
                value: d.values[d.values.length - 1] };
        })
        .attr("transform", function(d) {
            return "translate(" + x(d.value.year) + "," + y(d.value
                .y0 + d.value.y / 2) + ")"; })
        .attr("x", 5)
        .attr("y", -4)
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', function(d) {
            return color(d.name);
        })
        .on('mouseover', function(d, i) {
                d3.select('#path-' + i)
                    .style("opacity", 0.75)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1);
            })
        .on('mouseout', function(d, i) {
                d3.select('#path-' + i)
                    .style("opacity", 1)
                    .attr("stroke", "none");
            });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("x", width / 2)
        .attr("y", margin.bottom - 5)
        .attr("dy", ".1em")
        .style("text-anchor", "middle");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.bottom - 15)
        .attr("dy", ".1em")
        .style("text-anchor", "middle")
        .text("Percentage of Immigrants");

    browser.append('text')
        .attr("transform", 'translate(' + (width+5) + ',' + 11 + ')')
        .style("text-anchor", "start")
        .style("fill", "#009")
        .style("font-family", "Arial")
        .style("font-size", "80%")
        .text('Event Timeline');
    
    browser.append('rect')
        .style('fill', 'black')
        .attr("transform", "translate(" + x(new Date('1930')) + "," + 0 +
            ")")
        .attr('width', 10)
        .attr('height', 10)
        .append("svg:title")
        .text(
            '1930: The Great Depression causes downturn in immigration'
        );

    browser.append("rect")
        .attr('fill', color('Eastern Asia'))
        .attr("transform", "translate(" + x(new Date('1859')) + "," + 0 +
            ")")
        .attr('width', 10)
        .attr('height', 10)
        .append("svg:title")
        .text(
            '1859: California passes law that bans all immigration from China'
        );

    browser.append("rect")
        .attr('fill', color('Europe'))
        .attr("transform", "translate(" + x(new Date('1840')) + "," + 0 +
            ")")
        .attr('width', 10)
        .attr('height', 10)
        .append("svg:title")
        .text('1840-1860: Irish potato famine, many flee Ireland');

    browser.append("rect")
        .attr('fill', color('Eastern Asia'))
        .attr("transform", "translate(" + x(new Date('1882')) + "," + 0 +
            ")")
        .attr('width', 10)
        .attr('height', 10)
        .append("svg:title")
        .text(
            '1882: Chinese Exclusion Act bans all immigration from China into California'
        );

    browser.append("rect")
        .attr('fill', color('Mexico'))
        .attr("transform", "translate(" + x(new Date('1910')) + "," + 0 +
            ")")
        .attr('width', 10)
        .attr('height', 10)
        .append("svg:title")
        .text(
            '1910-1917: Mexican revolution causes refugees to flee to the US'
        );

    browser.append("rect")
        .attr('fill', color('Eastern Asia'))
        .attr("transform", "translate(" + x(new Date('1943')) + "," + 0 +
            ")")
        .attr('width', 10)
        .attr('height', 10)
        .append("svg:title")
        .text(
            '1943: US and China ally against Japan during WWII, Chinese Exclusion Act repealed'
        );

    browser.append("rect")
        .attr('fill', 'black')
        .attr("transform", "translate(" + x(new Date('1965')) + "," + 0 +
            ")")
        .attr('width', 10)
        .attr('height', 10)
        .append("svg:title")
        .text(
            '1965: Immigration Nationality Act allows visas based on skill and family'
        );

    browser.append("rect")
        .attr('fill', color('Latin America'))
        .attr("transform", "translate(" + x(new Date('1970')) + "," + 0 +
            ")")
        .attr('width', 10)
        .attr('height', 10)
        .append("svg:title")
        .text('1970-1973: US sponsored coup in Chile');

    browser.append("rect")
        .attr('fill', color('Latin America'))
        .attr("transform", "translate(" + x(new Date('1976')) + "," + 0 +
            ")")
        .attr('width', 10)
        .attr('height', 10)
        .append("svg:title")
        .text('1976: US sponsored coup in Argentina');

    browser.append("rect")
        .attr('fill', color('Western Asia'))
        .attr("transform", "translate(" + x(new Date('1979')) + "," + 0 +
            ")")
        .attr('width', 10)
        .attr('height', 10)
        .append("svg:title")
        .text('1978-1979: Iranian revolution sparks mass exodus');

    browser.append("rect")
        .attr('fill', color('Mexico'))
        .attr("transform", "translate(" + x(new Date('1977')) + "," + 0 +
            ")")
        .attr('width', 10)
        .attr('height', 10)
        .append("svg:title")
        .text('1976: First Mexican peso crisis');

    browser.append("rect")
        .attr('fill', color('Latin America'))
        .attr("transform", "translate(" + x(new Date('1981')) + "," + 0 +
            ")")
        .attr('width', 10)
        .attr('height', 10)
        .append("svg:title")
        .text('1981-1990: US sponsored coup in Nicaragua (Iran-Contra)');

    browser.append("rect")
        .attr('fill', color('Mexico'))
        .attr("transform", "translate(" + x(new Date('1994')) + "," + 0 +
            ")")
        .attr('width', 10)
        .attr('height', 10)
        .append("svg:title")
        .text('1994: NAFTA passes, Mexican goods production declines');
});


var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([0, 0])
    .html(function(d) {
        return "<span style='font-weight:bold'>" + d.data.region 
            + ": </span>" + d.data[slider_year] + "%";
    });

svg3.call(tip);

function draw_pie() {
    //clear image so we can redraw
    //http://stackoverflow.com/questions/10784018/how-can-i-remove-or-replace-svg-content
    svg3.selectAll("*")
        .remove();

    var descriptionText = slider_year + " Immigration Background"; // pie chart description

    //Pie Chart Title with changing year
    svg3.append("text")
        .attr("x", 0)             
        .attr("y", -230)
        .attr("text-anchor", "middle")
        .style("fill", "#009")
        .style("font-family", "Verdana,Helvetica,Arial,sans-serif")
        .style("font-size", "110%")
        .style("font-weigth", "bold")
        .text(descriptionText);

    svg3.append("text")
        .attr("class", "hstnote")
        .attr("x", 0)             
        .attr("y", 230)
        .attr("text-anchor", "middle")
        .style("fill", "#009")
        .style("font-family", "Arial")
        .style("font-size", "65%");

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d[slider_year];
        });

    d3.csv("transposed_immigration.csv", function(error, data) {
        //pie chart
        var radius = height / 2;
        var arc = d3.svg.arc()
            .outerRadius(radius)
            .innerRadius(0);

        // Pie chart animation: http://bl.ocks.org/mbostock/4341574
        function tweenPie(b) {
            b.innerRadius = 0;
            var i = d3.interpolate({
                startAngle: 0,
                endAngle: 0
            }, b);
            return function(t) {
                return arc(i(t));
            };
        }

        var g = svg3.selectAll(".arc")
            .data(pie(data))
            .enter()
            .append("g");

        g.append("path")
            .on('mouseover', function(d, i) {
                tip.show(d);
                d3.select(this)
                    .style("opacity", 0.75);
                d3.select('#path-' + i)
                    .style("opacity", 0.75)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1);
            })
            .on('mouseout', function(d, i) {
                tip.hide(d);
                d3.select(this)
                    .style("opacity", 1);
                d3.select('#path-' + i)
                    .style("opacity", 1)
                    .attr("stroke", "none");
            })
            .attr("fill", function(d) {
                return color(d.data.region);
            })
            .transition()
            .ease("spring")
            .duration(1000)
            .attrTween("d", tweenPie);
    });
}

//begin slider block
var slider_x = d3.scale.linear()
    .domain([1850, 2010])
    .range([0, width])
    .clamp(true);

var brush = d3.svg.brush()
    .x(slider_x)
    .extent([0, 0])
    .on("brush", brushed);

svg2.append("g")
    .attr("transform", "translate(0," + 10 + ")")
    .attr("stroke", "#ddd")
    .call(d3.svg.axis()
        .scale(slider_x)
        .orient("bottom")
        .tickFormat(function(d) {
            return '';
        })
        .tickSize(0)
        .tickPadding(12))
    .select(".domain")
    .select(function() {
        return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr("class", "halo");

var slider = svg2.append("g")
    .attr("class", "slider")
    .call(brush);

slider.selectAll(".extent,.resize")
    .remove();

slider.select(".background")
    .attr("height", height);

var handle = slider.append("circle")
    .attr("class", "handle")
    .attr("transform", "translate(0," + 10 + ")")
    .attr("r", 9);

slider.call(brush.event)
    .transition() // gratuitous intro!
    .duration(500)
    .call(brush.extent([1970, 1970]))
    .call(brush.event);


function get_nearest_date(string) {
    //Why JS and d3 wouldn't use the same date format is beyond me
    //So let's convert a date string into millis back into a js Date type...
    var js_date = Date.parse(string);
    var years = 1000 * 60 * 60 * 24 * 365;
    var rounded_time = Math.round(js_date / years);
    //time is relative to epoch, let's change that
    rounded_time += 1970;
        //drop the ones place
    rounded_time = Math.round(rounded_time / 10) * 10;
    if (rounded_time > 2010)
        rounded_time = 2010;
    else if (rounded_time < 1850)
        rounded_time = 1850;
    return rounded_time;
}

function brushed() {
        var value = brush.extent()[0];

        if (d3.event.sourceEvent) { // not a programmatic event
            value = x.invert(d3.mouse(this)[0]);
            brush.extent([value, value]);
        }

        handle.attr("cx", x(value));
        d3.select('.slide')
            .attr("x1", x(value))
            .attr("x2", x(value))
            .attr("y1", 0)
            .attr("y2", height);
        tmp = get_nearest_date(value);
        if (tmp !== slider_year) {
            slider_year = get_nearest_date(value);
            draw_pie();
        }

        // Check each event and show history note
        if (tmp == 1850) {
            d3.select('.hstnote')
                .text('1840-1860: Irish potato famine, many flee Ireland');
        }
        if (tmp == 1860) {
            d3.select('.hstnote')
                .text('1859: California passes law that bans all immigration from China');
        }
        if (tmp == 1880) {
            d3.select('.hstnote')
                .text('1882: Chinese Exclusion Act bans all immigration from China into California');
        }
        if (tmp == 1910) {
            d3.select('.hstnote')
                .text('1910-1917: Mexican revolution causes refugees to flee to the US');
        }
        if (tmp == 1930) {
            d3.select('.hstnote')
                .text('1930: The Great Depression causes downturn in immigration');
        }
        if ((x(value)>348.73)&&(x(value)<358.73)) {
            d3.select('.hstnote')
                .text('1943: US and China ally against Japan during WWII, Chinese Exclusion Act repealed');
        }
        if ((x(value)>431.24)&&(x(value)<441.24)) {
            d3.select('.hstnote')
                .text('1965: Immigration Nationality Act allows visas based on skill and family');
        }
        if ((x(value)>449.99)&&(x(value)<459.99)) {
            d3.select('.hstnote')
                .text('1970-1973: US sponsored coup in Chile');
        }
        if ((x(value)>472.48)&&(x(value)<474.48)) {
            d3.select('.hstnote')
                .text('1976: US sponsored coup in Argentina');
        }
        if ((x(value)>476.25)&&(x(value)<486.24)) {
            d3.select('.hstnote')
                .text('1976: First Mexican peso crisis');
        }
        if ((x(value)>485.74)&&(x(value)<487.74)) {
            d3.select('.hstnote')
                .text('1978-1979: Iranian revolution sparks mass exodus');
        }
        if ((x(value)>491.25)&&(x(value)<501.24)) {
            d3.select('.hstnote')
                .text('1981-1990: US sponsored coup in Nicaragua (Iran-Contra)');
        }
        if ((x(value)>540)&&(x(value)<550)) {
            d3.select('.hstnote')
                .text('1994: NAFTA passes, Mexican goods production declines');
        }

    }
    //end slider block
