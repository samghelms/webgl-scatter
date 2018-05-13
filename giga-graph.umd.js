/*
The main interface for the application for interactions with javascript and the dom.
*/

import React from 'react'
import {render as reactRender} from 'react-dom'
import Tooltip from './tooltip-raw'
import Scatter from './scatter'


const defaultConfig = {
				      width: 200,
				      height: 200,
				      zoom: 0.01,
				      pointSize: 1,
				      points: [],
				      id2text: null,
				      progress: 0,
				      // rotating: true,
				      viewport: {
				        lookAt: [0, 0, 0],
				        distance: 100,
				        // rotationX: 0,
				        // rotationOrbit: 0,
				        // orbitAxis: 'Y',
				        fov: 30,
				        minDistance: 0.5,
				        maxDistance: 3
				      }
				    }

export const render = (add2scene, el, kwargs) => {
	let {tooltipRenderer, config} = kwargs
	tooltipRenderer = tooltipRenderer ? tooltipRenderer : (el) => el
	config = {...defaultConfig, ...config}
	const createTooltip = (hoverInfo, tooltipData) => <Tooltip tooltipRenderer={tooltipRenderer} hoverInfo={hoverInfo} tooltipData={tooltipData}/>
	console.log(config)
	console.log("fdafadsf")
	console.log(defaultConfig)
	reactRender(<Scatter parentRef={el}
		         add2scene={add2scene} config={config} createTooltip={createTooltip} />, el)
}
