var width = 980;
var height = 600;
var margin = 10;
var circleRadius = 8;
var numCols = 25;
var numRows = 10;
var numCircles = numCols * numRows;

var svg = d3.select("#person-svg")
    .attr("width", width)
    .attr("height", height);

var xScale = d3.scaleLinear()
    .domain([0, numCols - 1])
    .range([margin, 870 - margin]);

var yScale = d3.scaleLinear()
    .domain([0, numRows - 1])
    .range([margin, 470 - margin]);

d3.csv('.././js/cofactor-cases.csv').then(function(dataset) {

  var race = 'Asian';
  var sex = 'Male';
  var ageGroup = '0 - 17 years';

  function updateCircles() {

    svg.selectAll("circle").remove();

    console.log(race, sex, ageGroup);

    var row = dataset.find(function(d) {
      return d.Sex === sex && d.Race === race && d.Age === ageGroup;
    });

    var hospital = parseInt(row.Hospitilization * 250);

    console.log(hospital);

    var circles = svg.selectAll("circle")
      .data(d3.range(numCircles))
      .enter()
      .append("circle")
      .attr("cx", function(d) { return xScale(d % numCols); })
      .attr("cy", function(d) { return yScale(Math.floor(d / numCols)); })
      .attr("r", circleRadius)
      .attr("fill", function(d, i) {
        if (i < hospital) {
          return "red";
        } else {
          return "gray";
        }
      });

  }

  updateCircles();

  function handleChange() {
    race = d3.select('#race').property("value");
    sex = d3.select('#sex').property("value");
    ageGroup = d3.select('#age').property("value")
    console.log(race, sex, ageGroup);
    updateCircles();
  }

  d3.select("#sex-toggle").on("change", handleChange);
  d3.select("#race-toggle").on("change", handleChange);
  d3.select("#age-toggle").on("change", handleChange);


});
