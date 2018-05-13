import { render } from './webgl-scatter-raw'
import { fetchData, parseData } from './utils/tsne-loader'

const katex = require('katex')

const mathFormatter = (el, hoverInfo, tooltipData) => {
  let ret = tooltipData[hoverInfo.index]
  try {
    ret = katex.render(ret, el, { throwOnError: false, falsetrackLocation: true })
  } catch (err) {
    let errorEl = document.createElement('div')
    errorEl.innerHTML = ret
    el.appendChild(errorEl)
    console.log(err)
  }
  return ret
}

let cont = document.createElement('div')
cont.style.textAlign = 'center'
cont.style.padding = '30px'
let el = document.createElement('div')
el.style.display = 'inline-block'
// el.style.cursor = "pointer"
cont.appendChild(el)
document.body.appendChild(cont)

const asyncData = fetchData('./data/tnse_embeddings_dev.json').then(data => parseData(data))

render(asyncData, el, { tooltipRenderer: mathFormatter, config: { width: 400, height: 400 } })
