

export function normalize(points) {
  let xMin = Infinity;
  let yMin = Infinity;
  let zMin = Infinity;
  let xMax = -Infinity;
  let yMax = -Infinity;
  let zMax = -Infinity;

  for (let i = 0; i < points.length; i++) {
    xMin = Math.min(xMin, points[i].position[0]);
    yMin = Math.min(yMin, points[i].position[1]);
    zMin = Math.min(zMin, points[i].position[2]);
    xMax = Math.max(xMax, points[i].position[0]);
    yMax = Math.max(yMax, points[i].position[1]);
    zMax = Math.max(zMax, points[i].position[2]);
  }

  const scale = Math.max(...[xMax - xMin, yMax - yMin, zMax - zMin]);
  const xMid = (xMin + xMax) / 2;
  const yMid = (yMin + yMax) / 2;
  const zMid = (zMin + zMax) / 2;

  for (let i = 0; i < points.length; i++) {
    points[i].position[0] = (points[i].position[0] - xMid) / scale;
    points[i].position[1] = (points[i].position[1] - yMid) / scale;
    points[i].position[2] = (points[i].position[2] - zMid) / scale;
  }
}