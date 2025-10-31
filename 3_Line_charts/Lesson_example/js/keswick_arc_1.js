d3.csv("../keswick_weather_2024.csv", d3.autoType).then(
    data=>
    {
        console.log("keswick_weather_2024", data),
        myArcGraph(data);
    }
);


const myArcGraph = (data) => {

    const pieChartWidth = 300 ;
    const pieChartHeight = 300 ;
    
    const svg = d3.select("#arc")
            .append("svg")
            .attr("viewBox", `0 0 ${pieChartWidth} ${pieChartHeight}`);

    const innerChart = svg
                .append("g")
                .attr("transform", `translate(${pieChartWidth/2}, ${pieChartHeight/2})`); // went wrong here with putting innerheight and width instead of piechart width

    const total_days = data.length ;
    const rainy_days = data.filter(d=>d.rainfall >0).length ; // error was here as I hadn't put length in it.
    const rainy_days_ratio = rainy_days/total_days ;
    const rainy_days_angle = rainy_days_ratio * 360 ;
    const rainy_days_rad = rainy_days_angle * Math.PI/180 ;

    const arcGenerator = d3.arc()
        .innerRadius(80) // Radius of inner circle, if it was 0 this would be a pie chart
        .outerRadius(140) // The radius of the outer circle. 140-80 gives 60 which is the thickness of the donut
        .cornerRadius(0.6) // The little smoothing of the corners, its Radius not angle
        .padAngle(0.02) ;// The space between the segments. A bit here can give some nice separation.
    
    innerChart
        .append("path")
        .attr("d", () => {  // This is tricky to work out as to why it's () and not d=>. I guess because were not passing the data row by row!
                            // The d attribute related to drawing in svg, which can easily be confused with d associated with a data object in d3
            return arcGenerator ({ // The order of these brakcets is essential.
                startAngle: 0 ,  // Due to being the start fo the circle
                endAngle: rainy_days_rad
        }); 
            })
        .attr("fill", "#19609bff");
    

    innerChart
            .append("path")
            .attr("d", ()=> {
                return arcGenerator({
                    startAngle: rainy_days_rad,
                    endAngle: Math.PI * 2 
                });
            })
        .attr("fill", "#3697a2a9");
    

    const centroid_rainy_days = arcGenerator
                .startAngle(0)
                .endAngle(rainy_days_rad)
                .centroid();

    const centroid_sun_day = arcGenerator   
                .startAngle(rainy_days_rad)
                .endAngle(Math.PI * 2)
                .centroid();

    innerChart
            .append("text")
            .text(d3.format(".0%")(rainy_days_ratio)) // Formats to percentage sign 
            .attr("x", centroid_rainy_days[0])
            .attr("y", centroid_rainy_days[1])
            .attr("fill", "white")
            .attr("font-size", 14)
            .attr("dominant-baseline", "middle")
            .attr("text-anchor", "middle");
    
    innerChart  
            .append("text")
            .text(d3.format(".0%")(1-rainy_days_ratio))
            .attr("x", centroid_sun_day[0])
            .attr("y", centroid_sun_day[1])
            .attr("fill", "white")
            .attr("font-size", 14)
            .attr("dominant-baseline", "middle")
            .attr("text-anchor", "middle");
        


    
}



