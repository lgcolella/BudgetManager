import React from 'react';
import PropTypes from 'prop-types';

export default class FormSelect extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            id: this.props.id
        };
    }

    componentWillUnmount(){
        var elem = document.getElementById(this.props.id);
        if (typeof M.FormSelect.getInstance(elem) !== 'undefined'){
            M.FormSelect.getInstance(elem).destroy();
        }
    }

    componentDidUpdate(){
        var elem = document.getElementById(this.props.id);
        if (typeof M.FormSelect.getInstance(elem) !== 'undefined'){
            M.FormSelect.getInstance(elem).destroy();
        }
        M.FormSelect.init(elem);

    }

    componentDidMount(){
        var elem = document.getElementById(this.props.id);
        M.FormSelect.init(elem);
    }

    render(){
        var defaultValue = (this.props.multiple ? (typeof this.props.defaultOptions !== 'undefined' ? this.props.defaultOptions : [] ) : '');
        return (
            <select id={this.props.id} multiple={this.props.multiple} onChange={this.props.onChange} defaultValue={defaultValue}>
                {this.props.options.map((value) => {
                    return ( <option key={value}>{value}</option> );
                })}
            </select>
        );
    }

}

FormSelect.propTypes = {
    id: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    multiple: PropTypes.bool,
    defaultOptions: PropTypes.array,
}