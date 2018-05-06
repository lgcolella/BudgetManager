import Storage from '../storage.js';
import Utils from './functions/utils.js';
import React from 'react';
import TableOverview from './components/TableOverview.jsx';
import Chart from './components/Chart.jsx';
import SideNav from './components/SideNav.jsx';
import FiltersMenu from './components/FiltersMenu.jsx';
import EditActivity from './components/EditActivity.jsx';
import FormSelect from './elements/FormSelect.jsx';

const sideNavId = 'sidenav';
const modalNewActivityId = 'new-activity-modal';
const modalEditActivityId = 'edit-activity-modal';
const filtersMenuId = 'filters-menu';
const tableDataInfoId = 'table-data-info';
const tableOverviewId = 'table-overview';
const chartOverviewId = 'chart-overview';
const defaultStorage = new Storage();

export default class Home extends React.Component {

    constructor(props){
        super(props);
        var data = defaultStorage.getData().data;
        this.state = {
            'id': 'homepage',
            'data': data,
            'dataToRender': data,
            'activityToEdit': undefined,
            'filters': defaultStorage.getData().filters,
            'showTableOrChart': defaultStorage.getData().showTableOrChart || 'table',
            'chartWalletsColors': defaultStorage.getData().chartWalletsColors || {}
        };
        this.importData = this.importData.bind(this);
        this.addActivity = this.addActivity.bind(this);
        this.editActivity = this.editActivity.bind(this);
        this.addFilters = this.addFilters.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
        this.filterData = this.filterData.bind(this);
        this.setStateProp = this.setStateProp.bind(this);
    }

    importData(data){
        this.setState({
            data: data,
            dataToRender: data
        });
        defaultStorage.setData({
            data
        });
    }

    addActivity(newActivity){

        var id = Utils.generateId(this.state.data);
        newActivity['id'] = id;
        var newData = this.state.data.concat(newActivity);
        this.setState({
            data: newData,
            dataToRender: newData
        });
        defaultStorage.setData({
            data: newData,
        });
        
    }

    editActivity(editedActivity){
        
        function mapCb(object){
            return (editedActivity.id === object.id ? editedActivity : object);
        }
        var newData = this.state.data.map(mapCb);

        this.setState({
            data: newData,
            dataToRender: this.state.data.map(mapCb),
        });
        defaultStorage.setData({
            data: newData,
        });
    }

    addFilters(filters, event){
        var oldFilters = (typeof this.state.filters === 'undefined' ? {} : this.state.filters);
        var newFilters;
        if (filters === 'searchedValue'){
            newFilters = Object.assign({}, oldFilters, {'searchedValue' : event.target.value});
        } else {
            newFilters = Object.assign({}, oldFilters, filters);
        }
        
        this.setState({
            filters: newFilters
        });
        defaultStorage.setData({
            filters: newFilters
        });
        
    }

    clearFilters(){
        this.setState({
            filters: {}
        });
        defaultStorage.setData({
            filters: {}
        });
        [
            this.state.id + '__search-input',
            filtersMenuId + '__wallet',
            filtersMenuId + '__activity',
            filtersMenuId + '__min-amount',
            filtersMenuId + '__max-amount',
            filtersMenuId + '__from-date',
            filtersMenuId + '__to-date',
        ].forEach((id) => {
            document.getElementById(id).value = '';
        });
    }

