import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

function Segment(props)  {
  
    const color = props.light ?
          {fill:'#f00'}:
          { fill:'#333333'};
  
    const current_position = props.vertical ?
          "rotate(-90 " + props.x + " " + props.y + ")":
          "0";
    
     return (<rect 
                x={props.x} 
                y={props.y} 
                width="100" 
                height="25"  
                transform = {current_position} 
                style= {color}
               />
    );
  }
  
  class SevenSegmentDisplay extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        segmentsAttributes: [
          {x:50, y:0, vertical: false, shift: 6},
          {x:150, y:125, vertical: true, shift: 5},
          {x:150, y:250, vertical: true, shift: 4},
          {x:50, y:250, vertical: false, shift: 3},
          {x:25, y:250, vertical: true, shift: 2},
          {x:25, y:125, vertical: true, shift: 1},
          {x:50, y:125, vertical: false, shift: 0},
        ],
        
        hexes: [0x7E, 0x30, 0x6D, 0x79, 0x33, 0x5B, 0x5F, 0x70, 0x7F, 0x7B, 0x77, 0x1F, 0x4E, 0x3D, 0x4F, 0x47],
        index: 0,
      }
    } 
    
    renderSegment(segment, value) {
      const light = (value >> this.state.segmentsAttributes[segment].shift) & 1;
      return (
        <Segment
          x={this.state.segmentsAttributes[segment].x}
          y={this.state.segmentsAttributes[segment].y}
          vertical={this.state.segmentsAttributes[segment].vertical}
          light={light}
          key={segment}
          />
      );
    }
    
    componentDidMount() {
      this.intervalID = setInterval(
        () => this.tick(),
        1000
      );
    }
    componentWillUnmount() {
      clearInterval(this.intervalID);
    }
    tick() {
      if(this.state.index>14)
        this.state.index = -1
      
      this.setState({
        index: this.state.index+1
      });
    }
    
    render() {
      var segments = Array(7);
      for(var i=0; i < this.state.segmentsAttributes.length; i++) {
        segments[i] = this.renderSegment(i, this.state.hexes[this.state.index]);
      }  
      return (<svg width="175" height="275"> {segments} </svg>)
    }
  }
  
  class Clock extends React.Component {
    /*
       0 0 : 0 0 : 0 0
       
       1. 0 - 2
       2. 0 - 9 || 0 - 4
       
       3. 0 - 5
       4. 0 - 9
       
       5. 0 - 5
       6: 0 - 9
       
       
    */
    
    render() {
      return <div> <SevenSegmentDisplay /> <SevenSegmentDisplay /> </div>
    }
  }
  
  ReactDOM.render(
    <Clock />,
    document.getElementById('root')
  );
  


//ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
