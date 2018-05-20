import React from 'react';
import PropTypes from 'prop-types';

export default class ModalBox extends React.Component {

    constructor(props){
        super(props);
    }

    componentDidMount(){
        var elem = document.getElementById(this.props.id);
        M.Modal.init(elem, {
            endingTop: this.props.endingTop || '5%'
        });
    }

    render(){
        return(
            <div id={this.props.id} className="modal">
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