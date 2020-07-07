import * as d3 from 'd3';

const svg = d3.select("#viz").append("svg").attr("width", 800).attr("height", 200).attr('viewbox', '0 0 80 20').attr('preserveAspectRatio', 'none');
const lineFunc = d3.line()
  .x((datum, index, data) => {
    return index;
  })
  .y(d => d.value);


// show latest speedtest data
fetch('/api').then(res => res.json()).then(json => {
  document.querySelector('#all-data').innerText = JSON.stringify(json, null, 2);
  console.log('lineFunc(json) %O', lineFunc(json));
  svg.append('path')
    .attr('d', lineFunc(json))
    .attr('stroke', 'black')
    .attr('fill', 'none');
});
