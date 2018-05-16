import React from 'react';
import PropTypes from 'prop-types';
import ModalBox from '../elements/ModalBox.jsx';
import DatePicker from '../elements/DatePicker.jsx';
import FormSelect from '../elements/FormSelect.jsx';
import Autocomplete from '../elements/Autocomplete.jsx';

export default class EditActivity extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            id: props.id,
            activityToEdit: {
                id: undefined,
                wallet: '',
                activity: '',
                amount: '',
                date: '',
                comment: ''
            },
            createNewWallet: false,
            submitError: false,
            errorText: ''
        };
        this.setActivityToEditProp = this.setActivityToEditProp.bind(this);
        this.addActivity = this.addActivity.bind(this);
        this.handleWalletSelect = this.handleWalletSelect.bind(this);
        this.prefillInputs = this.prefillInputs.bind(this);
        this.clearInputs = this.clearInputs.bind(this);
    }

    setActivityToEditProp(propName, propValue){

        var activityToEdit = Object.assign({}, this.state.activityToEdit, { [propName] : propValue });
        this.setState({
            activityToEdit
        })
    }

    addActivity(){
        var { id, wallet, activity, amount, date, comment } = this.state.activityToEdit;
        var rawDate = new Date(date);
        var formattedDate = rawDate.getFullYear() + '-' + ('0' + (rawDate.getMonth() + 1)).slice(-2) + '-' + ('0' + rawDate.getDate()).slice(-2);
        var activityToAdd = {
            id,
            wallet,
            activity,
            amount: Number(amount),
            date: formattedDate,
            comment
        }

        var walletCond = typeof activityToAdd.wallet === 'string' && activityToAdd.wallet.length > 1;
        var activityCond = typeof activityToAdd.activity === 'string' && activityToAdd.activity.length > 1;
        var amountCond = typeof activityToAdd.amount === 'number' && !isNaN(activityToAdd.amount)  && activityToAdd.amount !== 0;
        var dateCond = typeof activityToAdd.date === 'string' && activityToAdd.date.slice(0,3) !== 'NaN' && activityToAdd.date.length >= 8;

        if (walletCond && activityCond && amountCond && dateCond){
            this.props.onSubmit(activityToAdd);
            this.setState({
                submitError: false
            });
            M.Modal.getInstance(document.getElementById(this.state.id)).close();
            this.clearInputs();
        } else {
            this.setState({
                submitError: true,
                errorText: "Errore nell'inserimento dei dati. Accertati che siano stati compilati correttamente tutti i campi."
            });
        }
    }

    clearInputs(){
        /*document.getElementById(this.state.id + '__activity').value = "";
        document.getElementById(this.state.id + '__amount').value = "";
        document.getElementById(this.state.id + '__date').value = "";
        document.getElementById(this.state.id + '__comment').value = "";
        M.textareaAutoResize(document.getElementById(this.state.id + '__comment'));*/
        this.setState({
            activityToEdit: {
                id: undefined,
                wallet: '',
                activity: '',
                amount: '',
                date: '',
                comment: ''
            },
            submitError: false
        });
    }

    handleWalletSelect(){
        this.setState({
            createNewWallet: !this.state.createNewWallet
        });
    }

    prefillInputs(){
        var activityToEdit = this.props.activityToEdit;
        if ( typeof activityToEdit !== 'undefined' ){
            if ( typeof activityToEdit.wallet !== 'undefined' ){
                var elem = document.getElementById(this.state.id + '__wallet');
                if (elem.tagName === 'SELECT'){
                    elem = elem.childNodes[0];
                    while (elem !== null){
                        elem.defaultSelected = elem.value === activityToEdit.wallet;
                        elem = elem.nextSibling;
                    }
                } else {
                    elem.value === activityToEdit.wallet;
                }
            }
            if ( typeof activityToEdit.activity !== 'undefined' ){
                document.getElementById(this.state.id + '__activity').value = activityToEdit.activity;
            }
            if ( typeof activityToEdit.amount !== 'undefined' ){
                document.getElementById(this.state.id + '__amount').value = activityToEdit.amount;
            }
            if ( typeof activityToEdit.date !== 'undefined'){
                document.getElementById(this.state.id + '__date').value = activityToEdit.date;
            }
            if ( typeof activityToEdit.comment !== 'undefined'){
                document.getElementById(this.state.id + '__comment').value = activityToEdit.comment;
            }
        }
    }

    componentDidUpdate(){
        if (typeof this.props.activityToEdit !== 'undefined'){
            this.prefillInputs();
            M.updateTextFields();
        }
    }

    render(){

        /*Choose right wallet input*/
        var walletInput;
        var buttonText;
        if (this.state.createNewWallet){
            walletInput = (
                <input
                type='text'
                id={this.state.id + '__wallet'}
                value={this.state.activityToEdit.wallet}
                onChange={(event) => this.setActivityToEditProp('wallet', event.target.value)}></input>
            );
            buttonText = 'SCEGLI';
        } else {
            walletInput = (() => {
                return (
                    <FormSelect
                    options={this.props.wallets}
                    multiple={false}
                    value={this.state.activityToEdit.wallet}
                    onChange={(arrayValue) => this.setActivityToEditProp('wallet', arrayValue.toString())}
                    ></FormSelect>
                );
            })();
            buttonText = 'NUOVO';
        }
        /*!Choose right wallet input*/
        

        /*Error box*/
        var errorBoxStyle;
        if (this.state.submitError === true){
            errorBoxStyle = {display: 'block'};
            var errorText = this.state.errorText;
        } else {
            errorBoxStyle = {display: 'none'};
        }
        /*!Error box*/
        return(
            <ModalBox id={this.state.id} endingTop={'5%'}>
                <div>
                    <form>
                        <div>
                            <div className='row'>
                                <div className='input-field col s10'>
                                    <i className="material-icons prefix">list</i>
                                    {walletInput}
                                    <label>Portafoglio</label>
                                </div>
                                <div className='col s2'>
                                    <a className='btn waves-effect' onClick={this.handleWalletSelect}>
                                        {buttonText}
                                    </a>
                                </div>
                            
                            </div>
                        </div>
                        <div className='row'>
                            <div className='input-field col s12'>
                                <i className="material-icons prefix">textsms</i>
                                <Autocomplete
                                value={this.state.activityToEdit.activity}
                                onChange={(event) => this.setActivityToEditProp('activity', event.target.value)}
                                list={this.props.activity}
                                ></Autocomplete>
                                <label>Attività</label>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='input-field col s12'>
                                <i className="material-icons prefix">attach_money</i>
                                <input type='number' value={this.state.activityToEdit.amount} onChange={(event) => this.setActivityToEditProp('amount', event.target.value)}></input>
                                <label>Importo</label>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='input-field col s12'>
                                <i className="material-icons prefix">date_range</i>
                                <DatePicker
                                value={this.state.activityToEdit.date}
                                onChange={(value) => {this.setActivityToEditProp('date', value)}}
                                ></DatePicker>
                                <label>Data</label>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='input-field col s12'>
                                <i className="material-icons prefix">comment</i>
                                <textarea value={this.state.activityToEdit.comment} onChange={(event) => {this.setActivityToEditProp('comment', event.value)}} className='materialize-textarea'></textarea>
                                <label>Commento</label>
                            </div>
                        </div>
                    </form>
                    <div className='row' style={errorBoxStyle}>
                        <div className='col s12'>
                            <p><i className='material-icons'>warning</i> {errorText}</p>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <a href="#!" className="modal-action modal-close waves-effect waves-red btn btn-flat">Chiudi</a>
                        <a href="#!" className="modal-action waves-effect waves-red btn btn-flat" onClick={this.clearInputs}>Resetta</a>
                        <a href="#!" className="modal-action waves-effect waves-green btn btn-flat" onClick={this.addActivity}>OK</a>
                    </div>
                </div>
            </ModalBox>
        );
    }

}

EditActivity.propTypes = {
    id: PropTypes.string.isRequired,
    wallets: PropTypes.array.isRequired,
    activity: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    activityToEdit: PropTypes.shape({
        id: PropTypes.number,
        wallet: PropTypes.string.isRequired,
        activity: PropTypes.string.isRequired,
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        date:  PropTypes.string.isRequired,
        comment: PropTypes.string
    })
}