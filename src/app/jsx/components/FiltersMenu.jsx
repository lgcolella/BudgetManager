import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from '../elements/DatePicker.jsx';
import FormSelect from '../elements/FormSelect.jsx';

export default class FiltersMenu extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            'id': this.props.id,
            'values': {},
            'openFromDate': false,
            'openToDate': false
        };
        //this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    /*handleFilterChange(filter, event){

        var newValues = this.state.values;
        switch (filter){
            case 'wallet':
                var elem = document.getElementById(this.state.id + '__wallet');
                newValues.wallet = M.FormSelect.getInstance(elem).getSelectedValues();
            break;

            case 'activity':
                // eslint-disable-next-line no-redeclare
                var elem = document.getElementById(this.state.id + '__activity');
                newValues['activity'] = M.FormSelect.getInstance(elem).getSelectedValues();
            break;

            case 'minAmount':
                var value = event.target.value;
                var maxValue = this.props.maxAmount;
                newValues.minAmount = (  maxValue >= Number(value) ? value : maxValue );
                event.target.value = (  maxValue >= Number(value) ? value : maxValue );
            break;

            case 'maxAmount':
                // eslint-disable-next-line no-redeclare
                var value = event.target.value;
                var minValue = this.props.minAmount;
                newValues.maxAmount = (  minValue <= Number(value) ? value : minValue );
                event.target.value = (  minValue <= Number(value) ? value : minValue );
            break;

            case 'Date':
                newValues['fromDate'] = M.Datepicker.getInstance(document.getElementById(this.state.id + '__from-date')).toString();
                newValues['toDate'] = M.Datepicker.getInstance(document.getElementById(this.state.id + '__to-date')).toString();
            break;

        }
        
        this.setState({
            'values': newValues
        });
        this.props.onChange(newValues);
    }*/

    render(){

        /*var defaultWallets;
        var defaultActivities;
        var defaultMinAmount;
        var defaultMaxAmount;
        var defaultFromDate;
        var defaultToDate;

        if (typeof this.props.activeFilters !== 'undefined'){
            defaultWallets = ( typeof this.props.activeFilters.wallet !== 'undefined' ? this.props.activeFilters.wallet : [] );
            defaultActivities = ( typeof this.props.activeFilters.activity !== 'undefined' ? this.props.activeFilters.activity : [] );
            defaultMinAmount = ( typeof this.props.activeFilters.minAmount !== 'undefined' ? this.props.activeFilters.minAmount : this.props.minAmount );
            defaultMaxAmount = ( typeof this.props.activeFilters.maxAmount !== 'undefined' ? this.props.activeFilters.maxAmount : this.props.maxAmount );
            defaultFromDate = ( typeof this.props.activeFilters.fromDate !== 'undefined' ? this.props.activeFilters.fromDate : '' );
            defaultToDate = ( typeof this.props.activeFilters.toDate !== 'undefined' ? this.props.activeFilters.toDate : '' );
        } else {
            defaultWallets = [];
            defaultActivities = [];
            defaultMinAmount = this.props.minAmount;
            defaultMaxAmount = this.props.maxAmount;
            defaultFromDate = '';
            defaultToDate = '';
        }*/

        var { activeFilters } = this.props;

        return(
            <div id={this.state.id}>
                <div>
                    <label>Portafoglio</label>
                    <FormSelect
                    options={this.props.wallets}
                    value={activeFilters.wallet}
                    multiple={true}
                    onChange={(value) => { this.props.onAddFilter('wallet', value) }}
                    ></FormSelect>
                </div>
                <div>
                    <label>Attività</label>
                    <FormSelect
                    options={this.props.activities}
                    value={activeFilters.activity}
                    multiple={true}
                    onChange={(value) => { this.props.onAddFilter('activity', value) }}
                    ></FormSelect>
                </div>
                <div>
                    <label>Importo minimo</label>
                    <input type='number' value={activeFilters.minAmount} onChange={(event) => this.props.onAddFilter('minAmount', event.target.value)}></input>
                </div>
                <div>
                    <label>Importo massimo</label>
                    <input type='number' value={activeFilters.maxAmount} onChange={(event) => this.props.onAddFilter('maxAmount', event.target.value)}></input>
                </div>
                <div>
                    <label>Da</label>
                    <DatePicker
                    open={this.state.openFromDate}
                    value={activeFilters.fromDate}
                    onChange={(value) => this.props.onAddFilter('fromDate', value)}
                    onClose={() => { this.setState({openFromDate: false}) }}
                    ></DatePicker>
                </div>
                <div>
                    <label>A</label>
                    <DatePicker
                    open={this.state.openToDate}
                    value={activeFilters.toDate}
                    onChange={(value) => this.props.onAddFilter('toDate', value)}
                    onClose={() => { this.setState({openToDate: false}) }}
                    ></DatePicker>
                </div>
            </div>
        );
    }

}

FiltersMenu.propTypes = {
    id: PropTypes.string.isRequired,
    onAddFilter: PropTypes.func.isRequired,
    wallets: PropTypes.array,
    activities: PropTypes.array,
    maxAmount: PropTypes.number,
    minAmount: PropTypes.number,
    activeFilters: PropTypes.shape({
        wallet: PropTypes.array,
        activity: PropTypes.array,
        maxAmount: PropTypes.number,
        minAmount: PropTypes.number,
        fromDate: PropTypes.string,
        toDate: PropTypes.string
    })
}