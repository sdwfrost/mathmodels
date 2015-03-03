HTMLWidgets.widget({

  name: 'hysteresiswidget',

  type: 'output',

  initialize: function(el, width, height) {

    return {"width":width,"height":height};

  },

  renderValue: function(el, x, instance) {
    /* set these */
    var margin={top: 30, right: 10, bottom: 30, left: 30};
    var sliders=[
      {"name": "a", "text":"a", "value": 1.0, "min": 0.1, "max": 3, "nsteps": 1000},
      {"name": "b", "text":"b", "value": 0.1, "min": 0.01, "max": 1, "nsteps": 1000},
      {"name": "r", "text":"r", "value": 3, "min": 0, "max": 5, "nsteps": 1000},
      {"name": "p", "text":"p", "value": 8, "min": 1, "max": 10, "nsteps": 1000},
      {"name": "h", "text":"h", "value": 17, "min": 1, "max": 20, "nsteps": 1000},
      {"name": "x0", "text":"x0", "value": 1, "min": 1, "max": 20, "nsteps": 1000}
      ];
    var model=mathmodels.hysteresis;
    var states=["x"];
  
    var t0=0,
      tf=500,
      nt=1000;

    /* initialisation */

    var containerid=el.id;
    var dashboardid=containerid+"-dashboard";
    var modelid=containerid+"-model";
    var width=instance.width;
    var height=instance.height;
    
    var dashboard=d3.select(el)
      .append("div")
      .attr("class","row")
      .attr("id",dashboardid);
    
    var numstates=states.length;

    var numsliders=sliders.length;
    for(s=0;s<numsliders;s++){
      var slider=sliders[s];
      var sliderid=containerid+"-"+slider.name;
      d3.select("#"+dashboardid)
        .append("div")
        .attr("class","ui-widget ui-corner-all")
        .append("span")
        .text(slider.text)
        .append("div")
        .attr("id",sliderid)
        .style("float","right")
        .style("width","95%");
      slider["values"]=Array.apply(0, Array(slider.nsteps+1)).map(function(e,i) { return slider.min+i*(slider.max-slider.min)/slider.nsteps;});
      $("#"+sliderid).slider({value: this.closestindex(slider.values,slider.value), max:slider.nsteps+1}).slider("float",{labels: slider.values});
      sliders[s]=slider;
    }

     /* Event handlers */
    for(s=0;s<numsliders;s++){
      $( "#"+containerid+"-"+sliders[s].name ).on( "slidechange", {"containerid":containerid,"margin": margin,"sliders": sliders, "states": states, "times": {"t0":t0,"tf":tf,"nt":nt}, "model": model}, this.update);
    }

    d3.select(el).append("br");

    /* Initial plot */
    var p={};
    for(s=0;s<numsliders;s++){
      var slider=sliders[s];
      var sliderid=containerid+"-"+slider.name;
      var value = slider.values[$("#"+sliderid).slider( "option", "value" )];
      p[slider.name]=value;
    }

    var data=model([p.x0],[p.a,p.b,p.r,p.p,p.h],t0,tf,nt);
    console.log(data);
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

     // Define the lines
     var ylines={};
     for(i=0;i<numstates;i++){
       var yline = d3.svg.line()
         .x(function(d) { return x(d.t); })
         .y(function(d) { return y(d[states[i]]); });
       ylines[states[i]]=yline;
      }

     // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.t; }));
    y.domain([0, d3.max(data, function(d) {
      var arr=[];
      for(i=0;i<numstates;i++){
        arr.push(d[states[i]]);
      }
      return Math.max.apply(Math,arr); })]);

    // Add the populations
    for(i=0;i<numstates;i++){
      svg.append("path")
        .attr("class", "yline"+i)
        .attr("d", ylines[states[i]](data));
    }

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

  },

  resize: function(el, width, height, instance) {
  },

  update: function(ev,ui){
 
     var containerid=ev.data.containerid;
     var modelid=containerid+"-model";
     var margin=ev.data.margin;
     var sliders=ev.data.sliders;
     var numsliders=sliders.length;
     var states=ev.data.states;
     var numstates=states.length;
     var t0=ev.data.times.t0;
     var tf=ev.data.times.tf;
     var nt=ev.data.times.nt;
     var model=ev.data.model;

     /* Get new data */
     var p={};
     for(s=0;s<numsliders;s++){
      var slider=sliders[s];
      var sliderid=containerid+"-"+slider.name;
      var value = slider.values[$("#"+sliderid).slider( "option", "value" )];
      p[slider.name]=value;
     }
 
     var data=model([p.x0],[p.a,p.b,p.r,p.p,p.h],t0,tf,nt);

     var svg = d3.select("#"+modelid);
     var margin=ev.data.margin;
     var w=svg.attr("width")-margin.left-margin.right;
     var h=svg.attr("height")-margin.top-margin.bottom;

    // Set the ranges
     var x = d3.scale.linear().range([0, w]);
     var y = d3.scale.linear().range([h, 0]);

      // Define the" axes
     var xAxis = d3.svg.axis().scale(x)
       .orient("bottom").ticks(5);

     var yAxis = d3.svg.axis().scale(y)
       .orient("left").ticks(5);

   
     // Define the lines
     var ylines={};
     for(i=0;i<numstates;i++){
       var yline = d3.svg.line()
         .x(function(d) { return x(d.t); })
         .y(function(d) { return y(d[states[i]]); });
       ylines[states[i]]=yline;
      }

     // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.t; }));
    y.domain([0, d3.max(data, function(d) {
      var arr=[];
      for(i=0;i<numstates;i++){
        arr.push(d[states[i]]);
      }
      return Math.max.apply(Math,arr); })]);

    // Select the section we want to apply our changes to
    var svg = svg.transition();
   
    // Make the changes
    for(i=0;i<numstates;i++){
        svg.select(".yline"+i)   // change the line
            .duration(750)
            .attr("d", ylines[states[i]](data));
    }
        svg.select(".x.axis") // change the x axis
            .duration(750)
            .call(xAxis);
        svg.select(".y.axis") // change the y axis
            .duration(750)
            .call(yAxis);
  },

  closestindex: function(a, x) {
    var lo = -1, hi = a.length;
    while (hi - lo > 1) {
        var mid = Math.round((lo + hi)/2);
        if (a[mid] <= x) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    if (a[lo] == x) hi = lo;
    return lo;
  }

});