    filterData(){
        
        if (typeof this.state.filters === 'undefined'){
            return this.state.dataToRender;
        } else {
            var filters = this.state.filters;
        }

        function check(value, objectType){
            var result = true;
            switch(typeof value){
                case 'undefined':
                    result = false;
                break;

                case 'string':
                    result = ( value !== '' && value !== ' ' ? true : false);
                break;

                case 'number':
                    result = ( !isNaN(value) ? true : false );
                break;

                case 'object':
                    if ( objectType === 'Array' && value instanceof Array ){
                        result = ( value.length > 0 ? true : false);
                    } else if ( objectType === 'Date' && value instanceof Date ){
                        result = ( value.toString() !== 'Invalid Date' ? true : false);
                    }
                break;

            }
            return result;
        }

        var dataToRender = this.state.data.filter(function(object){

            var walletCond = ( check(filters.wallet, 'Array') && filters.wallet.indexOf(object.wallet) !== -1 ) || !check(filters.wallet, 'Array');
            var activityCond = ( check(filters.activity, 'Array') && filters.activity.indexOf(object.activity) !== -1 ) || !check(filters.activity, 'Array');
            var minAmountCond = ( check(filters.minAmount) && Number(object.amount) >= Number(filters.minAmount) || !check(filters.minAmount));
            var maxAmountCond = ( check(filters.maxAmount) && Number(object.amount) <= Number(filters.maxAmount) || !check(filters.maxAmount));
            var dataCond = (function(){

                var date = new Date(object.date);
                var fromDate = new Date(filters.fromDate);
                var toDate = new Date(filters.toDate);
                var result = false;
                
                if ( check(date, 'Date') ){
                    if ( check(fromDate, 'Date') && check(toDate, 'Date') ){
                        result = ( date >= fromDate && date <= toDate ? true : false);
                    } else if ( check(fromDate, 'Date') ){
                        result = ( date >= fromDate ? true : false);
                    } else if ( check(toDate, 'Date') ){
                        result = ( date <= toDate ? true : false);
                    } else if ( !check(fromDate, 'Date') && !check(toDate, 'Date') ){
                        result = true;
                    }
                } else {
                    result = true;
                }

                return result;
            })();
            var searchedValueCond = (function(){
                if (check(filters.searchedValue)){
                    var searchedValue = filters.searchedValue.toLowerCase();
                    var valueFoundInWallet = object.wallet.toLowerCase().indexOf(searchedValue) !== -1;
                    var valueFoundInActivity = object.activity.toLowerCase().indexOf(searchedValue) !== -1;
                    var valueFoundInAmount = object.amount.toString().indexOf(searchedValue) !== -1;
                    var valueFoundInDate = object.date.indexOf(searchedValue) !== -1;
                    var valueFoundInComment = object.comment.indexOf(searchedValue) !== -1;
                    return valueFoundInWallet || valueFoundInActivity || valueFoundInAmount || valueFoundInDate || valueFoundInComment;
                } else {
                    return !check(searchedValue);
                }
            })();

            var result = walletCond && activityCond && minAmountCond && maxAmountCond && dataCond && searchedValueCond;
            return result;
        });
        
        return dataToRender;
    }

    setActivityToEdit(activityToEdit){
        this.setState({
            activityToEdit
        });
    }

    setStateProp(prop, value){

        if (prop === 'data' || prop === 'showTableOrChart' || prop === 'chartWalletsColors'){
            this.setState({
                [prop]: value
            });
            defaultStorage.setData({
                [prop]: value,
            });
        } else if (prop === 'activityToEdit'){
            this.setState({
                [prop]: value
            });
        } else {
            throw "Prop not allowed.";
        }
    }

