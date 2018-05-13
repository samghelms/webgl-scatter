/*
This tooltip is built to interact with non-react javascript methods for rendering the tooltip.
*/
import React, {Component} from 'react';

const tooltipStyle = {
  position: 'absolute',
  background: 'rgba(0, 0, 0, 0.8)',
  color: '#FFF',
  pointerEvents: 'none'
};

class Tooltip extends Component {
	constructor(props) {
    	super(props);
    	this.ref = React.createRef()
	}

	componentDidMount() {
		const {tooltipRenderer, tooltipData, hoverInfo} = this.props
		// calls your custom renderer on the tooltip
		tooltipRenderer(this.ref.current, hoverInfo, tooltipData)
	}

	render() {
		const {hoverInfo} = this.props
		const left = hoverInfo.x + hoverInfo.offsetLeft
		const top = hoverInfo.y + hoverInfo.offsetTop
		return (
			<div ref={this.ref} style={{...tooltipStyle, left: left, top: top}}></div>
		)
	}
}

export default Tooltip