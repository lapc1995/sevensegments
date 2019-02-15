import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

function Segment(props)  {
  
  const color = props.light ?
        {fill:'#f00'}:
        {fill:'#d2d2d2'};

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

function TwoDots(props)  {
  return (
    <svg width="60" height="275">  
      <rect 
        x="35" 
        y="75" 
        width="20" 
        height="20"   
      />
      <rect 
        x="35" 
        y="175" 
        width="20" 
        height="20"   
      />
    </svg>
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
  
    render() {
      var segments = Array(7);
      for(var i=0; i < this.state.segmentsAttributes.length; i++) {
        segments[i] = this.renderSegment(i, this.props.hex);
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
    

    constructor(props) {
      super(props);
      this.state = {
          hexes: [0x7E, 0x30, 0x6D, 0x79, 0x33, 0x5B, 0x5F, 0x70, 0x7F, 0x7B, 0x77, 0x1F, 0x4E, 0x3D, 0x4F, 0x47],

          second_1: {min:0, max:5},
          second_2: {min:0, max:9},
          second_1_index: 5,
          second_2_index: 9,

          minute_1: {min:0, max:5},
          minute_2: {min:0, max:9},
          minute_1_index: 5,
          minute_2_index: 9,

          hour_1: {min:0, max:2},
          hour_2: {min:0, max:9},
          hour_1_index: 0,
          hour_2_index: 9,

        }
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
      if(this.state.second_2_index >= this.state.second_2.max) {
        this.setState({
          second_2_index: 0
        });

        if(this.state.second_1_index >= this.state.second_1.max) {
          this.setState({
            second_1_index: 0,
          });

          if(this.state.minute_2_index >= this.state.minute_2.max) {
            this.setState({
              minute_2_index: 0,
            });

            if(this.state.minute_1_index >= this.state.minute_1.max) {
              this.setState({
                minute_1_index: 0,
              });

              if((this.state.hour_1_index == 2 && this.state.hour_2_index >= 3) || (this.state.hour_2_index >= this.state.hour_2.max)) {
                this.setState({
                  hour_2_index: 0,
                });

                if(this.state.hour_1_index >= this.state.hour_1.max) {
                  this.setState({
                    hour_1_index: 0,
                  });
                } else {
                  this.setState({
                    hour_1_index: this.state.hour_1_index+1,
                  });
                }

              } else {
                this.setState({
                  hour_2_index: this.state.hour_2_index+1,
                });
              }

            } else {
              this.setState({
                minute_1_index: this.state.minute_1_index+1,
              });
            }

          } else {
            
            this.setState({
              minute_2_index: this.state.minute_2_index+1,
            });
          }

        } else {
          this.setState({
            second_1_index: this.state.second_1_index+1,
          });
        }

      } else {
        this.setState({
          second_2_index: this.state.second_2_index+1
        });
      }
      console.log("tick!");
    }

    render() {
      return <div>
        <SevenSegmentDisplay hex={this.state.hexes[this.state.hour_1_index]}/>
        <SevenSegmentDisplay hex={this.state.hexes[this.state.hour_2_index]}/>
        <TwoDots></TwoDots> 
        <SevenSegmentDisplay hex={this.state.hexes[this.state.minute_1_index]}/> 
        <SevenSegmentDisplay hex={this.state.hexes[this.state.minute_2_index]}/>
        <TwoDots></TwoDots>  
        <SevenSegmentDisplay hex={this.state.hexes[this.state.second_1_index]}/> 
        <SevenSegmentDisplay hex={this.state.hexes[this.state.second_2_index]}/> 
        </div>
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
