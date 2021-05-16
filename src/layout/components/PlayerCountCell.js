import { Component } from "react";
import NumberEasing from 'react-number-easing';
import AnimatedNumber from 'react-animated-number';

class PlayerCountCell extends Component {
    constructor() {
        super();
        this.formatNumber = new Intl.NumberFormat('en-US');
    }

    render() {
        return (
            // <NumberEasing
            //     value={this.props.state.playerCount}
            //     speed={10000}
            //     decimals={0}
            //     ease='expoInOut' />
            <AnimatedNumber component="span" value={this.props.state.playerCount}
                style={{
                    transition: '2s ease-in-out',
                    fontSize: 14,
                    transitionProperty:
                        'background-color, color, opacity'
                }}
                frameStyle={perc =>
                    {
                        if (this.props.state.noise > 0) {
                            return ({ color: 'green' });
                        }
                        if (this.props.state.noise < 0) {
                            return ({ color: 'red' });
                        }
                    }}
                duration={4000}
                formatValue={n => this.formatNumber.format(Math.floor(n))} />
        )
    }
}

export default PlayerCountCell;