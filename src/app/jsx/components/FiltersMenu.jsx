import React from 'react';


export default class FiltersMenu extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            'id': this.props.id,
            'values': {}
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.initMaterializePlugins = this.initMaterializePlugins.bind(this);
    }

    initMaterializePlugins(){
        var elem = document.getElementById(this.state.id + '__activity');
        if (typeof M.FormSelect.getInstance(elem) !== 'undefined'){
            M.FormSelect.getInstance(elem).destroy();
        };
        M.FormSelect.init(elem);

        var elem = document.getElementById(this.state.id + '__wallet');
        if (typeof M.FormSelect.getInstance(elem) !== 'undefined'){
            M.FormSelect.getInstance(elem).destroy();
        };
        M.FormSelect.init(elem);
    }

    handleFilterChange(filter, event){

        var newValues = this.state.values;
        switch (filter){
            case 'wallet':
                var elem = document.getElementById(this.state.id + '__wallet');
                newValues['wallet'] = M.FormSelect.getInstance(elem).getSelectedValues();
            break;

            case 'activity':
                var elem = document.getElementById(this.state.id + '__activity');
                newValues['activity'] = M.FormSelect.getInstance(elem).getSelectedValues();
            break;

            case 'minAmount':
                var value = event.target.value;
                var maxValue = this.props['maxAmount'];
                newValues['minAmount'] = (  Number(maxValue) >= Number(value) ? value : maxValue );
                event.target.value = (  Number(maxValue) >= Number(value) ? value : maxValue );
            break;

            case 'maxAmount':
                var value = event.target.value;
                var minValue = this.props['minAmount'];
                newValues['maxAmount'] = (  Number(minValue) <= Number(value) ? value : minValue );
                event.target.value = (  Number(minValue) <= Number(value) ? value : minValue );
            break;

            case 'Date':
                newValues['fromDate'] = document.getElementById('from-date-picker').value;
                newValues['toDate'] = document.getElementById('to-date-picker').value;
            break;

        };

        this.setState({
            'values': newValues
        });
        this.props.onChange(newValues);
    }

    componentDidMount(){

        this.initMaterializePlugins();
        var elem = document.querySelectorAll('.datepicker');
        M.Datepicker.init(elem, {
            format: 'yyyy-mm-dd',
            showClearBtn: true,
            onClose: () => { this.handleFilterChange('Date'); },
            i18n: {
                'cancel': 'Cancella',
                'clear': 'Pulisci'
            },
        });
    }

    componentDidUpdate(){

        this.initMaterializePlugins();

    }


    render(){
        function getOptionsFromArray(array){
            return array.map(function(value){
                return <option key={value}>{value}</option>
            });
        };

        return(
            <div id={this.state.id}>
                <div>
                    <label>Portafoglio</label>
                    <select id={this.state.id + '__wallet'} multiple onChange={() => this.handleFilterChange('wallet')} defaultValue={[]}>
                        <option disabled></option>
                        {getOptionsFromArray(this.props['wallets'])}
                    </select>
                </div>
                <div>
                    <label>Attività</label>
                    <select id={this.state.id + '__activity'} multiple onChange={() => this.handleFilterChange('activity')} defaultValue={[]}>
                        <option disabled></option>
                        {getOptionsFromArray(this.props['activities'])}
                    </select>
                </div>
                <div>
                    <label>Importo minimo</label>
                    <input type='number' placeholder={this.props['minAmount']} onChange={(event) => this.handleFilterChange('minAmount', event)}></input>
                </div>
                <div>
                    <label>Importo massimo</label>
                    <input type='number' placeholder={this.props['maxAmount']} onChange={(event) => this.handleFilterChange('maxAmount', event)}></input>
                </div>
                <div>
                    <label>Da</label>
                    <input id='from-date-picker' type="text" className="datepicker"></input>
                </div>
                <div>
                    <label>A</label>
                    <input id='to-date-picker' type="text" className="datepicker"></input>
                </div>
            </div>
        );
    }

};