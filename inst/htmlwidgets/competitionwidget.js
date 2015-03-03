HTMLWidgets.widget({

  name: 'competitionwidget',

  type: 'output',

  initialize: function(el, width, height) {

    return {"width":width,"height":height};

  },

  renderValue: function(el, x, instance) {
    /* set these */
    var margin={top: 30, right: 10, bottom: 30, left: 30};
    var sliders=[
      {"name": "r1", "text":"r1", "value": 0.2, "min": 0.1, "max": 1, "nsteps": 1000},
      {"name": "a12", "text":"a12", "value": 0.1, "min": 0.01, "max": 1, "nsteps": 1000},
      {"name": "K1", "text":"K1", "value": 100, "min": 10, "max": 200, "nsteps": 1000},
      {"name": "r2", "text":"r2", "value": 0.5, "min": 0.1, "max": 1, "nsteps": 1000},
      {"name": "a21", "text":"a21", "value": 0.1, "min": 0.01, "max": 1, "nsteps": 1000},
      {"name": "K2", "text":"K2", "value": 80, "min": 10, "max": 200, "nsteps": 1000}
      ];
    var model=mathmodels.lvcompetition;
    var states=["X1","X2"];
    var y0=[10,10];
    var t0=0,
      tf=100,
      nt=200;
    // var cols=["blue","red"];

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
      $( "#"+containerid+"-"+sliders[s].name ).on( "slidechange", {"containerid":containerid,"margin": margin,"sliders": sliders, "states": states, "times": {"t0":t0,"tf":tf,"nt":nt}, "y0":y0, "model": model}, this.update);
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
 
    var data=model(y0,[p.r1,p.a12,p.K1,p.r2,p.a21,p.K2],t0,tf,nt);

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
     var y0=ev.data.y0;
     var model=ev.data.model;

     /* Get new data */
     var p={};
     for(s=0;s<numsliders;s++){
      var slider=sliders[s];
      var sliderid=containerid+"-"+slider.name;
      var value = slider.values[$("#"+sliderid).slider( "option", "value" )];
      p[slider.name]=value;
     }
 
     var data=model(y0,[p.r1,p.a12,p.K1,p.r2,p.a21,p.K2],t0,tf,nt);

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
