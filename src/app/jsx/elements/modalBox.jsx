import React from 'react';
import PropTypes from 'prop-types';

export default class ModalBox extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            'id': props.id,
            'endingTop': props.endingTop || '8%'
        }
    }

    componentDidMount(){
        var elem = document.getElementById(this.state.id);
        M.Modal.init(elem, {
            endingTop: '3%'
        });
    }

    render(){
        return(
            <div id={this.state.id} className="modal">
                <div className="modal-content">
                    {this.props.children}
                </div>
            </div>
        );
    }

}

ModalBox.propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    endingTop: PropTypes.string
}