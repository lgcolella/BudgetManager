import React from 'react';
import PropTypes from 'prop-types';

export default class ModalBox extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            'id': 'modal-react-component__' + Math.random().toString().slice(2),
            'endingTop': props.endingTop || '8%'
        }
        this.toggle = this.toggle.bind(this);
    }

    toggle(){
        if(this.props.open){
            M.Modal.getInstance(document.getElementById(this.state.id)).open();
        } else {
            M.Modal.getInstance(document.getElementById(this.state.id)).close();
        }
    }

    componentDidMount(){
        var elem = document.getElementById(this.state.id);
        M.Modal.init(elem, {
            onCloseEnd: this.props.onClose,
            endingTop: '3%'
        });
        this.toggle();
    }

    componentDidUpdate(){
        this.toggle();
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
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool,
    children: PropTypes.node.isRequired,
    endingTop: PropTypes.string
}