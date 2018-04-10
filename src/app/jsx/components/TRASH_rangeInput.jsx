import React from 'react';

export default class RangeInput extends React.Component {

    constructor(props){

        super(props);
        this.state = {
            minValue: props.min,
            maxValue: props.max,
            validRange: true
        }
        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(event, numberType){
        var value = event.target.value;
        if(numberType === 'minValue'){
            this.setState({
                'minValue': value,
                'validRange': Number(this.state.maxValue) > Number(value) || Number(this.state.maxValue) === Number(value)
            });
        } else if (numberType === 'maxValue'){
            this.setState({
                'maxValue': value,
                'validRange': Number(this.state.minValue) < Number(value) || Number(this.state.minValue) === Number(value)
            });
        };
    }

    render(){

        var invalidRange = ( this.state.validRange === true ? '' : <div><i class="fas fa-exclamation-triangle"></i> Range non valido.</div>);

        return(
            <div className='range-input'>
                
                <div>
                    <label>min: </label>
                    <input type="number" value={this.state.minValue} onChange={(event) => this.handleChange(event, 'minValue')}></input>
                </div>
                <div>
                    <label>max: </label>
                    <input type="number" value={this.state.maxValue} onChange={(event) => this.handleChange(event, 'maxValue')}></input>
                </div>
                {invalidRange}

            </div>
        );

    }

}