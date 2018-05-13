
export const parseData = (dataPoints) => {
  const keys = Object.keys(dataPoints)
  let k, position
  let color = [255, 255, 255]
  let pts = []
  let tex = []
  for (let j = 0; j < keys.length; j++) {
    k = keys[j]
    let x = parseFloat(dataPoints[k].x)
    let y = parseFloat(dataPoints[k].y)
    tex.push(dataPoints[k].tex)
    position = [x, y, 0]
    pts.push({color, position})
  }
  return {pts: pts, tex: tex}
}
