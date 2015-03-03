HTMLWidgets.widget({

  name: 'logmapwidget',

  type: 'output',

  initialize: function(el, width, height) {

    /* ids */
    var containerid=el.id;
    var dashboardid=containerid+"-dashboard";
    var lambdasliderid=containerid+"-lambdaslider";
    var y0sliderid=containerid+"-y0slider";
    var modelid=containerid+"-model";

    var dashboard=d3.select(el)
      .append("div")
      .attr("class","row")
      .attr("id",dashboardid);

    var lambdaslider=d3.select("#"+dashboardid)
      .append("div")
      .attr("class","ui-widget ui-corner-all")
      .append("span")
      .text("\u03BB")
      .append("div")
      .attr("id",lambdasliderid)
      .style("float","right")
      .style("width","95%");

    var lambdaslidervalues = Array.apply(0, Array(301)).map(function(e,i) { return 1+i/100; });
    $("#"+lambdasliderid).slider({value:100,max:300}).slider("float",{labels: lambdaslidervalues});

    var y0slider=d3.select("#"+dashboardid)
      .append("div")
      .attr("class","ui-widget ui-corner-all")
      .append("span")
      .text("y0")
      .append("div")
      .attr("id",y0sliderid)
      .style("float","right")
      .style("width","95%");

    var y0slidervalues = Array.apply(0, Array(101)).map(function(e,i) { return i/100; });
    $("#"+y0sliderid).slider({value:1,max:100}).slider("float",{labels: y0slidervalues});

    d3.select(el).append("br");

    /* Define globals */
    model=mathmodels.logisticmap;

    return {"width":width,"height":height,"containerid":containerid};

  },

  renderValue: function(el, x, instance) {
    /* ids */
    var containerid=instance.containerid;
    var dashboardid=containerid+"-dashboard";
    var lambdasliderid=containerid+"-lambdaslider";
    var y0sliderid=containerid+"-y0slider";
    var modelid=containerid+"-model";

    /* Initial plot */
    var lambda = $("#"+lambdasliderid).slider( "option", "value" )/100+1;
    var y0 = $("#"+y0sliderid).slider( "option", "value" )/100;
    var data=model([y0],[lambda],101);

    var width=instance.width;
    var height=instance.height;
    var margin={top: 30, right: 10, bottom: 30, left: 30};
    var svg=d3.select(el)
     .append("div")
     .attr("class","row")
     .append("svg")
     .attr("width",width)
     .attr("height",height)
     .attr("id",modelid)
     .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    var w=width-margin.left-margin.right;
    var h=height-margin.top-margin.bottom;

     // Set the ranges
     var x = d3.scale.linear().range([0, w]);
     var y = d3.scale.linear().range([h, 0]);

     // Define the axes
     var xAxis = d3.svg.axis().scale(x)
       .orient("bottom").ticks(5);

     var yAxis = d3.svg.axis().scale(y)
       .orient("left").ticks(5);

     // Define the line
     var yline = d3.svg.line()
      .x(function(d) { return x(d.t); })
      .y(function(d) { return y(d.y); });

     // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.t; }));
    y.domain([0, d3.max(data, function(d) { return d.y; })]);

    // Add the population
    svg.append("path")
        .attr("class", "yline")
        .attr("d", yline(data));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
       .attr("transform", "translate(0," + h + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        //.attr("transform", "translate(0,0)")
        .call(yAxis);

      /* Event handler */
      $( "#"+lambdasliderid).on( "slidechange", {"containerid":containerid},this.update);
      $( "#"+y0sliderid).on( "slidechange", {"containerid":containerid},this.update);
  },

  resize: function(el, width, height, instance) {
  },

  update: function(ev,ui){

     /* ids */
     var containerid=ev.data.containerid;
     var dashboardid=containerid+"-dashboard";
     var lambdasliderid=containerid+"-lambdaslider";
     var y0sliderid=containerid+"-y0slider";
     var modelid=containerid+"-model";

     // Get new data
     var lambda = $("#"+lambdasliderid).slider( "option", "value" )/100+1;
     var y0 = $("#"+y0sliderid).slider( "option", "value" )/100;
     var data=model([y0],[lambda],101);

     var svg = d3.select("#"+modelid);
     var margin={top: 30, right: 10, bottom: 30, left: 30};
     var width=svg.attr("width")-margin.left-margin.right;
     var height=svg.attr("height")-margin.top-margin.bottom;

    // Set the ranges
     var x = d3.scale.linear().range([0, width]);
     var y = d3.scale.linear().range([height, 0]);

      // Define the axes
     var xAxis = d3.svg.axis().scale(x)
       .orient("bottom").ticks(5);

     var yAxis = d3.svg.axis().scale(y)
       .orient("left").ticks(5);

    // Define the line
     var yline = d3.svg.line()
      .x(function(d) { return x(d.t); })
      .y(function(d) { return y(d.y); });


    // Scale the range of the data again
    x.domain(d3.extent(data, function(d) { return d.t; }));
    y.domain([0, d3.max(data, function(d) { return d.y; })]);

    // Select the section we want to apply our changes to
    var svg = svg.transition();

    // Make the changes
        svg.select(".yline")   // change the line
            .duration(750)
            .attr("d", yline(data));
        svg.select(".x.axis") // change the x axis
            .duration(750)
            .call(xAxis);
        svg.select(".y.axis") // change the y axis
            .duration(750)
            .call(yAxis);
  }

});
