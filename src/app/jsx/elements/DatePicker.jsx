import React from 'react';
import i18nOptions from '../functions/i18nDatepickerOption.js';

export default class DatePicker extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            id: this.props.id
        };
    }

    componentDidMount(){
        
        var elem = document.getElementById(this.state.id);
        var options = {
            format: 'yyyy-mm-dd',
            showClearBtn: true,
            i18n: i18nOptions,
        };
        if (typeof this.props.onChange !== 'undefined'){
            options['onClose'] = () => {this.props.onChange()};
        }
        M.Datepicker.init(elem, options);
    }

    render(){
        return(
            <input type='text' id={this.state.id} placeholder={this.props.placeholder}></input>
        );
    }

}