    render() {

        var data = this.state.data;
        var dataToRender = this.filterData();
        var dataInfo = Utils.getDataInfo(data, dataToRender);
        var dataVisualization = (() => {
            switch (this.state.showTableOrChart){
                case 'table':
                    return (
                        <TableOverview
                        id={tableOverviewId}
                        data={data}
                        dataToRender={dataToRender}
                        modalEditActivityId={modalEditActivityId}
                        modalNewActivityId={modalNewActivityId}
                        onChangeData={(value) => this.setStateProp('data', value)}
                        onChangeActivityToEdit={(value) => this.setStateProp('activityToEdit', value)}
                        />
                    );
                case 'graph':
                    return (
                        <Chart
                        id={chartOverviewId}
                        dataToRender={dataToRender}
                        walletsColors={this.state.chartWalletsColors}
                        onChangeWalletsColors={(value) => this.setStateProp('chartWalletsColors', value)}
                        />
                    );
            }
        })();

        return (
            <div>
                <SideNav
                    id={sideNavId}
                    allData={this.state.data}
                    wallets={dataInfo.allWallets}
                    activity={dataInfo.allActivities}
                    showTableOrChart={this.state.showTableOrChart}
                    modalNewActivityId={modalNewActivityId}
                    tableDataInfoId={tableDataInfoId}
                    tableOverviewId={tableOverviewId}
                    filtersMenuId={filtersMenuId}
                    onAddActivity={this.addActivity}
                    onImportData={this.importData}
                    onClearFilters={this.clearFilters}
                    onChangeShowTableOrChart={(value) => {this.setStateProp('showTableOrChart', value)}}
                ></SideNav>
                <div className="fixed-action-btn">
                    <a className='btn-floating btn-large sidenav-trigger' data-target={sideNavId} title='Apri menu'>
                        <i className='material-icons'>apps</i>
                    </a>
                </div>
                <div className='row'>
                    <div className='input-field col s6'>
                        <i className='material-icons prefix'>search</i>
                        <input
                        type='text'
                        id={this.state.id + '__search-input'}
                        placeholder={( typeof this.state.filters !== 'undefined' && typeof this.state.filters.searchedValue !== 'undefined' ? this.state.filters.searchedValue : undefined)}
                        onKeyUp={(event) => this.addFilters('searchedValue', event)}></input>
                        <label htmlFor={this.state.id + '__search-input'}>Cerca</label>
                    </div>
                    <div className='col s6'>
                    </div>
                </div>
                <div className='row'>
                    <div className='col s12'>
                        <table id={tableDataInfoId} className='striped centered'>
                            <tbody>
                                <tr>
                                    <th>Saldo</th><td>{dataInfo.selectedActivitiesSum + '€'}</td>
                                    <th>Numero portafogli</th><td>{dataInfo.selectedWallets.length + '/' + dataInfo.allWallets.length}</td>
                                    <th>Numero attività</th><td>{dataToRender.length + '/' + data.length}</td>
                                </tr>
                                <tr>
                                    <th>Attività positive</th><td>{dataInfo.selectedPositiveActivitiesNum + '/' + dataInfo.allPositiveActivitiesNum}</td>
                                    <th>Entrata massima</th><td>{dataInfo.selectedPositiveMaxAmount + '€'}</td>
                                    <th>Entrata minima</th><td>{dataInfo.selectedPositiveMinAmount + '€'}</td>
                                </tr>
                                <tr>
                                    <th>Attività negative</th><td>{dataInfo.selectedNegativeActivitiesNum + '/' + dataInfo.allNegativeActivitiesNum}</td>
                                    <th>Uscita massima</th><td>{dataInfo.selectedNegativeMaxAmount + '€'}</td>
                                    <th>Uscita minima</th><td>{dataInfo.selectedNegativeMinAmount + '€'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='row'>
                    <div id='filters-menu-wrapper' className='col s3'>
                        <FiltersMenu
                            id={filtersMenuId}
                            activeFilters={this.state.filters}
                            wallets={dataInfo.allWallets}
                            activities={dataInfo.allActivities}
                            maxAmount={dataInfo.allMaxAmount}
                            minAmount={dataInfo.allMinAmount}
                            onChange={this.addFilters}
                        ></FiltersMenu>
                    </div>
                    <div className='col s9'>
                        {dataVisualization}
                    </div>
                    
                    <EditActivity
                        id={modalEditActivityId}
                        wallets={dataInfo.allWallets}
                        activity={dataInfo.allActivities}
                        activityToEdit={this.state.activityToEdit}
                        onSubmit={this.editActivity}
                    ></EditActivity>
                </div>
            </div>
        );
    }
}