const svg =  d3.select(".responsive-svg-container") // Setting a constant to be called svg and selecting the repsonsive container class which is defined as a div in html and repsonsiveness in CSS file
                .append("svg")    // Adding an SVG to this element 
                .attr("viewBox", "0 0 600 700") // setting the size
                .style("border", "2px solid black") ; // giving the svg a border

d3.csv("../imdb_clean.csv", d => {
    return {
        Movie: d.Movie,         //  setting movie as a string
        IMDB_Rating: +d.IMDB_Rating // setting the IMDB_rating as an integer column. Can also modify columns here too(e.g. * 10) 
    };
    }).then(data => {
        console.log(data);
        console.log(d3.max(data,d => d.IMDB_Rating)); // Returns the maximum of the IMDB rating column in the console log
        console.log(d3.min(data,d=> d.IMDB_Rating)); // Returns the minimum in the console log
        console.log(d3.extent(data, d => d.IMDB_Rating));  // Gives both the minimum and maximum of the column
        console.log(data.sort((a,b) => b.IMDB_Rating - a.IMDB_Rating)); // sorting the order fo the object/column from high to low
        movieBarChart(data);
    });


    const movieBarChart = (data) => {

        const barHeight = 15;              // The static height for each bar, replaced when using bandwidth  

        const xScale = d3.scaleLinear()      // A scaleLinear as continuous input and continuous output
                .domain([0, 10])          // Taking the IMDB ratings that are rated to 10.0
                .range([0, 400]);         // Projecting the ratings to scale of 100

        const yScale = d3.scaleBand()       // A scaleBand used as discrete input (movie titles) and continuous output (the y position on svg)
                .domain(data.map(d=>d.Movie)) // .map creates an array, therefore this is creating an array from the column of Movis
                .range([0,700])               // setting the range to be 0, top of the svg to 700, the heigth whicih in y terms is at the bottom
                .paddingInner(0.2);           // Setting paddingInner allows a bit of space in between the bars for better readability


        // Data Binding!        
        svg.selectAll("rect")                       // An empty selection, selecting the rect element 
            .data(data)                             // Bringing in the data method and pasing to our dataset as a parameter. One rect element for each row.
            .join("rect")                           // The rectangles enter the DOM with the join() method
                .attr("named-class", d=> {
                    console.log(d);
                    return "bar" ;
                })
                .attr("width", d=> xScale(d.IMDB_Rating))
  // old width  .attr("width", d => d.IMDB_Rating)   // Setting the width to be the value of the rating
                .attr("height", yScale.bandwidth()) // Returns a standardised thickness across bars depending on the proportions of the SVG
  // old height .attr("height", barHeight)           // Setting the height of the bar to be the constant above  
                .attr("x", 100)                        //  As default position is 0,0 in SVG we can leave this as 0
  // old x      .attr("x", 0)
                .attr("y", d=> yScale(d.Movie))            
  // old y      .attr("y", (d,i) => (barHeight + 5) * i) // The y position is changing for every bar, dependent on the index of the sort, +5 for space inbetween the bars 
                .style("fill", d=> {
                 return  (d.Movie === "Interstellar"||d.Movie === "The Prestige"||d.Movie==="Inception")
                  ? "gold":"#191970" });              //creating a function using a ternary operator 
                  //   if movies are interstellar or The Prestige.. then return gold and if not then midnight blue
            
    }






