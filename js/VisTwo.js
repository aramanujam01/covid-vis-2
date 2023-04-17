var width = 980;
var height = 500;
var scale = 1100;
var offset = 100;

var idxDate = {
  1: "2020-01",
  2: "2020-02",
  3: "2020-03",
  4: "2020-04",
  5: "2020-05",
  6: "2020-06",
  7: "2020-07",
  8: "2020-08",
  9: "2020-09",
  10: "2020-10",
  11: "2020-11",
  12: "2020-12",
  13: "2021-01",
  14: "2021-02",
  15: "2021-03",
  16: "2021-04",
  17: "2021-05",
  18: "2021-06",
  19: "2021-07",
  20: "2021-08",
  21: "2021-09",
  22: "2021-10",
  23: "2021-11",
  24: "2021-12",
  25: "2022-01",
  26: "2022-02",
  27: "2022-03",
  28: "2022-04",
  29: "2022-05",
  30: "2022-06",
  31: "2022-07",
  32: "2022-08",
  33: "2022-09",
  34: "2022-10",
  35: "2022-11",
  36: "2022-12",
  37: "2023-01",
  38: "2023-02",
  39: "2023-03"
}

var prettyMonth = [
  ['2020-01', 'Jan 2020'],
  ['2020-02', 'Feb 2020'],
  ['2020-03', 'Mar 2020'],
  ['2020-04', 'Apr 2020'],
  ['2020-05', 'May 2020'],
  ['2020-06', 'Jun 2020'],
  ['2020-07', 'Jul 2020'],
  ['2020-08', 'Aug 2020'],
  ['2020-09', 'Sep 2020'],
  ['2020-10', 'Oct 2020'],
  ['2020-11', 'Nov 2020'],
  ['2020-12', 'Dec 2020'],
  ['2021-01', 'Jan 2021'],
  ['2021-02', 'Feb 2021'],
  ['2021-03', 'Mar 2021'],
  ['2021-04', 'Apr 2021'],
  ['2021-05', 'May 2021'],
  ['2021-06', 'Jun 2021'],
  ['2021-07', 'Jul 2021'],
  ['2021-08', 'Aug 2021'],
  ['2021-09', 'Sep 2021'],
  ['2021-10', 'Oct 2021'],
  ['2021-11', 'Nov 2021'],
  ['2021-12', 'Dec 2021'],
  ['2022-01', 'Jan 2022'],
  ['2022-02', 'Feb 2022'],
  ['2022-03', 'Mar 2022'],
  ['2022-04', 'Apr 2022'],
  ['2022-05', 'May 2022'],
  ['2022-06', 'Jun 2022'],
  ['2022-07', 'Jul 2022'],
  ['2022-08', 'Aug 2022'],
  ['2022-09', 'Sep 2022'],
  ['2022-10', 'Oct 2022'],
  ['2022-11', 'Nov 2022'],
  ['2022-12', 'Dec 2022'],
  ['2023-01', 'Jan 2023'],
  ['2023-02', 'Feb 2023'],
  ['2023-03', 'Mar 2023']
];

var states = [
  ['Arizona', 'AZ'],
  ['Alabama', 'AL'],
  ['Alaska', 'AK'],
  ['Arkansas', 'AR'],
  ['California', 'CA'],
  ['Colorado', 'CO'],
  ['Connecticut', 'CT'],
  ['Delaware', 'DE'],
  ['Florida', 'FL'],
  ['Georgia', 'GA'],
  ['Hawaii', 'HI'],
  ['Idaho', 'ID'],
  ['Illinois', 'IL'],
  ['Indiana', 'IN'],
  ['Iowa', 'IA'],
  ['Kansas', 'KS'],
  ['Kentucky', 'KY'],
  ['Louisiana', 'LA'],
  ['Maine', 'ME'],
  ['Maryland', 'MD'],
  ['Massachusetts', 'MA'],
  ['Michigan', 'MI'],
  ['Minnesota', 'MN'],
  ['Mississippi', 'MS'],
  ['Missouri', 'MO'],
  ['Montana', 'MT'],
  ['Nebraska', 'NE'],
  ['Nevada', 'NV'],
  ['New Hampshire', 'NH'],
  ['New Jersey', 'NJ'],
  ['New Mexico', 'NM'],
  ['New York', 'NY'],
  ['North Carolina', 'NC'],
  ['North Dakota', 'ND'],
  ['Ohio', 'OH'],
  ['Oklahoma', 'OK'],
  ['Oregon', 'OR'],
  ['Pennsylvania', 'PA'],
  ['Rhode Island', 'RI'],
  ['South Carolina', 'SC'],
  ['South Dakota', 'SD'],
  ['Tennessee', 'TN'],
  ['Texas', 'TX'],
  ['Utah', 'UT'],
  ['Vermont', 'VT'],
  ['Virginia', 'VA'],
  ['Washington', 'WA'],
  ['West Virginia', 'WV'],
  ['Wisconsin', 'WI'],
  ['Wyoming', 'WY'],
];

