// import {render} from './giga-graph.umd.js'
// import {fetchData, parseData} from './utils/tsne-loader'

// const katex = require('katex')

// console.log('scatter script called')

var el = document.getElementById('_UID_')

console.log(el)

if (typeof window.testVar === 'undefined') {
  //the flag was not found, so the code has not run
  console.log('not found')
}

// const mathFormatter = (el, hoverInfo, tooltipData) => {
//   let ret = tooltipData[hoverInfo.index]
//   try {
//     ret = katex.render(ret, el, {throwOnError: false, falsetrackLocation: true})
//   } catch (err) {
//     let errorEl = document.createElement('div')
//     errorEl.innerHTML = ret
//     el.appendChild(errorEl)
//     console.log(err)
//   }
//   return ret
// }

const zip = (toZip) => {

  if (toZip.length < 2) {
    return toZip
  }

  // var a = [1, 2, 3]
  // var b = ['a', 'b', 'c']
  const first = toZip[0]
  const rest = toZip.slice(1, toZip.length)
  const zipped = first.map((e, i) => {
    return [e, ...rest.map(arr => arr[i])]
  })

  return zipped
}

const add2scene = (scene, port) => {
  let socket = new WebSocket('ws://localhost:' + port)

  socket.onmessage = (event) => {
    console.log('recieved message')
    // console.log(event.data)
    if (!window.gigaGraph) {
      console.log('need to load gigagraph')
      socket.send('load_lib')
    }
    const data = JSON.parse(event.data)
    const {x, y} = data
    const z = new Array(x.length).fill(0.0)
    const newPointsCoords = zip([x, y, z])
    const newPoints = newPointsCoords.map(coords => ({color: [255, 255, 255], position: coords}))
    scene.setState((prevState) => {
      return {points: [...prevState.points, ...newPoints],
        tooltipData: data.labels}
    })
  }

  socket.onopen = () => {
    // Web Socket is connected, send data using send()
    // ws.send("Message to send");
    socket.send("Here's some text that the server is urgently awaiting!")
    // alert("Message is sent...");
    console.log('sent msg')
  }

  socket.onclose = function () {
    // websocket is closed.
    console.log('Connection is closed...')
  }
}

export const renderPython = (el) => {
  const port = 54286
  const add2sceneOuter = (scene) => {
    add2scene(scene, port)
  }
  render(add2sceneOuter, el, {tooltipRenderer: mathFormatter, config: {width: 400, height: 400}})
}
