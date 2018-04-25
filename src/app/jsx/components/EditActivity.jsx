import React from 'react';
import ModalBox from '../wrappers/modalBox.jsx';

export default class EditActivity extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            id: props.id,
            createNewWallet: false,
            submitError: false,
            errorText: ''
        };
        this.addActivity = this.addActivity.bind(this);
        this.handleWalletSelect = this.handleWalletSelect.bind(this);
        this.prefillInputs = this.prefillInputs.bind(this);
        this.clearInputs = this.clearInputs.bind(this);
    }

    addActivity(){

        var date = new Date(document.getElementById(this.state.id + '__date').value);
        var date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        var id = ( typeof this.props.activityToEdit !== 'undefined' ? this.props.activityToEdit.id : undefined);
        var activity = {
            id,
            wallet: document.getElementById(this.state.id + '__wallet').value,
            activity: document.getElementById(this.state.id + '__activity').value,
            amount: Number(document.getElementById(this.state.id + '__amount').value),
            date,
            comment: document.getElementById(this.state.id + '__comment').value,
        }

        var walletCond = typeof activity.wallet === 'string' && activity.wallet.length > 1;
        var activityCond = typeof activity.activity === 'string' && activity.activity.length > 1;
        var amountCond = typeof activity.amount === 'number' && activity.amount !== NaN && activity.amount !== 0;
        var dateCond = typeof activity.date === 'string' && activity.date.slice(0,3) !== 'NaN' && activity.date.length >= 8;

        if (walletCond && activityCond && amountCond && dateCond){
            this.props.onSubmit(activity);
            this.setState({
                submitError: false
            });
            M.Modal.getInstance(document.getElementById(this.state.id)).close();
        } else {
            this.setState({
                submitError: true,
                errorText: "Errore nell'inserimento dei dati. Accertati che siano stati compilati correttamente tutti i campi."
            });
        };
    }

    clearInputs(){
        document.getElementById(this.state.id + '__activity').value = "";
        document.getElementById(this.state.id + '__amount').value = "";
        document.getElementById(this.state.id + '__date').value = "";
        document.getElementById(this.state.id + '__comment').value = "";
        M.textareaAutoResize(document.getElementById(this.state.id + '__comment'));
        this.setState({
            submitError: false
        });
    }

    handleWalletSelect(){
        this.setState({
            createNewWallet: !this.state.createNewWallet
        });
    }

    destroyMaterializePlugin(){
        var elem = document.getElementById(this.state.id + '__wallet');
        if (elem != null && typeof M.FormSelect.getInstance(elem) !== 'undefined'){
            M.FormSelect.getInstance(elem).destroy();
        };
    }

    prefillInputs(){
        var activityToEdit = this.props.activityToEdit;
        if ( typeof activityToEdit !== 'undefined' ){
            if ( typeof activityToEdit.wallet !== 'undefined' ){
                var elem = document.getElementById(this.state.id + '__wallet').childNodes[0];
                while (elem !== null){
                    elem.defaultSelected = elem.value === activityToEdit.wallet;
                    elem = elem.nextSibling;
                }
            };
            if ( typeof activityToEdit.activity !== 'undefined' ){
                document.getElementById(this.state.id + '__activity').value = activityToEdit.activity;
            };
            if ( typeof activityToEdit.amount !== 'undefined' ){
                document.getElementById(this.state.id + '__amount').value = activityToEdit.amount;
            };
            if ( typeof activityToEdit.date !== 'undefined'){
                document.getElementById(this.state.id + '__date').value = activityToEdit.date;
            }
            if ( typeof activityToEdit.comment !== 'undefined'){
                document.getElementById(this.state.id + '__comment').value = activityToEdit.comment;
            }
        }
    }

    componentDidMount(){

        var elem = document.getElementById(this.state.id + '__activity');
        var data = (() => {
            var result = {};
            this.props.activity.forEach((value) => {result[value] = null;});
            return result;
        })();
        M.Autocomplete.init(elem, {
            data
        });

        var elem = document.getElementById(this.state.id + '__date');
        M.Datepicker.init(elem, {
            format: 'yyyy-mm-dd',
            showClearBtn: true,
            i18n: {
                'cancel': 'Cancella',
                'clear': 'Pulisci'
            },
        });
    }

    componentDidUpdate(prevProps){

        if (typeof this.props.activityToEdit !== 'undefined'){
            this.prefillInputs();
        };

        var elem = document.getElementById(this.state.id + '__activity');
        var data = (() => {
            var result = {};
            this.props.activity.forEach((value) => {result[value] = null;});
            return result;
        })();
        M.Autocomplete.getInstance(elem).updateData(data);

        var elem = document.getElementById(this.state.id + '__wallet');
        if (elem.tagName === 'SELECT'){
            if ( typeof M.FormSelect.getInstance(elem) !== 'undefined' ){
                M.FormSelect.getInstance(elem).destroy();
            }
            M.FormSelect.init(elem);
        };
        
        if (typeof this.props.activityToEdit !== 'undefined'){
            M.updateTextFields();
        };
    }

    render(){

        /*Choose right wallet input*/
        if (this.state.createNewWallet){
            this.destroyMaterializePlugin();
            var walletInput = ( <input type='text' id={this.state.id + '__wallet'}></input> );
            var buttonText = 'SCEGLI';
        } else {
            var walletInput = (() => {
                return (
                    <select id={this.state.id + '__wallet'}>
                        {this.props.wallets.map((value) => {
                            return <option key={value}>{value}</option>;
                        })}
                    </select>
                );
            })();
            var buttonText = 'NUOVO';
        };
        /*!Choose right wallet input*/
        

        /*Error box*/
        if (this.state.submitError === true){
            var errorBoxStyle = {display: 'block'};
            var errorText = this.state.errorText;
        } else {
            var errorBoxStyle = {display: 'none'};
        }
        /*!Error box*/
        return(
            <ModalBox id={this.state.id}>
                <div>
                    <form>
                        <div>
                            <div className='row'>
                                <div className='input-field col s10'>
                                    <i className="material-icons prefix">list</i>
                                    {walletInput}
                                    <label onClick={() => {document.getElementById(this.state.id + '__wallet').focus();}}>Portafoglio</label>
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
                                <input type='text' id={this.state.id + '__activity'}></input>
                                <label onClick={() => {document.getElementById(this.state.id + '__activity').focus();}}>Attività</label>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='input-field col s12'>
                                <i className="material-icons prefix">attach_money</i>
                                <input type='number' id={this.state.id + '__amount'}></input>
                                <label onClick={() => {document.getElementById(this.state.id + '__amount').focus();}}>Importo</label>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='input-field col s12'>
                                <i className="material-icons prefix">date_range</i>
                                <input type='text' id={this.state.id + '__date'} className='datepicker'></input>
                                <label onClick={() => {document.getElementById(this.state.id + '__date').click();}}>Data</label>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='input-field col s12'>
                                <i className="material-icons prefix">comment</i>
                                <textarea id={this.state.id + '__comment'} className='materialize-textarea'></textarea>
                                <label htmlFor={this.state.id + '__comment'}>Commento</label>
                            </div>
                        </div>
                    </form>
                    <div className='row' style={errorBoxStyle}>
                        <div className='col s12'>
                            <p><i className='material-icons'>warning</i> {errorText}</p>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <a href="#!" className="modal-action waves-effect waves-red btn-flat" onClick={this.clearInputs}>Resetta</a>
                        <a href="#!" className="modal-action modal-close waves-effect waves-red btn-flat">Chiudi</a>
                        <a href="#!" className="modal-action waves-effect waves-green btn-flat" onClick={this.addActivity}>OK</a>
                    </div>
                </div>
            </ModalBox>
        );
    }

};