var statesDict = {};
states.forEach(function(state) {
    statesDict[state[1]] = state[0];
});

var projection = d3.geoAlbersUsa()
  .scale(scale)
  .translate([width / 2 - offset, height / 2]);

var path = d3.geoPath().projection(projection);

var svg = d3.select("#map-svg")
    .attr("width", width)
    .attr("height", height);

var legend = d3.select("#legend");

d3.json('.././js/us.json').then(function(geojson) {

  d3.csv('.././js/monthly-cases-state.csv').then(function(dataset) {

    function formatCompactNumber(number) {
      if (number < 1000) {
        return number;
      } else if (number >= 1000 && number < 1_000_000) {
        return (number / 1000).toFixed(1).replace(/\.0$/, "") + "K";
      } else if (number >= 1_000_000 && number < 1_000_000_000) {
        return (number / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
      } else if (number >= 1_000_000_000 && number < 1_000_000_000_000) {
        return (number / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
      } else if (number >= 1_000_000_000_000 && number < 1_000_000_000_000_000) {
        return (number / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "") + "T";
      }
    }

    dataset.forEach(function(d) {
      d.Cases = parseFloat(d.Cases.replace(/,/g, ''));
    });

    var currMonth = '2020-01';

    function updateMap() {

      svg.selectAll("path").remove();
      legend.selectAll("text").remove();

      var filteredData = dataset.filter(function(d) {
        return d.Month === currMonth && d.State !== "(Other)";
      });

      filteredData.forEach(function(d) {
        d.State = statesDict[d.State];
      });

      var caseCounts = {};
      filteredData.forEach(function(d) {
        caseCounts[d.State] = +d.Cases;
      });

      var colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, d3.max(Object.values(caseCounts))]);
  
      svg.selectAll("path")
          .data(geojson.features)
          .enter().append("path")
          .attr("d", path)
          .style("fill", function(d) {
            var drawState = d.properties.NAME;
            var cases = caseCounts[drawState];
            if (! cases ) {
              return "gray";
            }
            return colorScale(cases);
          })
          .style("stroke", "black")  // set the stroke color to black
          .style("stroke-width", "4")  // set the stroke width to 1px
          .on("mousemove", function(d) {
            console.log(this.__data__)
            var stateName = this.__data__.properties.NAME;
            var cases = caseCounts[stateName];
            d3.select("#tooltip")
              .style("left", (d.clientX + 30) + "px")
              .style("top", (d.screenY - 250) + "px")
              .style("display", "block")
              .html("<p style='font-weight:bold'>" + stateName + "</p><p>" + cases + " Cases</p>");
          })
          .on("mouseout", function(d) {
            // Hide the tooltip
            d3.select("#tooltip")
              .style("display", "none");
          });

      var legendGroup = legend.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(10,10)");

      legendGroup.append("text")
      .attr("class", "legend-title")
      .attr("x", 25)
      .attr("y", 20)
      .attr("fill", "white")
      .text(function(d) {
        for (let i = 0; i < prettyMonth.length; i++) {
          let q = prettyMonth[i];
          if (q[0] === currMonth) {
            return q[1];
          }
        }

      });

      var rectColors = {
        0: {'gray': 'N/A'}, 
        1: {'rgb(247, 251, 255)': formatCompactNumber(d3.min(Object.values(caseCounts)))},
        2: {'rgb(128,150,181)': formatCompactNumber(parseInt(d3.mean(Object.values(caseCounts))))},
        3: {'rgb(8,48,107)': formatCompactNumber(d3.max(Object.values(caseCounts)))}
      }

      legendGroup.selectAll("rect")
        .data(Object.values(rectColors))
        .enter()
        .append("rect")
        .attr("class", "legend-rect")
        .attr("x", 0)
        .attr("y", function(d, i) { return 40 + i * 55 + 10; })
        .attr("width", 60)
        .attr("height", 40)
        .style("fill", function(d) { 
          return Object.keys(d)[0]; 
        })
        .style("stroke", "black")
        .style("stroke-width", 4);
      
      legendGroup.selectAll("text")
        .data(Object.values(rectColors))
        .enter()
        .append("text")
        .attr("class", "legend-label")
        .attr("x", 70)
        .attr("y", function(d, i) { return 70 + i * 55 + 5; })
        .text(function(d) { 
          return ' ~ ' + Object.values(d)[0]; 
        });

      legendGroup.append("text")
        .attr("class", "legend-label")
        .attr("x", 70)
        .attr("y", function() { return 75; })
        .text(" N/A");
    

    }

    updateMap();

    function handleChange() {
      // Disable slider
      d3.select("#month-slider").property("disabled", true);
      d3.select("#loader").style("display", "block");
    
      var idx = d3.select("#month-slider").property("value");
      currMonth = idxDate[idx];
    
      // Wait for 1 second
      setTimeout(function() {
        // Enable slider
        d3.select("#month-slider").property("disabled", false);
        d3.select("#loader").style("display", "none");
        // Call updateMap()
        updateMap();
      }, 1500);
    }

    d3.select("#month-slider").on("change", handleChange);
  });
});
