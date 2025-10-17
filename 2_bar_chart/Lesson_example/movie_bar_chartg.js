const svg =  d3.select(".responsive-svg-container")
                .append("svg")
                .attr("viewBox", "0 0 600 700")
                .style("border", "0px solid black") ;

d3.csv("../imdb_clean.csv", d => {
    return {
        Movie: d.Movie,
        IMDB_Rating: +d.IMDB_Rating 
    };
    }).then(data => {
        console.log(data);
        console.log(d3.max(data,d => d.IMDB_Rating)); 
        console.log(d3.min(data,d=> d.IMDB_Rating)); 
        console.log(d3.extent(data, d => d.IMDB_Rating));  
        console.log(data.sort((a,b) => a.IMDB_Rating - b.IMDB_Rating)); 
        movieBarChart(data);
    });


    const movieBarChart = (data) => {

        const barHeight = 15;               

        const xScale = d3.scaleLinear()      
                .domain([7.8, 10])          
                .range([0, 400]);         

        const yScale = d3.scaleBand()       
                .domain(data.map(d=>d.Movie))
                .range([0,700])
                .paddingInner(0.2);

        const barAndLabel = svg
            .selectAll("g")                       
            .data(data)
            .join("g")                             
                .attr("transform", d=> `translate(0, ${yScale(d.Movie)})`);

        barAndLabel
            .append("rect")
                .attr("width", d=> xScale(d.IMDB_Rating))
                .attr("height", yScale.bandwidth())  
                .attr("x", 130)                       
                .attr("y", 0)            
                .style("fill", d=> {
                 return  (d.Movie === "Interstellar"||d.Movie === "The Prestige"||d.Movie==="Inception" || d.Movie==="Memento")
                  ? "#98F516":"#2B5D34" });             
                  
        barAndLabel
        .append("text")
            .text(d=>d.Movie)
            .attr("text-anchor", "end")
            .attr("x", 126)
            .attr("y", 8)
            .attr("fill", "black")
            .attr("font-size", "9px")
            .attr("font-family", "sans-serif") ;
            
        barAndLabel
        .append("text")
            .text(d=>d.IMDB_Rating)
            .attr("x", d=> 130 + xScale(d.IMDB_Rating)+5)
            .attr("y", 8)
            .attr("fill", "black")
            .attr("font-size", "9px")
            .attr("font-family", "sans-serif") ;

        barAndLabel
        .append("line")
        .attr("x1", 130)
        .attr("y1", 0)
        .attr("x2", 130)
        .attr("y2", 700)
        .attr("stroke", "black");
        
    }
