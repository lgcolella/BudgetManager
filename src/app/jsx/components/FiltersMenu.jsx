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
    }

    render(){

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
        maxAmount: PropTypes.string,
        minAmount: PropTypes.string,
        fromDate: PropTypes.string,
        toDate: PropTypes.string
    })
}