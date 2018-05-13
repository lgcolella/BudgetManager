import React from 'react';
import PropTypes from 'prop-types';

export default class Autocomplete extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            'id': this.props.id
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
        var elem = document.getElementById(this.props.id);
        var newData = this.getAutocompleteData(this.props.list);
        M.Autocomplete.getInstance(elem).updateData(newData);
    }

    componentDidMount(){
        var elem = document.getElementById(this.props.id);
        M.Autocomplete.init(elem, {
            data: this.getAutocompleteData(this.props.list)
        });
    }

    render(){
        return ( <input id={this.props.id} type='text'></input> );
    }

}

Autocomplete.propTypes = {
    id: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired
}