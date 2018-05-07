import React from 'react';

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