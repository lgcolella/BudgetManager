import React from 'react';
import PropTypes from 'prop-types';

export default class FormSelect extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            //id: this.props.id
            id: 'form-select__' + Math.random().toString()
        };
        this.onChange = this.onChange.bind(this);
    }

    onChange(){
        var elem = document.getElementById(this.state.id);
        var valuesArray = M.FormSelect.getInstance(elem).getSelectedValues();
        var result = (this.props.multiple ? valuesArray : elem.value);
        this.props.onChange(result);
    }

    componentWillUnmount(){
        var elem = document.getElementById(this.state.id);
        if (typeof M.FormSelect.getInstance(elem) !== 'undefined'){
            M.FormSelect.getInstance(elem).destroy();
        }
    }

    componentDidUpdate(){
        var elem = document.getElementById(this.state.id);
        if (typeof M.FormSelect.getInstance(elem) !== 'undefined'){
            M.FormSelect.getInstance(elem).destroy();
        }
        M.FormSelect.init(elem);

    }

    componentDidMount(){
        var elem = document.getElementById(this.state.id);
        M.FormSelect.init(elem);
    }

    render(){
        return (
            <select id={this.state.id} multiple={this.props.multiple} onChange={this.onChange} value={this.props.value}>
                {this.props.options.map((value) => {
                    return ( <option key={value}>{value}</option> );
                })}
            </select>
        );
    }

}

FormSelect.propTypes = {
    value: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    multiple: PropTypes.bool,
    defaultOptions: PropTypes.array,
    onChange: PropTypes.func.isRequired
}