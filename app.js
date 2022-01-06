/* We must first import d3.
Next we fetch the csv from the url.
Then we make an array out of it.
Finally we render it to the DOM */

let c = string => console.log(string)

const csvUrl = 'https://gist.githubusercontent.com/ileskaa/9366348e7760700f44f05e19d594af89/raw/824348e61eb34215f88357e29c65aefd00bcb458/CSS_named_colors.csv'
const myCSV = d3.dsvFormat(";") //d3.dsvFormat makes is possible to choose a delimiter other than a comma
const width = 600
const height = width
const centerX = width/2
const centerY = height/2

const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
svg.setAttribute('width', width)
svg.setAttribute('height', height)
const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
g.setAttribute('transform', `translate(${centerX}, ${centerY})`)

const pieArc = d3.arc()
  .innerRadius(0)
  .outerRadius(290)

/* d3.pie does not produce a shape directly but instead computes the necessary angles to represent a tabular dataset
as a pie. These angles can the be passed to an arc generator.
Below, the pie generator is constructed with the default settings.
d3.pie returns an array of objects representing each datum's arc angles. 
If value() is specified, it sets the value accessor to the specified function or number.
d3.pie().value(1) returns a function.
d3.pie().value(1)(data) returns an array of objects where the value of each is set to 1 and they each have a start
and end angle, as well as an index value. */
const colorPie = d3.pie().value(1)
function fetchCSV() {
  fetch(csvUrl).then(response => response.text())
  .then(txt => myCSV.parse(txt)) //this transforms the csv into an array of objects
  .then(data => {
    //document.body.innerText = ''
    document.body.appendChild(svg)
    svg.appendChild(g)
    c(colorPie(data))
    document.getElementById('loading').remove()
    //data.map takes a func as arg
    colorPie(data).map(renderPie)
    slices = document.querySelectorAll('path')
    slices.forEach(slice => {
      slice.onmouseover = tooltip.show;
      slice.onmousemove = tooltip.follow;
      slice.onmouseout = tooltip.hide;
    })
  })
}
fetchCSV()

function renderPie(object) {
  //don't forget that path is an svg element
  let path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('fill', object.data['RGB hex value'])
/*   const pieArc = d3.arc()
  .innerRadius(0)
  .outerRadius(250)
  .startAngle(object.startAngle)
  .endAngle(object.endAngle) */
  //d defines the shape of the path
  path.setAttribute('d', pieArc(object))
  //we set a data attribute that will be accessed by our tooltip
  path.setAttribute('data-tooltip', object.data.Keyword)
  g.append(path)
  path.addEventListener('mouseenter', e => {
    const wideArc = d3.arc()
      .innerRadius(0)
      .outerRadius(305)
    e.target.setAttribute('d', wideArc(object))
  })
  path.addEventListener('mouseleave', e => {
    e.target.setAttribute('d', pieArc(object))
  })
}

//LET'S MAKE OUR TOOLTIP
//adapted from: https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onmousemove

//the new keyword creates a new object and makes the "this" variable point to the newly created object.
//It also executes the constructor function using the newly created object whenever "this" is mentioned.
//And it returns the newly created object.
//Note: constructor function refers to the func after the new keyword.
//So basically, here we simultaneously create a constructor func and call it to create a new object.
//Oftentimes the constructor func is predefined but that's not the case here.
const tooltip = new (function() { //here we are defining our constructor func
  const node = document.createElement('div')
  node.className = 'tooltip'
  node.setAttribute('hidden', '')
  document.body.appendChild(node)

  //we access our mouse coordinates
  this.follow = function(event) {
    //we use absolute positioning to position our tooltip
    node.style.left = event.clientX + 20 + 'px'
    node.style.top = event.clientY - 10 + 'px'
  }

  this.show = function(event) {
    node.textContent = event.target.dataset.tooltip
    node.removeAttribute('hidden')
  }

  this.hide = function() {
    node.setAttribute('hidden', '');
  };
})()