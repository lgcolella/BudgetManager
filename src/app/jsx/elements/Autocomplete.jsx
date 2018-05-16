import React from 'react';
import PropTypes from 'prop-types';

export default class Autocomplete extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            //'id': this.props.id
            id: 'autocomplete-input__' + Math.random().toString()
        }
        this.getAutocompleteData = this.getAutocompleteData.bind(this);
    }

    getAutocompleteData(data){
        var obj = {};
        data.forEach((value) => {
            obj[value] = null;
        });
        return obj;
    }

    componentDidUpdate(){
        var elem = document.getElementById(this.state.id);
        var newData = this.getAutocompleteData(this.props.list);
        M.Autocomplete.getInstance(elem).updateData(newData);
    }

    componentDidMount(){
        var elem = document.getElementById(this.state.id);
        M.Autocomplete.init(elem, {
            data: this.getAutocompleteData(this.props.list)
        });
    }

    render(){
        return <input id={this.state.id} type='text' value={this.props.value} onChange={this.props.onChange}></input>;
    }

}

Autocomplete.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    list: PropTypes.array.isRequired
}