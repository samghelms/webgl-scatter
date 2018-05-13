/*
This tooltip is built as an optional base class / default component for React projects
*/
import React, {Component} from 'react'

const tooltipStyle = {
  position: 'absolute',
  background: 'rgba(0, 0, 0, 0.8)',
  color: '#FFF',
  pointerEvents: 'none'
}

class Tooltip extends Component {
	constructor(props) {
    	super(props)
	}

	componentDidMount() {
		const {tooltipRenderer, tooltipData, hoverInfo} = this.props
		// calls your custom renderer on the tooltip
		tooltipRenderer(this.ref.current, hoverInfo, tooltipData)
	}

	render() {
		const {hoverInfo} = this.props
		return (
			<div ref={this.ref} style={{...tooltipStyle, left: hoverInfo.x, top: hoverInfo.y}}></div>
		)
	}
}

export default Tooltip