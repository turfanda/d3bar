var d3;
      
var svg = d3.select("svg");
      var margin = 100;
      var width = svg.attr("width") - margin;
      var height = svg.attr("height") - margin;
      var moneyFormat = d3.format("$,.2f");


    
      var xScale = d3.scaleTime().range ([0, width]);
      var yScale = d3.scaleLinear().range ([height, 0]);
      
      var g = svg.append("g").attr("transform", "translate(" + 50+"," + 50+ ")");
      d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json",function(err,data){
        if(err)
          throw err;
        var minDate = new Date(data.data[0][0]);
        var maxDate = new Date(data.data[data.data.length-1][0]);

          var barWidth = Math.ceil(width / data.data.length);
        
        xScale.domain([minDate,maxDate]);
        yScale.domain([ 0, d3.max(data.data, function(d) { return d[1]; })]);
        
        svg.append("text")
       .attr("transform", "translate(100,0)")
       .attr("x", 100)
       .attr("y", 50)
        .attr("class", "title")
       .text("GROSS DOMESTIC PRODUCT");
        
        g.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(xScale))
        
        g.append("g")
         .call(d3.axisLeft(yScale).tickFormat(function(d){
             return "$" + d;
         }).ticks(10))
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "1em")
          .attr("text-anchor", "end")
          .attr("class","ylabel")
          .text("Gross Domestic Product, USA");
        
        
      var div = d3.select("body").append("div")
      .attr("class", "infoBox");
       
      g.selectAll(".bar")
         .data(data.data)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) { return xScale(new Date(d[0])); })
         .attr("y", function(d) { return yScale(d[1]); })
         .attr("width", barWidth)
         .attr("height", function(d) { return height - yScale(d[1]); })
         .on("mouseover", function(d) {
        var rect = d3.select(this);
        rect.attr("class", "mousein");
        var currentDateTime = new Date(d[0]);
        var year = currentDateTime.getFullYear();
        var month = currentDateTime.getMonth();
        var dollars = d[1];
        div.transition()
          .duration(50)
          .style("opacity", 0.9);
        div.html("<span class='insideInfo'>" + moneyFormat(dollars) + "&nbsp;Billion </span><br><span class='insideInfo'>" + year+ "-"+currentDateTime.toString().slice(3, 7)+"</span>")
          .style("left", (d3.event.pageX + 5) + "px")
          .style("top", (d3.event.pageY - 50) + "px");
      })
        .on("mouseout", function() {
        var rect = d3.select(this);
        rect.attr("class", "mouseout");
        div.transition()
          .duration(100)
          .style("opacity", 0);
      });
        
        d3.select(".def").append("text").text(data.description);
      });

