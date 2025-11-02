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
.attr("transform", "translate(50,100)"); Would move the element 50 pixels to the right and 100 pixels down.


##  Bar Chart
| Concept   | Description | Code example    |
| :---        | :---   | :--- |
| Loading data into D3 and formatting      | To load data into d3 we use d3.csv( "/path/to/csv", <br> followed by d=> { and specifying the columns and the types}      | d3.csv("../imdb_clean.csv", d=> { return Movie: d.Movie, IMDB_Rating: +d.IMDB_Rating};})   
| Asynchronicity    | This is a JavaScript trait that the language rushes to load everything and not waiting for certain things to load before continuing. This can be rectified with a Promise - using .then() will make JS wait until this step is completed before commencing the next.| d3.csv().then( data => myBarChart(data))};   
|Measuring | Using d3 functions to obtain minimum and maximum and extenet (min and max values in an array | d3.min(data, d=> d.IMDB_Rating), can link it with console.log(d3.max(data, d=>d.IMDB_Rating 
| Binding data to the DOM | The process of linking the data which is now loaded to an svg element like a rect for a bar chart. Usually it's an empty selection first and then we bind the data with .data() followed by .join("rect") | svg.selectAll('bars-Movie').data(data).join("rect").attr('class','bars-Movie
| Scales | This detemines the posiitons of data onto the SVG. Once set it enables recondiguriation of size easily as the scale dictates the positions when its declared. The types of scales is dependent on the data that's present. discrete continuous, temporal etc. |  const xScale = d3.scaleLinear().domain([0,50]).range([0, innerWidth])
| Domain and Range | The domain and range are accessor functions of the scale. Domain is the input and Range is the ouput of the Range based on the Scale. the type of Scale determines what to enter as a domain and Range. With scaleLinear() this is straightforward as it's just a numerical array literal
|




##

