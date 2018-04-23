const {dialog} = require('electron').remote;
import fs from 'fs';
import React from 'react';
//import NewActivity from './NewActivity.jsx';
import EditActivity from './EditActivity.jsx';
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
            'instance': undefined,
        };
        this.exportData = this.exportData.bind(this);
        this.importData = this.importData.bind(this);
        this.closeSideNav = this.closeSideNav.bind(this);
    }

    exportData(){

        var data = JSON.stringify(this.props.allData);
        dialog.showSaveDialog({
            title: 'Scegli dove salvare i tuoi dati.',
            defaultPath: 'storage.data',
        }, function(path){
            if (typeof path !== 'undefined'){
                fs.writeFile(path, data, function(err){
                    if (err){
                        dialog.showErrorBox('Errore','Errore nella scrittura del file.');
                    } else {
                        dialog.showMessageBox({
                            type: 'info',
                            message: 'Backup effettuato con successo.'
                        });
                    };
                })
            }
        });
    }

    importData(){

        dialog.showOpenDialog({
            title: 'Scegli il file da cui ripristinare i dati.',
            properties: ['openFile']
        }, (path) => {
            fs.readFile(path[0], (err, data) => {
                if (err){
                    dialog.showErrorBox('Errore','Errore nel file selezionato.');
                } else {
                    try {
                        this.props.onImportData( JSON.parse( data.toString()) );
                    } catch(e) {
                        dialog.showErrorBox('Errore','Errore nella lettura del file.');
                    }
                };
            });
        });
    }

    closeSideNav(){
        this.state.instance.close();
    }

    componentDidMount(){
        var elem = document.getElementById(this.state.id);
        var instance = M.Sidenav.init(elem);
        this.setState({'instance': instance});
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
                <li><a href="#!" className='waves-effect' onClick={this.exportData}><i className='material-icons'>file_download</i>Esporta dati</a></li>
                <li><a href="#!" className='waves-effect' onClick={this.importData}><i className='material-icons'>file_upload</i>Carica dati</a></li>
                {/*<li><a href="#!" className='waves-effect'><i className='material-icons'>settings</i>Impostazioni</a></li>*/}
                <li><div className="divider"></div></li>
                <li><a className="subheader">Passa a</a></li>
                <li><a href={'#'+modalCalculatorId} className='waves-effect modal-trigger' onClick={this.closeSideNav}><i className='material-icons'>exposure</i>Calcolatrice</a></li>
            </ul>
            {/*<ModalBox id={modalNewActivityId}>
                <NewActivity wallets={this.props.wallets} activity={this.props.activity} onAdd={this.props.onAddActivity}></NewActivity>
            </ModalBox>*/}
            <EditActivity
                id={modalNewActivityId}
                wallets={this.props.wallets}
                activity={this.props.activity}
                onSubmit={this.props.onAddActivity}
            ></EditActivity>
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