function worldhappiness(){
    var filePath2015 = "2015.csv";
    var filePath2016 = "2016.csv";
    var filePath2017 = "2017.csv";
    var filePath2018 = "2018.csv";
    var filePath2019 = "2019.csv";

    Promise.all([
        d3.csv(filePath2015),
        d3.csv(filePath2016),
        d3.csv(filePath2017),
        d3.csv(filePath2018),
        d3.csv(filePath2019),
    ]).then(function(files) {
        files[0].forEach(element => {
            element.Year = '2015';
        })
        files[1].forEach(element => {
            element.Year = '2016';
        })
        files[2].forEach(element => {
            element.Year = '2017';
        })
        files[3].forEach(element => {
            element.Year = '2018';
        })
        files[4].forEach(element => {
            element.Year = '2019';
        })
        var df = new Array();
        for (let i = 0; i < files.length; i++) {
            df = df.concat(files[i])
        }
        
        plot(df);
        scatterplot(df);
        barchart(df);
        heatmap(df);
        boxplot(df);
        choropleth(df);
    });
}

var plot=function(d){
    var data = d.slice()
    console.log(data)
}

var scatterplot=function(d){
    var data = d.slice();
    var curr_var = 'Economy (GDP per Capita)';

    // scatterplot
    let width = 1000;
    let height = 750; 
    const padding = 5;
    const margins = 75;
    let svg = d3.select("#scatterplot").append("svg")
        .attr("width", width + margins)
        .attr("height", height + margins);

    // scaling
    let xScale = d3.scaleLinear()
                    .domain([0, d3.max(data, function(d){ return parseInt(d['Happiness Score']) }) + 3])
                    .range([padding + margins, width + margins - padding]);
    let yScale = d3.scaleLinear()
                    .domain([0, d3.max(data, function(d){ return parseInt(d[curr_var]) }) + 1])
                    .range([height - padding, padding + margins]);
    var years = ['2015', '2016', '2017', '2018', '2019'];
    let colors = d3.scaleOrdinal()
                    .domain(years)
                    .range(['black', 'red', '#d1c402', 'green', 'blue']);
    //graph
    svg.append('g')
        .selectAll("dot")
        .data(data).enter()
        .append("circle")
            .attr("cx", function (d) { return xScale(d['Happiness Score']); })
            .attr("cy", function (d) { return yScale(d[curr_var]); } )
            .attr("r", 2.5)
            .style('fill', function(d){ return colors(d.Year)} )
            .style('opacity', 0.7);
    
    // axis
    const xAxis = d3.axisBottom()
                    .scale(xScale)
                    .ticks(15);
    const yAxis = d3.axisLeft()
                    .scale(yScale);
    svg.append("g").call(xAxis)
        .attr("class", "xAxis")
        .attr('id', 'p1_xaxis')
        .attr("transform", `translate(${padding / 2}, ${height})`);
    svg.append("g").call(yAxis)
        .attr("class", "yAxis")
        .attr('id', 'p1_yaxis')
        .attr("transform", `translate(${margins + padding}, 0)`);
    // labels
    svg.append("text")
        .attr("class", "p1_chart_title")
        .attr('x', (width + margins) / 3)
        .attr('y', 50)
        .attr('text-align', 'center')
        .style("font-size", "20px")
        .text("Relationship Between Happiness Score and Other Variables");
    svg.append("text")
        .attr("class", "p1_xlabel")
        .attr("text-anchor", "center")
        .attr("x", (width + margins) / 2)
        .attr("y", height + margins / 1.5)
        .text("Happiness Score");
    svg.append("text")
        .attr("class", "p1_ylabel")
        .attr("text-anchor", "center")
        .attr("x", -1 * width / 2)
        .attr("y", margins / 2)
        .text(curr_var)
        .attr("transform", "rotate(-90)");

    // legend
    svg.append("circle")
        .attr("cx", width - margins)
        .attr("cy", 100)
        .attr("r", 5)
        .style("fill", "black");
    svg.append("circle")
        .attr("cx", width - margins)
        .attr("cy", 115)
        .attr("r", 5)
        .style("fill", "red");
    svg.append("circle")
        .attr("cx", width - margins)
        .attr("cy", 130)
        .attr("r", 5)
        .style("fill", "#d1c402");
    svg.append("circle")
        .attr("cx", width - margins)
        .attr("cy", 145)
        .attr("r", 5)
        .style("fill", "green");
    svg.append("circle")
        .attr("cx", width - margins)
        .attr("cy", 160)
        .attr("r", 5)
        .style("fill", "blue");
    svg.append("text")
        .attr("x", width - margins + 8)
        .attr("y", 104)
        .attr('font-size', 14)
        .text(' 2015');
    svg.append("text")
        .attr("x", width - margins + 8)
        .attr("y", 119)
        .attr('font-size', 14)
        .text(' 2016');
    svg.append("text")
        .attr("x", width - margins + 8)
        .attr("y", 134)
        .attr('font-size', 14)
        .text(' 2017');
    svg.append("text")
        .attr("x", width - margins + 8)
        .attr("y", 149)
        .attr('font-size', 14)
        .text(' 2018');
    svg.append("text")
        .attr("x", width - margins + 8)
        .attr("y", 164)
        .attr('font-size', 14)
        .text(' 2019');
    

    // radio button
    var radio = d3.selectAll('input[type="radio"]')
            .on("change", function (d) {
                curr_var = d.target.value;
                var yScale = d3.scaleLinear()
                    .domain([0, d3.max(data, function(d){ return parseInt(d[curr_var]) }) + 1])
                    .range([height - padding, padding + margins]);
                y_axis = d3.axisLeft(yScale);
                d3.select("#p1_yaxis")
                    .transition().duration(1000)
                    .call(y_axis)
                d3.selectAll("circle")
                    .data(data)
                    .transition().duration(1000)
                    .attr("cy", function (d) { return yScale(d[curr_var]); })
                d3.select('.p1_ylabel')
                    .transition().duration(1000)
                    .text(curr_var)
            })


    // checkboxes
    function checkOpacity(data, checkedYears) {
        if (checkedYears.includes(data.Year)) {
            return 1.0;
        } else {
            return 0.0;
        }
    }
    d3.selectAll('input[type="checkbox"]').on('click', function(d) {
        var checked = [];
        var boxes = d3.selectAll('input[type="checkbox"]:checked');
        boxes.each(function() {
            checked.push(this.value);
        })
        d3.selectAll("circle")
            .data(data)
            .transition().duration(500)
            .style("opacity", function (d) { return checkOpacity(d, checked) })
    })
}   
//
var barchart=function(d){
    var data = d.slice();
    var f_data = d3.flatRollup(data, v=>d3.mean(v, d=>parseFloat(d['Happiness Score'])), d=>d.Region);
    var regions = Array.from(new Set(d3.map(f_data, function(d){ return d[0] })));
    var r_colors = {
        "Western Europe": '#0072C6',
        "North America": '#ED1C24',
        "Australia and New Zealand": '#22B14C',
        "Middle East and Northern Africa": '#FF7F27',
        "Latin America and Caribbean": '#fdf113',
        "Southeastern Asia": '#A349A4',
        "Central and Eastern Europe": '#67a1e6',
        "Eastern Asia": '#F15A60',
        "Sub-Saharan Africa": '#8B4513',
        "Southern Asia": '#006400'
    };
    
    let width = 1000;
    let height = 600; 
    let margins = 150;
    let svg = d3.select("#barchart").append("svg")
        .attr("width", width + margins)
        .attr("height", height + margins);
    let xScale = d3.scaleBand()
                    .domain(regions)
                    .range([0, width])
                    .padding(0.1);
    let yScale = d3.scaleLinear()
                    .domain([0, d3.max(f_data, function(d){ return parseInt(d[1]) + 2 })])
                    .range([height, 0]);

    // bar chart
    svg.selectAll(".a1bar")
        .data(f_data).enter()
        .append("rect")
        .attr("class", "a1bar")
        .attr('fill', function(d){ return r_colors[d[0]] })
        .attr("x", function(d){ return xScale(d[0]) })
        .attr("y", function(d){ return yScale(d[1]) })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d){ return height - yScale(d[1]) })
        .attr("transform", `translate(${margins}, ${margins / 2})`)
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5);

    // axis
    const xAxis = d3.axisBottom()
                    .scale(xScale);
    const yAxis = d3.axisLeft()
                    .scale(yScale)
                    .ticks(15);
    svg.append("g")
        .attr('transform', `translate(${margins}, ${margins / 2})`)
        .attr("class","y_axis")
        .call(yAxis)
        .append("text")
        .attr('id', 'p2_yaxis')
        .attr("text-anchor", "end");
    svg.append('g')
        .attr('transform', `translate(${margins}, ${height + margins / 2})`)
        .attr('id', 'p2_xaxis')
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "0em")
        .attr("dy", ".8em")
        .attr("transform", function (d) {
            return "rotate(-10)";
        })
        .style("font-size", "12px");

    // labels
    svg.append("text")
        .attr("class", "p2_chart_title")
        .attr('x', (width + margins / 2) / 2)
        .attr('y', 50)
        .attr('text-align', 'center')
        .style("font-size", "20px")
        .text("Average Happiness Score of All Regions");
    svg.append("text")
        .attr("class", "p2_xlabel")
        .attr("text-anchor", "center")
        .attr("x", (width + margins) / 2)
        .attr("y", height + margins - 5)
        .text("Region");
    svg.append("text")
        .attr("class", "p2_ylabel")
        .attr("text-anchor", "center")
        .attr("x", -1 * width / 2)
        .attr("y", margins / 2 + 30)
        .text('Average Happiness Score')
        .attr("transform", "rotate(-90)");

    // click event
    var isDescending = false;
    const sortBars = function(){
        if (isDescending == false) {
            console.log('ascending')
            var s_data = f_data.sort(function(a, b){ return a[1]-b[1] });
            var s_regions = Array.from(new Set(d3.map(s_data, function(d){ return d[0] })));

            xScale = d3.scaleBand()
                    .domain(s_regions)
                    .range([0, width])
                    .padding(0.1);
            var x_axis = d3.axisBottom(xScale);
            d3.selectAll("#p2_xaxis")
                .transition().duration(1000)
                .call(x_axis);
            svg.selectAll('.a1bar')
                .sort((a,b)=>d3.ascending(a[1], b[1]))
                .transition("sorting")
                .duration(1000)
                .attr('x', (d) => {
                    return xScale(d[0])
                })
            isDescending = true;
        }
        else {
            console.log('descending')
            var s_data = f_data.sort(function(a, b){ return b[1]-a[1] });
            var s_regions = Array.from(new Set(d3.map(s_data, function(d){ return d[0] })));
            xScale = d3.scaleBand()
                    .domain(s_regions)
                    .range([0, width])
                    .padding(0.1);
            var x_axis = d3.axisBottom(xScale);
            d3.selectAll("#p2_xaxis")
                .transition().duration(1000)
                .call(x_axis);
            svg.selectAll('.a1bar')
                .sort((a,b)=>d3.descending(a[1], b[1]))
                .transition("sorting")
                .duration(1000)
                .attr('x', (d, i) => {
                    return xScale(d[0])
                })
            isDescending = false;
        }
    }
    // select the button
    d3.select('#sort_button')
        .on('click', function(){
            sortBars();
        });    
}
//
var heatmap=function(d){
    var data = d.slice();
    var years = ['2015', '2016', '2017', '2018', '2019'];
    var regions = Array.from(new Set(d3.map(data, function(d){ return d.Region })));
    var f_data = d3.flatRollup(data, v=>d3.mean(v, d=>d['Happiness Score']), d=>d.Year, d=>d.Region);
    
    var width = 750;
    var height = 500;
    var margins = 150;
    var svg = d3.select("#heatmap")
        .append("svg").attr("width", width + margins)
        .attr("height", height + margins)
        .append("g")
            .attr("transform", "translate(" + margins + "," + margins/2 + ")");

    // scales and axes
    var xScale = d3.scaleBand()
                    .domain(years)
                    .range([0, width])
                    .padding(0.02);
    svg.append("g")
        .style("font-size", 14)
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).tickSize(0))
        .select(".domain").remove();
    var yScale = d3.scaleBand()
                    .domain(regions)
                    .range([height, 0])
                    .padding(0.05);
    svg.append("g")
        .style("font-size", 10)
        .call(d3.axisLeft(yScale).tickSize(0))
        .select(".domain").remove();
    var colors = d3.scaleSequential()
                    .interpolator(d3.interpolateBuGn)
                    .domain(d3.extent(f_data, function(d){ return parseInt(d[2]) }));
    svg.append("text")
        .attr("class", "p3_chart_title")
        .attr('x', width / 5)
        .attr('y', -10)
        .attr('text-align', 'center')
        .style("font-size", "20px")
        .text("Average Happiness Across Regions Between 2015-2019");
    svg.append("text")
        .attr("class", "p3_ylabel")
        .attr("text-anchor", "end")
        .attr("x", -1 * width / 4)
        .attr("y", -1 * 125)
        .text("Region")
        .attr("transform", "rotate(-90)");
    svg.append("text")
        .attr("class", "p3_xlabel")
        .attr("text-anchor", "end")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .text("Year");

    // tooltip interactivity junk
    var tooltip = d3.select("#heatmap")
                    .append("div")
                    .style("opacity", 0)
                    .style('background-color', 'white')
                    .style("border", "solid")
                    .style("border-width", "1px")
                    .style("border-radius", "2px")
                    .style('padding', '4px')
                    .attr("class", "tooltip");
    var mouseover = function(d) {
        tooltip.transition().style("opacity", 1);
        d3.select(this)
            .style('stroke', 'black');
    }
    var mousemove = function(e, d) {
        tooltip
            .html("Happiness Score: " + d[2])
            .style("left", (e.pageX + 15) + "px")
            .style("top", (e.pageY - 20) + "px");
    }
    var mouseleave = function(d) {
        tooltip.transition().style("opacity", 0);
        d3.select(this)
            .style('stroke', 'none');
    }

    // boxes
    svg.append('g')
        .selectAll('rect')
        .data(f_data).enter()
        .append("rect")
            .attr("x", function(d){ return xScale(d[0]) })
            .attr("y", function(d){ return yScale(d[1]) })
            .attr("width", xScale.bandwidth() )
            .attr("height", yScale.bandwidth() )
            .style("fill", function(d){ return colors(d[2])} )
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
}
//
var boxplot=function(d){
    var data = d.slice()
    var regions = Array.from(new Set(d3.map(data, function(d){ return d.Region })));
    var r_colors = {
        "Western Europe": '#0072C6',
        "North America": '#ED1C24',
        "Australia and New Zealand": '#22B14C',
        "Middle East and Northern Africa": '#FF7F27',
        "Latin America and Caribbean": '#fdf113',
        "Southeastern Asia": '#A349A4',
        "Central and Eastern Europe": '#67a1e6',
        "Eastern Asia": '#F15A60',
        "Sub-Saharan Africa": '#8B4513',
        "Southern Asia": '#006400'
    };

    var width = 1250;
    var height = 750;
    var margins = 150;
    var padding = 20;
    var svg = d3.select("#boxplot")
        .append("svg").attr("width", width + margins)
        .attr("height", height + margins)
        .append("g")
            .attr("transform", "translate(" + margins + "," + margins/2 + ")");

    // calculation stuff
    var calcs = new Array();
    for (let i = 0; i < regions.length; i++) {
        var f_data = data.filter(function(d){ return d.Region == regions[i] });
        calcs.push({
            'region': regions[i],
            'min': parseFloat(d3.min(f_data, function(d){ return d['Happiness Score']})),
            'max': parseFloat(d3.max(f_data, function(d){ return d['Happiness Score']})),
            'median': d3.median(f_data, function(d){ return d['Happiness Score']}),
            'q1': d3.quantile(f_data.map(function(d) { return d['Happiness Score'];}).sort(d3.ascending), 0.25),
            'q3': d3.quantile(f_data.map(function(d) { return d['Happiness Score'];}).sort(d3.ascending), 0.75)
        });
    }
                
    // scales and axes
    var xScale = d3.scaleBand()
                    .domain(regions)
                    .range([0, width])
                    .padding(0.02);
    var x_axis = d3.axisBottom()
                    .scale(xScale);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr('id', 'p4_xaxis')
        .call(x_axis)
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "0em")
            .attr("dy", ".8em")
            .attr("transform", function (d) {
                return "rotate(-10)";
            })
            .style("font-size", "11px");;
    var yScale = d3.scaleLinear()
                    .domain([d3.min(data, function(d){ return parseInt(d['Happiness Score']) }), 
                            d3.max(data, function(d){ return parseInt(d['Happiness Score']) + 1 })])
                    .range([height, 0]);
    var y_axis = d3.axisLeft()
                    .scale(yScale)
                    .ticks(15);
    svg.append("g")
        .attr('id', 'p4_yaxis')
        .attr("transform", "translate(0," + 0 + ")")
        .style("font-size", 12)
        .call(y_axis);

    // vertical lines
    var box_transform = margins / 2 - 13;
    svg.selectAll("vertLines")
        .data(calcs).enter()
        .append("line")
            .attr("x1", function(d){ return(xScale(d.region)) })
            .attr("x2", function(d){ return(xScale(d.region)) })
            .attr("y1", function(d){ return(yScale(d.min)) })
            .attr("y2", function(d){ return(yScale(d.max)) })
            .attr('transform', `translate(${box_transform}, 0)`)
            .attr("stroke", "black")
            .style("width", 40)

    // boxes
    var boxWidth = xScale.bandwidth() - padding;
    svg.selectAll("boxes")
        .data(calcs).enter()
        .append("rect")
            .attr("x", function(d){ return (xScale(d.region) - boxWidth/2) })
            .attr("y", function(d){ return (yScale(d.q3)) })
            .attr("height", function(d){ return (yScale(d.q1) - yScale(d.q3)) })
            .attr("width", boxWidth )
            .attr("stroke", "black")
            .attr('transform', `translate(${box_transform}, 0)`)
            .style("fill", function(d){ return r_colors[d.region] });

    // median line
    svg.selectAll("medianLines")
        .data(calcs).enter()
        .append("line")
            .attr("x1", function(d){ return (xScale(d.region) - boxWidth/2) })
            .attr("x2", function(d){ return (xScale(d.region) + boxWidth/2) })
            .attr("y1", function(d){ return (yScale(d.median)) })
            .attr("y2", function(d){ return (yScale(d.median)) })
            .attr('transform', `translate(${box_transform}, 0)`)
            .attr("stroke", "black")
            .style("width", 80);

    // labels
    svg.append("text")
        .attr("class", "p4_chart_title")
        .attr('x', width / 4)
        .attr('y', -10)
        .attr('text-align', 'center')
        .style("font-size", "20px")
        .text("Distribution of Happiness Across All Regions Between 2015-2019");
    svg.append("text")
        .attr("class", "p4_ylabel")
        .attr("text-anchor", "center")
        .attr("x", -1 * height / 2)
        .attr("y", -1 * margins / 2)
        .text("Happiness Score")
        .attr("transform", "rotate(-90)");
    svg.append("text")
        .attr("class", "p4_xlabel")
        .attr("text-anchor", "center")
        .attr("x", width / 2)
        .attr("y", height + 60)
        .text("Region");
}
//
var choropleth=function(d){
    var data = d.slice()
    var f_data = d3.rollup(data, v=>d3.mean(v, d=>d['Happiness Score']), d=>d.Country);
    var s_data = d3.flatRollup(data, v=>d3.mean(v, d=>d['Happiness Score']), d=>d.Country);
    var countries = Array.from(new Set(data.map(function(d){ return d.Country })));
    var replace = {
        'USA': "United States",
        'Democratic Republic of the Congo': "Congo (Kinshasa)",
        'Republic of the Congo': "Congo (Brazzaville)",
        'United Republic of Tanzania': "Tanzania",
        'Somaliland': "Somaliland Region",
        'England': "United Kingdom",
        'Republic of Serbia': 'Serbia'
    }

    var width = 1000;
    var height = 500;
    var svg = d3.select("#choropleth")
        .append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(d3.zoom()
                .scaleExtent([1, height])
                .on("zoom", function(event, d) {
                    svg.attr("transform", event.transform)
                }));
    
    // scaling
    const projection  = d3.geoNaturalEarth1()
                            .translate([width / 2, height / 2]); 
    const pathgeo = d3.geoPath().projection(projection);
    var logScale =  d3.scaleLog()
                        .domain(d3.extent(f_data, function(d){ return d[1] }));
    var color = d3.scaleSequential(d=>d3.interpolateBuGn(logScale(d)));

    // create map
    const worldmap = d3.json("world.json");
    worldmap.then(function(map) {
        svg.selectAll("path")
            .data(map.features).enter()
            .append("path").attr("d", pathgeo)
            .attr("fill", function(d){ 
                if (Object.keys(replace).includes(d.properties.name)) {
                    return color(f_data.get(replace[d.properties.name]));
                }
                if (countries.includes(d.properties.name) == false) {
                    return 'black'
                }
                else {
                    return color(f_data.get(d.properties.name));
                }
            })
            .attr('id', function(d){ return d.properties.name })
            .style("stroke", "black")
            .style("stroke-width", 0.3);
    });

    // title and legend
    var title_svg = d3.select("#choropleth_title")
                    .append("svg")
                        .attr("width", width)
                        .attr("height", 75);
    title_svg.append("text")
        .attr("class", "p5_chart_title")
        .attr('x', width / 3)
        .attr('y', 25)
        .attr('text-align', 'center')
        .style("font-size", "20px")
        .text("Average Happiness Score of Each Country");

    var legend_svg = d3.select("#choropleth_legend")
        .append("svg")
            .attr("width", width)
            .attr("height", 100);

    const colors = [color(d3.min(f_data, function(d){ return d[1] })), 
                    color(d3.quantile(s_data.map(function(d){ return d[1]}), 0.25)),
                    color(d3.median(f_data, function(d){ return d[1] })),
                    color(d3.quantile(s_data.map(function(d){ return d[1]}), 0.75)),
                    color(d3.max(f_data, function(d){ return d[1] }))];
    var gradient = legend_svg.append('defs')
                    .append('linearGradient')
                        .attr('id', 'grad')
                        .attr('x1', '0%')
                        .attr('x2', '100%')
                        .attr('y1', '0%')
                        .attr('y2', '0%');
    gradient.selectAll('stop')
        .data(colors).enter()
        .append('stop')
        .style('stop-color', function(d){ return d; })
        .attr('offset', function(d,i){
            return 100 * (i / (colors.length - 1)) + '%';
        })
    legend_svg.append('rect')
        .attr('x', 400)
        .attr('y', 25)
        .attr('width', 250)
        .attr('height', 30)
        .style('fill', 'url(#grad)')
        .style('stroke', 'black')
        .style('stroke-width', 1);
    legend_svg.append('rect')
        .attr('x', 735)
        .attr('y', 25)
        .attr('width', 30)
        .attr('height', 30)
        .style('fill', 'black');
    
    legend_svg.append('line')
        .attr('x1', 400)
        .attr('x2', 400)
        .attr('y1', 55)
        .attr('y2', 60)
        .style('stroke-width', 1)
        .style('stroke', 'black');
    legend_svg.append('line')
        .attr('x1', 525)
        .attr('x2', 525)
        .attr('y1', 55)
        .attr('y2', 60)
        .style('stroke-width', 1)
        .style('stroke', 'black');
    legend_svg.append('line')
        .attr('x1', 650)
        .attr('x2', 650)
        .attr('y1', 55)
        .attr('y2', 60)
        .style('stroke-width', 1)
    .style('stroke', 'black');
        legend_svg.append('text')
        .attr('x', 400)
        .attr('y', 20)
        .text('Happiness Score');
    legend_svg.append('text')
        .attr('x', 390)
        .attr('y', 75)
        .text('3.0');
    legend_svg.append('text')
        .attr('x', 515)
        .attr('y', 75)
        .text('5.3');
    legend_svg.append('text')
        .attr('x', 640)
        .attr('y', 75)
        .text('7.5');
    legend_svg.append('text')
        .attr('x', 725)
        .attr('y', 75)
        .text('No Data');
}
