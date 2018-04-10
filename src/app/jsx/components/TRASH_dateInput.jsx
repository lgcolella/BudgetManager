import React from 'react';
import Pikaday from 'pikaday';

export default class DateInput extends React.Component {

    constructor(props){
        super(props);
        this.state = { id: 'datepicker' };
        this.onBlur = this.onBlur.bind(this);
    }

    componentDidMount(){
        var el = document.getElementById(this.state.id);
        new Pikaday({
            field: el,
            format: 'D MMM'
        });
    }

    onBlur(event){
        var value = event.target.value;
        console.log(value);
        console.log(new Date(value));
    }

    render(){
        return(
            <div>
                <input type="text" id={this.state.id} onBlur={(event) => this.onBlur(event)}></input>
            </div>
        );
    }

}