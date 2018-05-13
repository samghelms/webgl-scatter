import React, {PureComponent} from 'react'
import DeckGL, {COORDINATE_SYSTEM, ScatterplotLayer, experimental} from 'deck.gl'
import {setParameters} from 'luma.gl'
const {OrbitController} = experimental
// import {normalize} from './utils/normalize'

class Scatter extends PureComponent {
  constructor (props) {
    super(props)
    this._onViewportChange = this._onViewportChange.bind(this)
    this._onInitialized = this._onInitialized.bind(this)
    this._onResize = this._onResize.bind(this)
    this._onUpdate = this._onUpdate.bind(this)
    this._onHover = this._onHover.bind(this)
    this._renderHoverInfo = this._renderHoverInfo.bind(this)
    const {offsetLeft, offsetTop} = this.props.parentRef
    this.state = {...this.props.config, offsetLeft: offsetLeft, offsetTop: offsetTop}
  }

  componentWillMount () {
    window.addEventListener('resize', this._onResize)
    this._onResize()
  }

  componentDidMount () {
    const {add2scene} = this.props
    add2scene(this)
    // asyncData.then(parsedData => {
    //                   // normalize(parsedData['pts'])
    //                   let points = parsedData['pts']
    //                   this.setState({points, tooltipData: parsedData['tex']})
    //                 })

    window.requestAnimationFrame(this._onUpdate)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this._onResize);
  }

  _onResize () {
    const size = {width: this.state.width, height: this.state.height}
    this.setState(size)
    const newViewport = OrbitController.getViewport(
      Object.assign(this.state.viewport, size)
    )
    // .fitBounds([1, 1, 1])
    this._onViewportChange(newViewport)
  }

  _onInitialized (gl) {
    setParameters(gl, {
      clearColor: [0.07, 0.14, 0.19, 1],
      blendFunc: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA]
    })
  }

  _onViewportChange (viewport) {
    this.setState({
      // rotating: !viewport.isDragging,
      viewport: {...this.state.viewport, ...viewport}
    })
  }

  _onUpdate () {
    const {viewport} = this.state

    this.setState({
      viewport: {
        ...viewport
      },
      offsetLeft: this.props.parentRef.offsetLeft,
      offsetTop: this.props.parentRef.offsetTop
    })

    // window.requestAnimationFrame(this._onUpdate);
  }

  _renderPointCloudLayer () {
    const {points} = this.state
    if (!points || points.length === 0) {
      return null
    }

    return new ScatterplotLayer({
      id: 'point-cloud-layer',
      data: points,
      coordinateSystem: COORDINATE_SYSTEM.IDENTITY,
      getPosition: d => d.position,
      getColor: d => [255, 255, 255, 128],
      getRadius: d => this.state.pointSize * 0.1,
      pickable: true,
      onHover: (info) => this._onHover(info)
    })
  }

  _renderDeckGLCanvas () {
    const {width, height, viewport} = this.state
    const canvasProps = {width, height, ...viewport}
    const glViewport = OrbitController.getViewport(canvasProps)

    return (
      <OrbitController
        {...canvasProps}
        ref={canvas => {
          this._canvas = canvas
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
    )
  }

  _onHover (info) {
    const hoverInfo = info.index > -1 ? info : null
    if (hoverInfo !== this.state.hoverInfo) {
      this.setState({hoverInfo})
    }
  }

  _renderHoverInfo () {
    const {hoverInfo, tooltipData} = this.state
    const {createTooltip} = this.props
    if (hoverInfo) {
      // for calculating where to put css correctly
      hoverInfo.offsetLeft = this.state.offsetLeft
      hoverInfo.offsetTop = this.state.offsetTop
      return (
        createTooltip(hoverInfo, tooltipData)
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

export default Scatter
