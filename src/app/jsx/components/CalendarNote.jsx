import React from 'react';
import PropTypes from 'prop-types';
import i18nOptions from '../functions/i18nDatepickerOption.js';

export default class CalendarNote extends React.Component {

    constructor(props){
        super(props);
        var id = 'calendar-note_' + Math.random().toString().slice(2);
        this.state = {
            id,
            wrapperId: id + '__wrapper',
            noteBoxId: id + '__notebox',
            editButtonId: id + '__edit-button',
            deleteButtonId: id + '__delete-button',
            editButtonText: 'Crea',
            selectedNote: '',
            editableNote: false,
            deletableNote: false
        }
        this.toggle = this.toggle.bind(this);
        this.selectDay = this.selectDay.bind(this);
        this.setEditableNote = this.setEditableNote.bind(this);
        this.editNote = this.editNote.bind(this);
        this.deleteNote = this.deleteNote.bind(this);
    }

    toggle(){
        if (this.props.open){
            M.Datepicker.getInstance(document.getElementById(this.state.id)).open();
        } else {
            M.Datepicker.getInstance(document.getElementById(this.state.id)).close();
        }
    }

    selectDay(selectedDate){

        var formattedDate = new Date(selectedDate).toDateString();
        var selectedNote;
        var editButtonText;
        var deletableNote;

        if (this.props.notes.hasOwnProperty(formattedDate)){
            selectedNote = this.props.notes[formattedDate];
            editButtonText = 'Modifica';
            deletableNote = true
        } else {
            selectedNote = '';
            editButtonText = 'Crea';
            deletableNote = false;
        }

        this.setState({
            selectedNote,
            editButtonText,
            deletableNote,
            editableNote: false
        })

    }

    setEditableNote(){
        var selectedDateString = M.Datepicker.getInstance(document.getElementById(this.state.id)).toString();
        var selectedDate = new Date(selectedDateString);
        if (!isNaN(selectedDate.getTime())){
            this.setState({
                editableNote: !this.state.editableNote,
                editButtonText: ( !this.state.editableNote ? 'Ok' : 'Modifica')
            });
        }
    }

    editNote(event){
        var selectedDateString = M.Datepicker.getInstance(document.getElementById(this.state.id)).toString();
        var selectedDate = new Date(selectedDateString);

        if(!isNaN(selectedDate.getTime())){
            var newNote = { [selectedDate.toDateString()] : event.target.value };
            this.setState({
                selectedNote: event.target.value,
                deletableNote: true
            });
            this.props.onChange(Object.assign({}, this.props.notes, newNote));
        }
    }

    deleteNote(){
        var selectedDateString = M.Datepicker.getInstance(document.getElementById(this.state.id)).toString();
        var selectedDate = new Date(selectedDateString);

        if(!isNaN(selectedDate.getTime())){
            var newNote = { [selectedDate.toDateString()] : '' };
            this.setState({
                notes: Object.assign({}, this.props.notes, newNote),
                selectedNote: event.target.value,
                editableNote: false,
                deletableNote: false,
                editButtonText: 'Crea'
            });
        }
    }

    componentDidMount(){

        M.Datepicker.init(document.getElementById(this.state.id), {
            i18n: i18nOptions,
            format: 'yyyy-mm-dd',
            onSelect: this.selectDay,
            onClose: this.props.onClose
        });

        var buttonsConfirmations = document.querySelector('#' + this.state.wrapperId + ' .confirmation-btns');
        buttonsConfirmations.innerHTML = '';
        buttonsConfirmations.appendChild(document.getElementById(this.state.deleteButtonId));
        buttonsConfirmations.appendChild(document.getElementById(this.state.editButtonId));

        var dateDisplay = document.querySelector('#' + this.state.wrapperId + ' .modal-content.datepicker-container .datepicker-date-display');
        dateDisplay.appendChild(document.getElementById(this.state.noteBoxId));

        this.toggle();
    }

    componentDidUpdate(){
        this.toggle();
    }

    render(){
        return(
            <div id={this.state.wrapperId}>
                <div id={this.state.noteBoxId}>
                    {(this.state.editableNote ?
                    (<textarea value={this.state.selectedNote} onChange={(event) => {this.editNote(event)}}></textarea>) :
                    (<span>{this.state.selectedNote}</span>)
                    )}
                </div>
                <input id={this.state.id} type='hidden'></input>
                <button id={this.state.editButtonId} className='btn-flat waves-effect' onClick={this.setEditableNote}>
                    {this.state.editButtonText}
                </button>
                <button
                id={this.state.deleteButtonId}
                className='btn-flat waves-effect datepicker-clear'
                onClick={this.deleteNote}
                style={(!this.state.deletableNote ? {'display': 'none'} : null)}>
                    Elimina
                </button>
            </div>
        );
    }

}

CalendarNote.propTypes = {
    open: PropTypes.bool.isRequired,
    notes: PropTypes.objectOf((propValue, key, componentName, location, propFullName) => {
        for (let date in propValue){
            if (isNaN(new Date(date).getTime()) || typeof propValue[date] !== 'string'){
                return new Error(
                    'Invalid prop `' + propFullName +  '` supplied to `' + componentName + '`. Validation failed.'
                );
            }
        }
    }),
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
}