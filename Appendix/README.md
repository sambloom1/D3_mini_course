## SVG Lesson

co-ordinates of plotting stwrt at top left (0,0),  positive x plots to the right, positive y plots down, 

### Basic shapes 
**rect** - an element that has attriubutes x, y, width, height. used for bars squares and rectangles <br>
**line** - x1,y1,x2,y2 <br>
**circle** - cx, cy, r <br>
**ellipse** - cx, cy, rx,ry <br>
**text** - x, y, font-family, font-size, text-anchor, dominant-baseline <br>
     with text elements attributes are set in the opening bracket with the text to be displayed written between the opening and closed.<br>

**path** - d attribute which stands for to draw. M, C, E ?? <br>

**grouped <g></g>** groups all elements together that the brackets encapuslates. the attriubutes are set in opening <g..> <br>


### Transform and translate 
The attribute transform and passing translate means we can 'translate' or move the pixels from one area of the SVG to the other. The values within translate link to the direction of the SVG. <br>
`.attr("transform", "translate(50,100)");` Would move the element 50 pixels to the right and 100 pixels down.


##  Bar Chart 
| Concept   | Description  | Code example    |
| :---   | :---   | :--- |
| Loading data into D3 and formatting      | To load data into d3 we use d3.csv( "/path/to/csv", <br> followed by d=> { and specifying the columns and the types}      | `d3.csv("../imdb_clean.csv", d=> { return Movie: d.Movie, IMDB_Rating: +d.IMDB_Rating};})  `
| Asynchronicity    | This is a JavaScript trait that the language rushes to load everything and not waiting for certain things to load before continuing. This can be rectified with a Promise - using .then() will make JS wait until this step is completed before commencing the next.| `d3.csv().then( data => myBarChart(data))}; `  
|Measuring | Using d3 functions to obtain minimum and maximum and extenet (min and max values in an array | `d3.min(data, d=> d.IMDB_Rating), can link it with console.log(d3.max(data, d=>d.IMDB_Rating)` 
| Binding data to the DOM | The process of linking the data which is now loaded to an svg element like a rect for a bar chart. Usually it's an empty selection first and then we bind the data with .data() followed by .join("rect") | `svg.selectAll('bars-Movie')`<br>`.data(data)`<br>`.join("rect")`<br>`.attr('class','bars-Movies)`
| Scales | This detemines the posiitons of data onto the SVG. Once set it enables recondiguriation of size easily as the scale dictates the positions when its declared. The types of scales is dependent on the data that's present. discrete continuous, temporal etc. |  `const xScale = d3.scaleLinear().domain([0,50]).range([0, innerWidth])`
| Domain and Range | The domain and range are accessor functions of the scale. Domain is the input and Range is the ouput of the Range based on the Scale. the type of Scale determines what to enter as a domain and Range. With scaleLinear() this is straightforward as it's just a numerical array literal
| `.domain=[0, maxValue].range=[0, innerWidth]; 


## Line Chart
| Concept   | Description | Code example    |
| :--  | :----   | :--- |
| File structuring  - CSS    | Modularising the styling by bulking out two CSS files. One being the base for the webpage and containers, another specifically for the visualitions | base.css  visualisation.css   
| Margin Convention Strategy  | Margins are needed in most charts for axis ticks and labels. Instead of manually trying to adapt the chart in real time, this element should be 20px to the right because of the margin. We can set the convention right at the beginning of the script. Setting the height, width, margins: top, bottom, left and right. Appending a grouped element to the svg and calling innerChart. From that point all the data visualisation elements are done to the innerChart. | `const margin = {top: 30, bottom: 30, left: 20, right: 40  } ; `
|Axis | Axis in d3 are appended grouped elements to the chart. However before we do that we first create a const for it and use d3.axisLeft(yScale) and we ned to pass the relevant scale in as an argument. This is passing the yScale into the axis generator and displaying the ticks and the left side of the axis line. For the x axis if we want it at the bottom of the chart we have to apply an extra transformation when apeending and calling the axis as a grouped element to move it to the bottom of the chart as by default elements are plotted in line with the origin (0,0) (top left) |  `const xAxis = d3.axisBottom(xScale)` <br>`innerChart.append("g")`<br>`.attr("class", "x-axis")`<br>`.attr("transform", `translate(0, innerHeight)`);`
| Selecting the axis text via selecting the class | This is a way of going into any element by selecting the class. Like a fractal, zooming into an svg element like the axs text brings up the line and text part of it. We can modify that and name it with a class and do the same thing again |  `innerChart.append("g")`<br>`.attr("class", "x-axis")`<br>`.attr("transform", `translate(0,${innerHeight})`)`<br>`     .call(xAxis)  `<br>`d3. selectAll(".x-axis text")`
| Generators| For more complex visuals using d3 specific functions, it helps to create a const naming it a generator. Which can then be passed when appending an element. For a line graph this would be a line generator where we pass the methods and the arguments of d3.line() then when appropriate we call the generator and pass the dataset as the argument for the generator |  `const lineGenerator = d3.line()`<br>`.x(arguments for x co-ordinated, usually an xScale)`<br>`.y(arguments for the y values for the line generator of .line(), usually a yScale`
| d3.line() and d3.area() | d3.line() and d3.area() are d3 specific functions. This is where d3 excels in utility as complicated mathematics/formula to determine how a line is plotted from data to the element, is abstracted to a d3 specific function

## Donut Chart
| Concept   | Description | Code example    |
| :--     | :----   | :--- |
| Polar co-ordinate system | In order to plot elements in a radial plane like a pie/donut chart or more complex like a radial chart. We have to think and plot in the polar co-ordinate system not cartesian. This being, the centre of the graph is the origin, not the top. The orientation goes clockwise not left to right and the manipulations are done with angles and radians rather than left,right,up,down values. | `const pieGenerator = d3.pie()` <br> `.value(d=>d.sales) ;` <br> `const arcGenerator = d3.arc()` <br>`.startAngle(d=> d.startAngle)`<br> `.endAngle(d=> d.endAngle)`<br> `.innerRadius(60)`<br>`.outerRadius(100)`<br>`.padAngle(0.02)`<br>`.cornerRadius(3); `
| Radians | The measurement used for calculating the values in a polar co-ordinate system which is converted from the angle measurement. We would use this when calculating the percentage value from the angle proportion wihtin a donut chart. Making use of the the Math.PI within JS to calculate this. | `arcs.append("text")`<br>`.text( d=> {`<br>` d["percentage"] = (d.endAngle - d.startAngle) /(2*Math.PI) `<br>` return d3.format(".0%")(d.percentage) ;}) `
| Centroid | The centre position for a segment in the polar plane. The centre position of an arc is difficult to calculate without the use of an inbuilt d3 function which is .centroid() which is part of the arcGenertor using d3.arc(). We also need to pass the start and end angle arguments as parameters. | `... .attr("x", d=> { `<br>`d["centroid"] = arcGenerator`<br>`.startAngle(d=>d.startAngle)`<br> `.endAngle(d=>d.endAngle)`<br>`.centroid() ; `<br>`return d[0]})`<br>`.attr("y", d=>d.centroid[1]);`





