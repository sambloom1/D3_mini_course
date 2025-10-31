
const parseDate = d3.timeParse("%d/%m/%Y") //had issues with the autoType not bringing in date correctly so did this manual work around

const svg =  d3.select(".responsive-svg-container")
                .append("svg")
                .attr("viewBox", "0 0 1000 500")
                .style("border", "1px solid black") ;

d3.csv("../keswick_weather_2024.csv",d => {
    return {
        date : parseDate(d.date),
        avg_temp: +d.avg_temp,
        min_temp: +d.min_temp,
        max_temp: +d.max_temp
    };
    }).then(data => {
        console.log("keswick temperature", data);
        console.log(d3.max(data, d => d.date));
        console.log(data);
        myLineChart(data);
    }
    );

const myLineChart = data => {

    const margin = {top: 40, bottom: 40, left:40, right:180};
    const height = 500;
    const width = 1000;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight  = height - margin.bottom - margin.top;

const innerChart = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);// needs back ticks because its a ternary operator   


// Scales and axes    

const firstDate = d3.min(data, d =>d.date); // used to create the first date on the x axis - to be called in the domain
const lastDate = d3.max(data, d=> d.date);  // used to create the last date in the axis - to be called in the domain

const xScale = d3.scaleTime() // a date - therefore scaleTime()
                 .domain([firstDate, lastDate ]) // the inputs for the range
                 .range([0, innerWidth]);  // the output of the domain with the inner width being the max

const yScale = d3.scaleLinear()
                .domain([0, 25])
                .range([innerHeight, 0] // inner height acts as the point of contact with the x axis and then we work back up the y values as 0,0 is the point of origin
                );
                
const xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.timeFormat("%b"));  // having the ticks format the first 3 letters of the month

const yAxis = d3.axisLeft(yScale); // straight forward axis for y as no need to change position with x being 0


innerChart
    .append("g")
    .attr("class", "the-x-axis")   // creating a class for the x axis which we can add onto later on with modifications
    .attr("transform", `translate(0,${innerHeight})`) //this is taking it from the default top position to the bottom
    .call(xAxis); // calling the xAxis

d3.selectAll(".the-x-axis text")  //selecting the text of the 'the-x-axis' class
    .attr("font-size", "12")       // setting the font size to 12
    .attr("font-family", "sans-serif") // setting to sans-serif -- i think this needs to be style to override the parent group
    .attr("x", "30") // could be dynmaic from book example 
    .attr("y", "10") // lowers the position of the tick labels


innerChart
    .append("g")   // adding a grouped element 
    .call(yAxis); // calling the y axis, no positional modification needed

// Plotting the circles, lines and area

innerChart 
        .selectAll("circle")   // an empty selection as circles aren't in the DOM currently
        .data(data)  // Bringing in the data for the circles
        .join("circle") // binding the data and the circles to the DOM
            .attr("cx", d=> xScale(d.date))
            .attr("cy", d=> yScale(d.avg_temp))
            .attr("r", 5)
            .attr("fill","blue");

const lineGenerator = d3.line()   // The line layout for d3, creates an annoted dataset?I think..?
                .x(d=> xScale(d.date))
                .y(d=> yScale(d.avg_temp))
                .curve(d3.curveCatmullRom);  // Changes the curve to be the curvy one rather than a straight line to each point. Different variations of this in documentation.

innerChart
        .append("path")  //Adding a path element
        .attr("d", lineGenerator(data)) //passing the data through the lineGenerator. Passing the data as an argument because its both x and y needed.
        .attr("fill", "none") // setting the fill as none to only get the line
        .attr("stroke", "blue"); 


const areaGenerator = d3.area()   // The area layount
            .x0(d=> xScale(d.date))  // The y variable is changing, x takes one position
            .y0(d=> yScale(d.min_temp)) // Lower bound of the area is minimum temp
            .y1(d=> yScale(d.max_temp)) // Upper bound of the area is the maximum temperature 
            .curve(d3.curveCatmullRom); //curvy curve

innerChart  
        .append("path")  // Adding a path element 
        .attr("d", areaGenerator(data)) // "d" attribute of the path, passing the data through the arc generator and having all data as an argument
        .attr("fill", "skyblue")
        .attr("opacity", 0.6); // setting opacity to 0.2 to give the lighter shading 



// Add on features - text of the y axis, segmenting the graph into seasons and adding lines to label the different line and area, what they are showing 

// The avergage temperature label
innerChart 
        .append("text")
        .text("average temperature")
        .attr("x", xScale(lastDate) +10) // 10 pixels added n to the right to allow for some spacing
        .attr("y", yScale(data[data.length -1].avg_temp))
        .attr("fill","blue");


// The minimum temperature text label along with the line towards it 

innerChart 
        .append("text") // adding a text element
        .text("minimum temperature") // labelling what the text will be
        .attr("dominant-baseline", "hanging") //setting it to hanging in order for it to be lower when we add the line
        .attr("x", xScale(data[data.length -8].date) - 144) // positioning 8 weeks previous from the end, with it being data column
        .attr("y", yScale(data[data.length -8].min_temp) + 20) // positioning 8 weeks previous, with it being min temp that we are ainming for 
        .attr("fill", "blue");
innerChart
        .append("line")
        .attr("x1",xScale(data[data.length-8].date)-64) // positioning the line to be 8 8 data points from the last one and subtracting 64 pixels to the left
        .attr("x2",xScale(data[data.length-8].date))
        .attr("y1",yScale(data[data.length-8].min_temp)+18)
        .attr("y2",yScale(data[data.length-8].min_temp))
        .attr("stroke", "blue");

innerChart  
        .append("text")
        .text("Maximum temperature")
        .attr("dominant-baseline", "auto")
        .attr("x", xScale(data[data.length-16].date)+60)
        .attr("y", yScale(data[data.length-16].max_temp)-50)
        .attr("fill", "blue")

innerChart
        .append("line")
        .attr("x1", xScale(data[data.length-16].date) +58 )
        .attr("x2", xScale(data[data.length-16].date))
        .attr("y1", yScale(data[data.length-16].max_temp) - 45)
        .attr("y2",yScale(data[data.length-16].max_temp))
        .attr("stroke", "blue");    

}

/*
const numberArray = [20,56,67,23,16]
const stringArray = ["cat", "dog", "zebra", "elephant"]

numberArray[0] // would be 20
stringArray[2] // would be zebra


const data = [
  { id:"1", name:"Scott", favourite_architecture:"bridge", likes_cake:"True"},
  { id:"2", name: "Sarah", favourite_architecture:"bridge", likes_cake:"False"},
  { id:"3", name: "Tom", favourite_architecture: "roads", likes_cake: "True"},
  { id:"4", name:"Flora", favourite_architecture: "railway station", likes_cake: "False"}
] ;


["Scott", "Sarah", "Tom", "Flora"]


[
  { id:"2", name: "Sarah", favourite_architecture:"bridge", likes_cake:"False"},
  { id:"4", name:"Flora", favourite_architecture: "railway station", likes_cake: "False"}
] ;
 */