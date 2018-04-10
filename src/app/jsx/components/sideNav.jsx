import React from 'react';
import NewActivity from './NewActivity.jsx';
import Calculator from './Calculator.jsx';
import ModalBox from '../wrappers/modalBox.jsx';
const sideNavId = 'slide-out';
const modalCalculatorId = 'modal-calculator';
const modalNewActivityId = 'modal-newactivity';

class SideNav extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            'id': sideNavId,
            'instance': undefined
        };
        this.closeSideNav = this.closeSideNav.bind(this);
    }

    componentDidMount(){
        var elem = document.getElementById(this.state.id);
        var instance = M.Sidenav.init(elem);
        this.setState({'instance': instance});
    }

    closeSideNav(){
        this.state.instance.close();
    }

    render(){
        return(
            <div>
            <ul id={this.state.id} className="sidenav">
                <li>
                    <div className="user-view">
                        <h5><i className='material-icons'>account_balance_wallet</i> Budget Manager</h5>
                    </div>
                </li>
                <li><div className="divider" style={{'backgroundColor':'transparent'}}></div></li>
                <li><div className="divider"></div></li>
                <li><a className='subheader'>Operazioni</a></li>
                <li><a href={'#'+modalNewActivityId} className='waves-effect modal-trigger' onClick={this.closeSideNav}><i className="material-icons">add_shopping_cart</i>Nuova attività</a></li>
                <li><a href="#!" className='waves-effect'><i className='material-icons'>settings</i>Impostazioni</a></li>
                <li><div className="divider"></div></li>
                <li><a className="subheader">Passa a</a></li>
                <li><a href={'#'+modalCalculatorId} className='waves-effect modal-trigger' onClick={this.closeSideNav}><i className='material-icons'>exposure</i>Calcolatrice</a></li>
            </ul>
            <ModalBox id={modalNewActivityId}>
                <NewActivity wallets={this.props.wallets} activity={this.props.activity} onAdd={this.props.onAddActivity}></NewActivity>
            </ModalBox>
            <ModalBox id={modalCalculatorId}>
                <Calculator></Calculator>
            </ModalBox>

            </div>
        );
    }

}

function SideNavButton(){
    return(
        <div className="fixed-action-btn">
            <a className='btn-floating btn-large sidenav-trigger' data-target={sideNavId} title='Apri menu'>
                <i className='material-icons'>apps</i>
            </a>
        </div>
    );
}

module.exports = {
    SideNav,
    SideNavButton
};