import React from 'react';

function getOptionsFromArray(array){
    return array.map(function(value){
        return <option key={value}>{value}</option>
    });
}

export default class NewActivity extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            id: 'new-activity-form',
            createNewWallet: false,
            submitError: false,
            errorText: ''
        };
        this.addActivity = this.addActivity.bind(this);
        this.handleWalletSelect = this.handleWalletSelect.bind(this);
        this.destroyMaterializePlugin = this.destroyMaterializePlugin.bind(this);
    }

    addActivity(){

        var date = new Date(document.getElementById(this.state.id + '__date').value);
        var date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        var activity = {
            wallet: document.getElementById(this.state.id + '__wallet').value,
            activity: document.getElementById(this.state.id + '__activity').value,
            amount: Number(document.getElementById(this.state.id + '__amount').value),
            date
        }

        var walletCond = typeof activity.wallet === 'string' && activity.wallet.length > 1;
        var activityCond = typeof activity.activity === 'string' && activity.activity.length > 1;
        var amountCond = typeof activity.amount === 'number' && activity.amount !== NaN && activity.amount !== 0;
        var dateCond = typeof activity.date === 'string' && activity.date.slice(0,3) !== 'NaN' && activity.date.length >= 8;

        if (walletCond && activityCond && amountCond && dateCond){
            this.setState({ submitError: false });
            var result = this.props.onAdd(activity);
            if (result === false){
                this.setState({
                    submitError: true,
                    errorText: "Ci dispiace, ma non puoi inserire due record uguali."
                });
            };
        } else {
            this.setState({
                submitError: true,
                errorText: "Errore nell'inserimento dei dati. Accertati che siano stati compilati correttamente tutti i campi."
            });
        };
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

    componentDidMount(){
        var elem = document.getElementById(this.state.id + '__date');
        M.Datepicker.init(elem);
    }

    componentDidUpdate(){
        var elem = document.getElementById(this.state.id + '__wallet');
        if (elem.tagName === 'SELECT'){
            M.FormSelect.init(elem);
        };

        var elem = document.getElementById(this.state.id + '__activity');
        var data = {};
        this.props.activity.forEach(function(value){
            data[value] = null;
        });
        M.Autocomplete.init(elem, {
            data
        });

    }
    
    render(){

        /*Choose right wallet input*/
        if (this.state.createNewWallet){
            this.destroyMaterializePlugin();
            var walletInput = ( <input type='text' id={this.state.id + '__wallet'}></input> );
            var buttonText = 'SCEGLI';
        } else {
            var walletInput = (
                <select id={this.state.id + '__wallet'}>
                    {getOptionsFromArray(this.props.wallets)}
                </select>
            );
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
                </form>
                <div className='row' style={errorBoxStyle}>
                    <div className='col s12'>
                        <p><i className='material-icons'>warning</i> {errorText}</p>
                    </div>
                </div>
                <div className="modal-footer">
                    <a href="#!" className="modal-action modal-close waves-effect waves-red btn-flat">Chiudi</a>
                    <a href="#!" className="modal-action waves-effect waves-green btn-flat" onClick={this.addActivity}>OK</a>
                </div>
            </div>
        );
    }

};