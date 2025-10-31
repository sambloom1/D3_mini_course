
const parseDate = d3.timeParse("%d/%m/%Y") //had issues with the autoType not bringing in date correctly so did this manual work around

const svg =  d3.select(".responsive-svg-container")
                .append("svg")
                .attr("viewBox", "0 0 1000 500")
                .style("border", "1px solid black") ;

d3.csv("../keswick_weather_2024.csv",d => {
    return {
        date : parseDate(d.date), // allows date column to be passed as a date rather than a string
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
    .attr("transform", `translate(${margin.left},${margin.top})`); 
                                                           


// Scales and axes //    

const firstDate = d3.min(data, d =>d.date); 
const lastDate = d3.max(data, d=> d.date);  

const xScale = d3.scaleTime() 
                 .domain([firstDate, lastDate ]) 
                 .range([0, innerWidth]);  

const yScale = d3.scaleLinear()
                .domain([0, 25]) 
                .range([innerHeight, 0] 
                );        
                
const xAxis = d3.axisBottom(xScale)  
                .tickFormat(d3.timeFormat("%b")); 
                                            

const yAxis = d3.axisLeft(yScale); 
                                  


innerChart
    .append("g")
    .attr("class", "the-x-axis")   
    .attr("transform", `translate(0,${innerHeight})`) 
    .call(xAxis); 

d3.selectAll(".the-x-axis text")  
    .attr("font-size", "12")      
    .attr("font-family", "sans-serif") 
    .attr("x", "30") 
    .attr("y", "10") 


innerChart
    .append("g")   
    .call(yAxis); 


// Plotting the circles, lines and area

innerChart 
        .selectAll("circle")  
        .data(data)  
        .join("circle") 
            .attr("cx", d=> xScale(d.date))
            .attr("cy", d=> yScale(d.avg_temp))
            .attr("r", 5)
            .attr("fill","blue");

const lineGenerator = d3.line()   
                .x(d=> xScale(d.date))
                .y(d=> yScale(d.avg_temp))
                .curve(d3.curveCatmullRom);  

innerChart
        .append("path")  
        .attr("d", lineGenerator(data)) 
        .attr("fill", "none") 
        .attr("stroke", "blue"); 


const areaGenerator = d3.area()   
            .x0(d=> xScale(d.date))  
            .y0(d=> yScale(d.min_temp)) 
            .y1(d=> yScale(d.max_temp)) 
            .curve(d3.curveCatmullRom); 

innerChart  
        .append("path") 
        .attr("d", areaGenerator(data)) 
        .attr("fill", "skyblue")
        .attr("opacity", 0.6); 




// The avergage temperature label
innerChart 
        .append("text")
        .text("average temperature")
        .attr("x", xScale(lastDate) +10)
        .attr("y", yScale(data[data.length -1].avg_temp))
        .attr("fill","blue");


// The minimum temperature text label along with the line towards it 

innerChart 
        .append("text") 
        .text("minimum temperature") 
        .attr("dominant-baseline", "hanging") 
        .attr("x", xScale(data[data.length -8].date) - 144) 
        .attr("y", yScale(data[data.length -8].min_temp) + 20) 
        .attr("fill", "blue");
innerChart
        .append("line")
        .attr("x1",xScale(data[data.length-8].date)-64)
        .attr("x2",xScale(data[data.length-8].date))
        .attr("text-anchor", "right")
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