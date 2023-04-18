var width = 1200;
var height = 450;
var margin = { top: 40, right: 60, bottom: 60, left: 100 };

var xScale = d3.scaleLinear().range([margin.left, width - margin.right]);
var yScale = d3.scaleLinear().range([height - margin.bottom, margin.top]);

var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3.select("#line-svg")
            .attr("width", width)
            .attr("height", height);

d3.csv('.././js/monthly-cases.csv').then(function(dataset) {

  dataset.forEach(function(d) {
    d.Ordinality = +d.Ordinality;
    d.Cases = parseFloat(d.Cases.replace(/,/g, ''));
  });

  xScale.domain(d3.extent(dataset, function(d) { return d.Ordinality; }));
  yScale.domain([0, d3.max(dataset, function(d) { return d.Cases; })]);
  
  var xAxis = d3.axisBottom(xScale).tickFormat(function(d) {
    return dataset[d-1].Month; // Subtracting 1 from the ordinality to get the correct index in the dataset
  });

  svg.append("g")
      .attr("transform", "translate(0," + (height - margin.bottom) + ")")
      .call(xAxis)
      .attr("fill", "#eae9e9")
      .attr("stroke", "none");

  svg.append("g")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(d3.axisLeft(yScale).ticks(3))
      .attr("fill", "#eae9e9")
      .attr("stroke", "none");

  svg.append("text")
      .attr("class", "y-label")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 3)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("fill", "#eae9e9")
      .attr("stroke", "none")
      .attr("color", "white")
      .text("Cases");

  var line = d3.line()
               .x(function(d) { return xScale(d.Ordinality); })
               .y(function(d) { return yScale(d.Cases); });
               
  svg.append("path")
      .datum(dataset)
      .attr("class", "line")
      .attr("d", line)
      .style("stroke", "#809e71");

  
  var htmlTable = {
    3: '<h4 style="color:#2a2725"> The Trump Administration declares a nationwide emergency and issues an additional travel ban on non-U.S. citizens. </h4><audio controls><source src=".././assets/audio_1.mp3" type="audio/mpeg"></audio>',
    12: '<h4 style="color:#2a2725"> U.S. Food and Drug Administration issues an Emergency Use Authorization for Modernas COVID-19 vaccine. </h4><audio controls><source src=".././assets/audio_2.mp3" type="audio/mpeg"></audio>',
    17: '<h4 style="color:#2a2725"> Biden announces goal to administer at least one COVID-19 vaccine shot to 70% of American adults by July 4, 2021. </h4><audio controls><source src=".././assets/audio_3.mp3" type="audio/mpeg"></audio>',
    29: '<h4 style="color:#2a2725"> U.S. COVID-19 related deaths surpass 1M; Biden issues a proclamation directing that the U.S. flag be flown at half-staff. </h4><audio controls><source src=".././assets/audio_4.mp3" type="audio/mpeg"></audio>',
    39: '<h4 style="color:#2a2725"> POTUS signs into law H.J.Res. 7, which terminates the national emergency related to the COVID-19 pandemic.</h4><audio controls><source src=".././assets/audio_5.mp3" type="audio/mpeg"></audio>'
  }

  var activeCircle = null;
  
  svg.selectAll("circle")
  .data(dataset.filter(function(d) { return d.Ordinality == 3 || d.Ordinality == 12 || d.Ordinality == 17 || d.Ordinality == 29 || d.Ordinality == 39; }))
  .enter().append("circle")
    .attr("cx", function(d) { return xScale(d.Ordinality); })
    .attr("cy", function(d) { return yScale(d.Cases); })
    .attr("r", 8)
    .attr("fill", "white")
    .on("click", function() {
      var d = d3.select(this).datum();
      var ord = d.Ordinality;
      var circle = d3.select(this);
      var isGray = circle.classed("gray");
      if (activeCircle && activeCircle !== circle) {
        activeCircle.attr("fill", "white");
        activeCircle.classed("gray", false);
        d3.select(".popup").style("display", "none");
      }
      if (isGray) {
        circle.attr("fill", "white");
        circle.classed("gray", false);
      } else {
        circle.attr("fill", "#ff0000");
        circle.classed("gray", true);
      }
      var popup = d3.select(".popup");
      if (popup.style("display") === "none") {
        popup.html('<button class="close">x</button>' + htmlTable[ord])
          .style("display", "block");
        popup.select(".close").on("click", function() {
          popup.style("display", "none");
          circle.attr("fill", "white");
          circle.classed("gray", false);
        });
      } else {
        popup.style("display", "none");
      }
      if (isGray) {
        popup.style("display", "none");
      }
      activeCircle = circle;
    });


});
