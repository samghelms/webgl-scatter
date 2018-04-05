const katex = require('katex')

export const mathFormatter = (text) => {
  let ret
  try {
    ret = katex.renderToString(text, {throwOnError: false, falsetrackLocation: true})
  } catch (err) {
    console.log(err)
    ret = text
  }
  return ret
}
