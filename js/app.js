let width = 800, height = 800;
var cases_data, links_data;
let svg = d3.select("svg")
    .attr("viewBox", "0 0 " + width + " " + height)

$.ajax({ 
    type: 'GET', 
    url: 'https://chi-loong.github.io/CSC3007/assignments/cases-sample.json', 
    dataType: 'json',
    success: function (data) { 
        cases_data = data;
    }
})
$.ajax({ 
    type: 'GET', 
    url: 'https://chi-loong.github.io/CSC3007/assignments/links-sample.json', 
    success: function (data) { 
        links_data = data;
        const df = [links_data, cases_data];  
        draw_network(df)
    }
})


function draw_network(df){

    let data = [];
    for (let i=0; i < 20; i++) {
        let obj = {x: width/2, y: height/2};
        obj.id = df[1][i].id
        obj.class = Math.floor(Math.random() * 2);
        obj.gender = df[1][i].gender
        data.push(obj);
    }

    let links = [];
    for (let i=0; i < 10; i++) {
        let obj = {};
        obj.source = df[0][i].infector;
        obj.target = df[0][i].infectee;
        links.push(obj);
    }
    console.log(links)
    //console.log(data)
    let node = svg.append("g")
    .attr("id", "nodes")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", 25)
    .style("fill", function(d){ 
        if (d.gender=="female"){
            return "pink"
        }else{return "steelblue"}
    })
    .on("mouseover", function(e, d){ 
        d3.select("body")
            .append("div") // the tooltip always "exists" as its own html div, even when not visible
            .style("position", "absolute") // the absolute position is necessary so that we can manually define its position later
            .style("visibility", "hidden") // hide it from default at the start so it only appears on hover
            .style("background-color", "white")
            .attr("class", "tooltip")
            .html("<h4>" + d.id + "</h4>") // add an html element with a header tag containing the name of the node.  This line is where you would add additional information like: "<h4>" + d.name + "</h4></br><p>" + d.type + "</p>"  Note the quote marks, pluses and </br>--these are necessary for javascript to put all the data and strings within quotes together properly.  Any text needs to be all one line in .html() here
            .style("visibility", "visible") // make the tooltip visible on hover
            .style("top", e.pageY + "px") // position the tooltip with its top at the same pixel location as the mouse on the screen
            .style("left", e.pageX + "px"); // position the tooltip just to the right of the mouse location
        
    }) // when the mouse hovers a node, call the tooltip_in function to create the tooltip
    .on("mouseout", function(e, d){ 
    d3.select("body")
        .append("div") // the tooltip always "exists" as its own html div, even when not visible
        .style("position", "absolute") // the absolute position is necessary so that we can manually define its position later
        .style("visibility", "hidden") // hide it from default at the start so it only appears on hover
        .style("background-color", "white")
        .attr("class", "tooltip")
        .transition()
        .duration(50) // give the hide behavior a 50 milisecond delay so that it doesn't jump around as the network moves
        .style("visibility", "hidden"); // hide the tooltip when the mouse stops hovering

    }) // when the mouse stops hovering a node, call the tooltip_out function to get rid of the tooltip
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    let simulation = d3.forceSimulation()
        .nodes(data)
        .force("x", d3.forceX().strength(0.5).x( width /2 ))
        .force("y", d3.forceY().strength(0.2).y( height /2 ))
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(20))
        .force("collide", d3.forceCollide().strength(1).radius(30))
        .on("tick", d => {
            node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
            
            linkpath
            .attr("d", d => "M" + d.source.x + "," + d.source.y + " " + d.target.x + "," + d.target.y);
        });
    
        let linkpath = svg.append("g")
        .attr("id", "links")
        .selectAll("path")
        .data(links)
      .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "black");

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
            
    function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
    }
        
    function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
    }
}
