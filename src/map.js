import { select, selectAll } from 'd3';
import { geoPath, geoAlbersUsa } from 'd3-geo';
import { easeBounceOut } from 'd3-ease';
import { feature } from 'topojson-client';
import us from './data/map-data.json';
import capitals from './data/state-capitals.json';
import tippy from 'tippy.js';


export default function usMap (container, width = 960, height = 600, scale = 1280, animation = true) {

  const projection = geoAlbersUsa()
    .scale(scale)
    .translate([width / 2, height / 2]);

  const path = geoPath().projection(projection);

  const svg = select(container)
    .style('height', height + 'px')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'fn-svg-map')

  svg.append('defs')
    .html(`
        <filter xmlns="http://www.w3.org/2000/svg" id="dropshadow" height="130%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
          <feOffset dx="0" dy="0" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.7"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      `)

  const { features } = feature(us, us.objects.states);

  const colors = [
    'rgba(0, 79, 150, 0.5)',
    'rgba(0, 79, 150, 0.5)',
    'rgba(0, 79, 150, 0.5)',
    'rgba(0, 79, 150, 0.7)',
    'rgba(0, 79, 150, 0.7)',
    'rgba(0, 79, 150, 0.5)',
    'rgba(0, 79, 150, 0.3)',
    'rgba(0, 79, 150, 0.5)',
    'rgba(0, 79, 150, 0.5)',
    'rgba(0, 79, 150, 0.7)',
    'rgba(0, 79, 150, 0.3)',
    'rgba(0, 79, 150, 0.3)',
    'rgba(0, 79, 150, 0.5)',
    'rgba(0, 79, 150, 0.7)',
    'rgba(0, 79, 150, 0.3)',
    'rgba(0, 79, 150, 0.3)',
    'rgba(0, 79, 150, 0.3)',
    'rgba(0, 79, 150, 0.7)',
    'rgba(0, 79, 150, 0.3)',
    'rgba(0, 79, 150, 0.7)',
    'rgba(0, 79, 150, 0.7)',
    'rgba(0, 79, 150, 0.7)',
    'rgba(0, 79, 150, 0.3)',
    'rgba(0, 79, 150, 0.7)',
    'rgba(0, 79, 150, 0.7)',
    'rgba(0, 79, 150, 0.5)',
    'rgba(0, 79, 150, 0.7)',
    'rgba(0, 79, 150, 0.7)',
    'rgba(0, 79, 150, 0.5)',
    'rgba(0, 79, 150, 0.3)',
    'rgba(0, 79, 150, 0.7)',
    'rgba(0, 79, 150, 0.3)',
    'rgba(0, 79, 150, 0.5)',
    'rgba(0, 79, 150, 0.7)',
    'rgba(0, 79, 150, 0.5)',
    'rgba(0, 79, 150, 0.5)',
    'rgba(0, 79, 150, 0.7)',
    'rgba(0, 79, 150, 0.3)',
    'rgba(0, 79, 150, 0.3)',
    'rgba(0, 79, 150, 0.5)',
    'rgba(0, 79, 150, 0.5)',
    'rgba(0, 79, 150, 0.3)',
    'rgba(0, 79, 150, 0.3)',
    'rgba(0, 79, 150, 0.5)',
    'rgba(0, 79, 150, 0.7)',
    'rgba(0, 79, 150, 0.7)',
    'rgba(0, 79, 150, 0.5)',
    'rgba(0, 79, 150, 0.7)',
    'rgba(0, 79, 150, 0.7)',
    'rgba(0, 79, 150, 0.5)',
    'rgba(0, 79, 150, 0.3)',
  ];

  let colorIndex = 0;

  svg.append('g')
    .attr('class', 'foreground')
    .style('stroke-opacity', 1)
    .style('stroke', 'white')
    .selectAll('path')
    .data(features)
    .enter().append('path')
    .attr('d', d => path(d))
    .style('fill', () => colors[colorIndex++]);

  const pinPath = 'M0 -23.55c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z';

  const newPins = capitals.reduce((pinArray, val) => {
    const pinData = {
      capital: val.capital,
      state: val.name,
      abbr: val.abbr,
      lat: val.lat,
      lng: val.long,
    }
    return pinArray = [...pinArray, pinData]
  }, [])

  const sortedPins = newPins.sort((a, b) => b.lat - a.lat);

  const newG = svg.append('g');

  // newG.append('circle')
  //   .attr('cx', 0)
  //   .attr('cy', 0)
  //   .attr('r', 10)
  //   .attr('transform', () => 'translate(' + projection([-97.6228744, 41.8901482]) + ') scale(0.5 0.17 )')
  //   .style('fill', 'rgba(0, 0, 0, 0.2)');

  const pinSize = window.innerWidth < 500 ? 50 : 100;

    sortedPins.forEach((pin) => {
        const position = projection([parseFloat(pin.lng), parseFloat(pin.lat)])

        newG.append('path')
        .attr('d', pinPath)
        .attr('data-pos-x', position[0])
        .attr('data-pos-y', position[1])
        .attr('data-state', pin.state)
        .attr('data-capital', pin.capital)
        .attr('transform', function () {
            if (animation === true) {
            return `translate(${position[0]}, -5)`
            } else {
            return `translate(${position[0]}, ${position[1]})`
            }
        })
        .attr('data-lat', pin.lat)
        .attr('data-lng', pin.lng)
        .attr('class', 'a-pin capital')
    });

  var allDaPins = selectAll('.a-pin')
  let decay = (allDaPins._groups[0].length)
  const initValue = (allDaPins._groups[0].length)
  let lastDelay = 0;

    if (animation === true) {
        allDaPins.transition()
        .delay((d, i) => {
            const value = lastDelay + (100 * (decay / initValue));
            // const value = 200 * (i * (decay / initValue));
            decay--;
            lastDelay = value;
            return value;
        })
        .ease(easeBounceOut)
        .duration(1000)
        .attr("transform", function () {
            return `translate(${this.dataset.posX}, ${this.dataset.posY})`
        })
    }

console.log("getting to tippy")
    tippy('.capital', {
        placement: 'bottom-start',
        animation: 'shift-away',
        content: reference => {
            console.log("running tippy")
            const state = reference.getAttribute('data-state')
            const capital = reference.getAttribute('data-capital')
            
            const container = document.createElement('div')

            const title = document.createElement('h3')
                title.textContent = state
            const city = document.createElement('h5')
                city.textContent = capital

            container.appendChild(title)
            container.appendChild(city)

            return container
        }
    });
};
