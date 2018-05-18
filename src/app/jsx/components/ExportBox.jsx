const { dialog } = require('electron').remote;
import React from 'react';
import PropTypes from 'prop-types';
import Xlsx from 'xlsx';
import ModalBox from '../elements/ModalBox.jsx';

export default class ExportBox extends React.Component {

    constructor(props){
        super(props);
        this.exportDataToFile = this.exportDataToFile.bind(this);
    }

    exportDataToFile(fileExtension){
        
        dialog.showSaveDialog({
            title: 'Salva dati in ' + ( fileExtension === 'xlsx' ? 'Excel' : fileExtension),
            defaultPath: 'data.' + fileExtension,
        }, (path) => {

            if (typeof path === 'undefined') return ;
            
            var data = this.props.data.map((obj) => {
                return [
                    obj.wallet, obj.activity, obj.amount, obj.date, obj.comment
                ];
            });
            var sheetHeaders = ['Portafoglio', 'Attività', 'Importo', 'Data', 'Commento'];
            data = [sheetHeaders].concat(data);
            var sheet = Xlsx.utils.aoa_to_sheet(data);
            var workbook = Xlsx.utils.book_new();
            Xlsx.utils.book_append_sheet(workbook, sheet, 'Budget Manager');
            Xlsx.writeFile(workbook, path, { type: fileExtension });
        });

    }

    render(){
        return(
            <ModalBox open={this.props.open} onClose={this.props.onClose}>
                <div className='row'>
                <h4 className='center-align'>Esporta dati in</h4>
                    <div className='col s12'>
                        <div className='col s3'><button className='btn btn-large waves-effect' onClick={() => {this.exportDataToFile('xlsx')}}>Excel</button></div>
                        <div className='col s3'><button className='btn btn-large waves-effect' onClick={() => {this.exportDataToFile('ods')}}>ODS</button></div>
                        <div className='col s3'><button className='btn btn-large waves-effect' onClick={() => {this.exportDataToFile('csv')}}>CSV</button></div>
                        <div className='col s3'><button className='btn btn-large waves-effect' onClick={() => {this.exportDataToFile('html')}}>HTML</button></div>
                    </div>
                </div>
            </ModalBox>
        );
    }

}

ExportBox.propTypes = {
    open: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired
}