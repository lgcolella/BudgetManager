import React from 'react';
import PropTypes from 'prop-types';
import i18nOptions from '../functions/i18nDatepickerOption.js';

export default class DatePicker extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            //id: this.props.id
            id: 'date-picker-react-component__' + Math.random().toString().slice(2)
        };
    }

    componentDidMount(){
        
        var elem = document.getElementById(this.state.id);
        M.Datepicker.init(elem, {
            format: 'yyyy-mm-dd',
            showClearBtn: true,
            i18n: i18nOptions,
            defaultDate: new Date((typeof this.props.value !== 'undefined' ? this.props.value : null)),
            setDefaultDate: true,
            onClose: () => {
                this.props.onChange(elem.value);
            }
        });

    }

    componentDidUpdate(){
        if (typeof this.props.value !== 'undefined'){
            var elem = document.getElementById(this.state.id);
            M.Datepicker.getInstance(elem).setDate( new Date(this.props.value) );
        } else {
            document.getElementById(this.state.id).value = '';
        }
    }

    render(){
        return(
            <input type='text' id={this.state.id} value={this.props.value} onChange={() => {}}></input>
        );
    }

}

DatePicker.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
}