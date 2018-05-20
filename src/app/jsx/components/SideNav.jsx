const { dialog } = require('electron').remote;
import fs from 'fs';
import React from 'react';
import PropTypes from 'prop-types';
import Utils from '../functions/utils.js';

export default class SideNav extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            'id': this.props.id
        };
        this.exportData = this.exportData.bind(this);
        this.importData = this.importData.bind(this);
        this.closeSidenav = this.closeSidenav.bind(this);
    }

    exportData(){

        var data = JSON.stringify(this.props.allData);
        dialog.showSaveDialog({
            title: 'Scegli dove salvare i tuoi dati.',
            defaultPath: 'storage.json',
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
                    }
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
                }
            });
        });
    }

    closeSidenav(){
        M.Sidenav.getInstance(document.getElementById(this.state.id)).close();
    }


    componentDidMount(){
        var elem = document.getElementById(this.state.id);
        M.Sidenav.init(elem);
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
                <li>
                    <a className='waves-effect' 
                    onClick={() => {
                        Utils.modal('new-activity').open();
                        this.closeSidenav()
                    }}><i className="material-icons">add_shopping_cart</i>Nuova attività</a>
                </li>
                <li>
                    <a href="#!" className='waves-effect' onClick={this.props.tableDataInfo.toggle}>
                        <i className='material-icons'>{this.props.tableDataInfo.visible ? 'visibility_off' : 'visibility'}</i>{this.props.tableDataInfo.visible ? 'Nascondi info' : 'Mostra info'}
                    </a>
                </li>
                <li>
                    <a href="#!" className='waves-effect' onClick={this.props.filtersMenu.toggle}>
                        <i className='material-icons'>{this.props.filtersMenu.visible ? 'visibility_off' : 'visibility'}</i>{this.props.filtersMenu.visible ? 'Nascondi filtri' : 'Mostra filtri'}
                    </a>
                </li>
                <li><a href="#!" className='waves-effect' onClick={this.props.onClearFilters}><i className='material-icons'>clear</i>Resetta filtri</a></li>
                <li><div className="divider"></div></li>
                <li><a className="subheader">Passa a</a></li>
                <li>
                    {(() => {
                        if (this.props.showTableOrChart === 'table'){
                            return (
                                <a href="#!" className='waves-effect' onClick={() => {this.props.onChangeShowTableOrChart('chart')}}><i className='material-icons'>show_chart</i>Grafico</a>
                            );
                        } else if (this.props.showTableOrChart === 'chart'){
                            return (
                                <a href="#!" className='waves-effect' onClick={() => {this.props.onChangeShowTableOrChart('table')}}><i className='material-icons'>grid_on</i>Tabella</a>
                            );
                        }
                    })()}
                </li>
                <li>
                    <a href='#!' className='waves-effect' 
                    onClick={() => {
                        Utils.modal('calendar').open();
                        this.closeSidenav();
                    }}><i className='material-icons'>event</i>Calendario</a>
                </li>
                <li>
                    <a href='#!' className='waves-effect'
                    onClick={() => {
                        Utils.modal('calculator').open();
                        this.closeSidenav();
                    }}
                    ><i className='material-icons'>exposure</i>Calcolatrice</a>
                </li>
                <li><div className="divider"></div></li>
                <li><a className="subheader">Import/ Export</a></li>
                <li><a href="#!" className='waves-effect' onClick={this.exportData}><i className='material-icons'>file_download</i>Backup dati</a></li>
                <li><a href="#!" className='waves-effect' onClick={this.importData}><i className='material-icons'>file_upload</i>Ripristina backup</a></li>
                <li>
                    <a className='waves-effect'
                    onClick={() => {
                        Utils.modal('export').open();
                        this.closeSidenav();
                    }}><i className='material-icons'>insert_drive_file</i>Esporta dati</a>
                </li>
            </ul>

            
        </div>
        );
    }

}

SideNav.propTypes = {
    id: PropTypes.string.isRequired,
    allData: PropTypes.array.isRequired,
    showTableOrChart: PropTypes.oneOf(['table','chart']),
    tableDataInfo: PropTypes.shape({
        visible: PropTypes.bool.isRequired,
        toggle: PropTypes.func.isRequired
    }).isRequired,
    filtersMenu: PropTypes.shape({
        visible: PropTypes.bool.isRequired,
        toggle: PropTypes.func.isRequired
    }).isRequired,
    onImportData: PropTypes.func.isRequired,
    onClearFilters: PropTypes.func.isRequired,
    onChangeShowTableOrChart: PropTypes.func.isRequired,
}