import Scatter from 'scatter'

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

class MyToolTip extends Tooltip { }

const el = document.createElement('div')
document.body.appendChild(el)

render(el, {}, mathFormatter)
