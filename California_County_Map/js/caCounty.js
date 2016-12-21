/**********************************************************************
File: caCounty.js
**********************************************************************/

/* Define Width & Height */
var width = 980,
    height = 850;

/* Define Path */
var path = d3.geo.path().projection(null);

/* Define green color scale */ 
var colors = d3.scale.threshold().range(colorbrewer.Greens[6]);

/* Define svg */
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

/* Define Tooltip */
var tooltip = d3.select("body").append("div").attr("class", "tooltip");


/* Define legend scale */
var threshold = d3.scale.threshold()
  .domain([.1, 1, 2, 3, 4])
  .range(colorbrewer.Greens[6]);
var x = d3.scale.linear()
  .domain([-0.6, 5])
  .range([0, 400]);
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .tickSize(13)
  .tickValues(threshold.domain())
  .tickFormat(function(d) { return (1000 * d); });


/* Load County Population Data */
d3.csv("data/caPop2013.csv", function(error,data) {

  /* Set green color domain based on max, miv values of population */
  colors.domain([ 100000, 1000000, 2000000,3000000, 4000000]);
//  colors.domain([
//      d3.min(data, function(d) { return d.populationvalue * .15; }), 
//      d3.max(data, function(d) { return d.populationvalue * .15; })
//  ]);

  /* Load California TopoJSON file */
  d3.json("data/ca.json", function(error, ca) {
    
    /* Bind data from caPop2014.csv file and ca.json file */
    var counties_json = topojson.feature(ca, ca.objects.counties);
    for (var i = 0; i < data.length; i++) {
      var county_name = data[i].counties;
      var population_value = parseFloat(data[i].populationvalue);
      /* DEBUG 
      console.log(dataCounty, dataPopulation); 
      */
      for (var j = 0; j < counties_json.features.length; j++) {
        var ca_county = counties_json.features[j].properties.name;
        if (county_name == ca_county) {
          counties_json.features[j].properties.value = population_value;
          break;
        }
      }
    }
  /* Helper function to population string */  
  function populationString(d) {
    if (d < 999999) return d.toLocaleString();
    else return d.toLocaleString();    
  }
    

    /* Display data(county name, populaiton) and choropleth */
    svg.selectAll("path")
      .data(counties_json.features)
      .enter()
      .append("path")
      .attr("class", ".county-border")
      .attr("d", path)
      .style("fill", function(d) { return colors(d.properties.value); })
      /* Tooltip information */
      .on("mouseover", function(d) {   
        tooltip.transition()
        .duration(200)
        .style("opacity", .9);
        /* Tooltip will display: county name and population value */
        tooltip.html(d.properties.name + "</br>" + "Population: " + populationString(d.properties.value))	
        .style("left", (d3.event.pageX + 5) + "px")
        .style("top", (d3.event.pageY - 28) + "px");		       
      })
      .on("mouseout", function(d) {
        tooltip.transition()
        .duration(400)
        .style("opacity", 0);
      });

  /* Black boundary between each county */
    var counties_mesh = topojson.mesh(ca, ca.objects.counties);
    svg.append("path")
      .datum(counties_mesh, function(a, b) { return a !== b; })
      .attr("class", "boundary")
      .attr("d", path);

    /* Draw legend */ 
    var legend = svg.append("g")
      .attr("class", "key")
      .attr("transform", "translate(440,820)");

    legend.selectAll("rect")
      .data(threshold.range().map(function(color) {
        var d = threshold.invertExtent(color);
        if (d[0] == null) d[0] = x.domain()[0];
        if (d[1] == null) d[1] = x.domain()[1];
        return d;
      }))
    .enter().append("rect")
      .attr("height", 8)
      .attr("x", function(d) { return x(d[0]); })
      .attr("width", function(d) { return x(d[1]) - x(d[0]); })
      .style("fill", function(d) { return threshold(d[0]); });

    legend.call(xAxis).append("text")
      .attr("class", "caption")
      .attr("y", -6)
      .text("Population Scale (in Thousands)");
 
  });  /* end d3.json function */
}); /* end d3.csv function */




