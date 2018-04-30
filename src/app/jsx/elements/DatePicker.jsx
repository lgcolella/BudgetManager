import React from 'react';

const i18nOptions = {
    cancel: 'Annulla',
    clear: 'Pulisci',
    done: 'Ok',
    months: [
        'Gennaio',
        'Febbraio',
        'Marzo',
        'Aprile',
        'Maggio',
        'Giugno',
        'Luglio',
        'Agosto',
        'Settembre',
        'Ottobre',
        'Novembre',
        'Dicembre'
    ],
    monthsShort: [
        'Gen',
        'Feb',
        'Mar',
        'Apr',
        'Mag',
        'Giu',
        'Lug',
        'Ago',
        'Set',
        'Ott',
        'Nov',
        'Dic'
    ],
    weekdays: [
        'Domenica',
        'Lunedì',
        'Martedì',
        'Mercoledì',
        'Giovedì',
        'Venerdì',
        'Sabato'
    ],
    weekdaysShort: [
        'Dom',
        'Lun',
        'Mar',
        'Mer',
        'Gio',
        'Ven',
        'Sab'
    ],
    weekdaysAbbrev: ['D','L','M','M','G','V','S']
}

export default class DatePicker extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            id: this.props.id
        };
    }

    componentDidMount(){
        
        var elem = document.getElementById(this.state.id);
        var options = {
            format: 'yyyy-mm-dd',
            showClearBtn: true,
            i18n: i18nOptions,
        };
        if (typeof this.props.onChange !== 'undefined'){
            options['onClose'] = () => {this.props.onChange()};
        }
        M.Datepicker.init(elem, options);
    }

    render(){
        return(
            <input type='text' id={this.state.id} placeholder={this.props.placeholder}></input>
        );
    }

}