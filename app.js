/* global document, window,*/
/* eslint-disable no-console */
import React, {PureComponent} from 'react';
import {render} from 'react-dom';
import DeckGL, {COORDINATE_SYSTEM, PointCloudLayer, ScatterplotLayer, experimental} from 'deck.gl';
const {OrbitController} = experimental;

import {setParameters} from 'luma.gl';

import {fetchData, parseData} from './utils/tsne-loader'
import {normalize} from './utils/normalize'
import {mathFormatter} from './mathFormatter'

const DATA_REPO = 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master';
const FILE_PATH = 'examples/point-cloud-laz/indoor.laz';

const tooltipStyle = {
  position: 'absolute',
  padding: '4px',
  background: 'rgba(0, 0, 0, 0.8)',
  color: '#FFF',
  fontSize: '10px',
  zIndex: 9,
  pointerEvents: 'none'
};

class Scatter extends PureComponent {
  constructor(props) {
    super(props);

    this._onViewportChange = this._onViewportChange.bind(this);
    this._onInitialized = this._onInitialized.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onUpdate = this._onUpdate.bind(this);
    this._onHover = this._onHover.bind(this);
    this._renderHoverInfo = this._renderHoverInfo.bind(this);

    this.state = {
      width: 0,
      height: 0,
      points: [],
      id2text: null,
      progress: 0,
      // rotating: true,
      viewport: {
        lookAt: [0, 0, 0],
        distance: 1,
        // rotationX: 0,
        // rotationOrbit: 0,
        // orbitAxis: 'Y',
        fov: 30,
        minDistance: 0.5,
        maxDistance: 3
      }
    }
  }

  componentWillMount() {
    window.addEventListener('resize', this._onResize);
    this._onResize();
  }

  componentDidMount() {
    const {points} = this.state;

    const skip = 10;
    fetchData('./data/tnse_embeddings_dev.json').then(data => parseData(data))
                                                .then(parsedData => {
                                                  normalize(parsedData['pts'])
                                                  let points = parsedData['pts']
                                                  this.setState({points, tex: parsedData['tex']})
                                                })

    window.requestAnimationFrame(this._onUpdate);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
  }

  _onResize() {
    const size = {width: window.innerWidth, height: window.innerHeight};
    this.setState(size);
    const newViewport = OrbitController.getViewport(
      Object.assign(this.state.viewport, size)
    ).fitBounds([1, 1, 1]);
    this._onViewportChange(newViewport);
  }

  _onInitialized(gl) {
    setParameters(gl, {
      clearColor: [0.07, 0.14, 0.19, 1],
      blendFunc: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA]
    });
  }

  _onViewportChange(viewport) {
    this.setState({
      // rotating: !viewport.isDragging,
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  _onUpdate() {
    const {viewport} = this.state;

    this.setState({
      viewport: {
        ...viewport
      }
    });

    // window.requestAnimationFrame(this._onUpdate);
  }

  _renderPointCloudLayer () {
    const {points} = this.state;
    if (!points || points.length === 0) {
      return null;
    }

    return new ScatterplotLayer({
      id: 'point-cloud-layer',
      data: points,
      coordinateSystem: COORDINATE_SYSTEM.IDENTITY,
      getPosition: d => d.position,
      getColor: d => [255, 255, 255, 128],
      getRadius: d => 0.001,
      pickable: true,
      onHover: (info) => this._onHover(info)
    })
  }

  _renderDeckGLCanvas () {
    const {width, height, viewport} = this.state;
    const canvasProps = {width, height, ...viewport};
    const glViewport = OrbitController.getViewport(canvasProps);

    return (
      <OrbitController
        {...canvasProps}
        ref={canvas => {
          this._canvas = canvas;
        }}
        onViewportChange={this._onViewportChange}
      >
        <DeckGL
          width={width}
          height={height}
          viewport={glViewport}
          layers={[this._renderPointCloudLayer()]}
          onWebGLInitialized={this._onInitialized}
        />
      </OrbitController>
    );
  }

  _onHover (info) {
    const hoverInfo = info.index > -1 ? info : null
    if (hoverInfo !== this.state.hoverInfo) {
      this.setState({hoverInfo})
    }
  }

  _renderHoverInfo () {
    const {hoverInfo} = this.state
    if (hoverInfo) {
      return (
        <div style={{...tooltipStyle, left: hoverInfo.x, top: hoverInfo.y}}>
          <div dangerouslySetInnerHTML={{__html: mathFormatter(this.state.tex[hoverInfo.index])}} />
        </div>
      )
    }
  }

  render () {
    const {width, height} = this.state;
    if (width <= 0 || height <= 0) {
      return null;
    }

    return (
      <div>
        {this._renderDeckGLCanvas()}
        {this._renderHoverInfo()}
      </div>
    );
  }
}

const el = document.createElement('div');
document.body.appendChild(el);

render(<Scatter />, el);
