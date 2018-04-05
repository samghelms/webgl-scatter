
// position: [dv.getInt32(0, true), dv.getInt32(4, true), dv.getInt32(8, true)],
// intensity: dv.getUint16(12, true),
// classification: dv.getUint8(15, true),
// color: [dv.getUint16(28, true), dv.getUint16(30, true), dv.getUint16(32, true)]

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
    // index2key[j] = k
    tex.push(dataPoints[k].tex)
    position = [x, y, 0]
    pts.push({color, position})
  }
  // map/reduce to get the max and normalize;
  // var maxCallback = (max, cur) => Math.max(max, cur)
  // this.scaleMax = pts.reduce(maxCallback, -Infinity)
  // const ptsNormalized = pts.map(x => x / this.scaleMax)
  return {pts: pts, tex: tex}
}

export const fetchData = (dataUrl) => {
  return fetch(dataUrl).then(r => r.json())
}
