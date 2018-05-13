import {render} from '../../giga-graph.umd.js'
import { render as _render } from 'katex'
import {parseData} from '../utils'

const mathFormatter = (el, hoverInfo, tooltipData) => {
  let ret = tooltipData[hoverInfo.index]
  try {
    ret = _render(ret, el, {throwOnError: false, falsetrackLocation: true})
  } catch (err) {
    let errorEl = document.createElement('div')
    errorEl.innerHTML = ret
    el.appendChild(errorEl)
    console.log(err)
  }
  return ret
}

const zip = (toZip) => {
  if (toZip.length < 2) {
    return toZip
  }

  const first = toZip[0]
  const rest = toZip.slice(1, toZip.length)
  const zipped = first.map((e, i) => {
    return [e, ...rest.map(arr => arr[i])]
  })

  return zipped
}

const add2scene = (scene, path) => {
  const _add2scene = (data) => {
    const {pts, tex} = parseData(data)
    console.log(pts)
    // const {x, y} = data
    // const z = new Array(x.length).fill(0.0)
    // const newPointsCoords = zip([x, y, z])
    // const newPoints = newPointsCoords.map(coords => ({color: [255, 255, 255], position: coords}))
    scene.setState((prevState) => {
      return {
        points: [...prevState.points, ...pts],
        tooltipData: tex
      }
    })
  }
  fetch(path).then(d => d.json()).then(d => _add2scene(d))
}

export const renderExample = (el, path) => {
  const add2sceneOuter = (scene) => {
    add2scene(scene, path)
  }
  render(add2sceneOuter, el, {tooltipRenderer: mathFormatter, config: {width: 400, height: 400}})
}

let el = document.getElementById('scatter')

renderExample(el, './tnse_embeddings_dev.json')

// document.getElementById("scatter").style.cursor = "crosshair";
