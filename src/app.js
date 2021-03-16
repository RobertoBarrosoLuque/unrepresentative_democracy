// if the data you are going to import is small, then you can import it using es6 import
// (I like to use use screaming snake case for imported json)
// import MY_DATA from './app/data/example.json'
// this command imports the css file, if you remove it your css wont be applied!

import scrollama from "scrollama";
import vegaEmbed from 'vega-embed';
import * as d3 from "d3";
import './main.css'

// Create function to embed vega figures
function embedPlot(spec, div_vis) {

  const fig = vegaEmbed(div_vis, spec, {
    tooltip: { theme: 'dark' },
    renderer: 'svg', "actions": false,
  }).catch(console.warn);
  return fig
}

// initialize the scrollama
var scroller = scrollama();

var container = d3.select("#scroll");
var graphic = container.select(".scroll__graphic");
var text = container.select("scroll_text");
var step = text.selectAll(".step");


// generic window resize listener event
function handleResize() {

  // 1. update height of step elements
  var stepH = Math.floor(window.innerHeight * 0.8);
  step.style("height", stepH + "px");

  // 2. update figure measures
  var figureH = window.innerHeight / 1.2;
  var figureMarginTop = (window.innerHeight - figureH) / 2;

  graphic
    .style("height", figureH + "px")
    .style("top", figureMarginTop + "px");


  // 4. tell scrollama to update new element dimensions
  scroller.resize();
}


// scrollama event handlers
function handleStepEnter(response) {
  // response = { element, direction, index }

  // add color to current step only
  step.classed("is-active", function (d, i) {
    return i === response.index;
  });

  // update graphic based on step
  if (response.index === 0) {
    // Population map
    const fig = embedPlot("./VegaFigures/population.vg.json", "#vis1")
    // console.log("Step 1")
    // console.log(fig)
  } else if (response.index === 1) {
    d3.selectAll("path").interrupt();
    // representatives map
    embedPlot("./VegaFigures/representatives.vg.json", "#vis1");
    // console.log("Step 2")
  } else if (response.index === 2) {
    // Sentarors map
    embedPlot("./VegaFigures/senators.vg.json", "#vis1")
    // console.log("Step 3")
  } else if (response.index === 3) {
    // electoral votes map
    embedPlot("./VegaFigures/electoral_votes.vg.json", "#vis1")
    // console.log("Step 4")
  }
  // console.log("Response is.....")
  // console.log(response)
  handleResize();
}

function handleStepExit(response) {
  if (response.direction === 'down') {
    response.element.style.opacity = .4
  }
}

function setupStickyfill() {
  d3.selectAll(".sticky").each(function () {
    Stickyfill.add(this);
  });
}


function init() {

  setupStickyfill();

  // 1. force a resize on load to ensure proper dimensions are sent to scrollama  // 2. setup the scroller passing options
  handleResize();

  // this will also initialize trigger observations
  // 3. bind scrollama event handlers (this can be chained like below)
  scroller
    .setup({
      step: "#scroll scroll_text .step",
      offset: .4,
      debug: false
    })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit)
  // setup resize event
  window.addEventListener("resize", handleResize);

  embedPlot("./VegaFigures/electoral_votes_interactive.vg.json", "#vis5")

}

// kick things off
init();