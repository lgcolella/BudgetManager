import Storage from '../storage.js';
import Utils from './functions/utils.js';
import React from 'react';

import TableInfo from './components/TableInfo.jsx';
import TableOverview from './components/TableOverview.jsx';
import Chart from './components/Chart.jsx';
import SideNav from './components/SideNav.jsx';
import FiltersMenu from './components/FiltersMenu.jsx';
import EditActivity from './components/EditActivity.jsx';
import CalendarNote from './components/CalendarNote.jsx';
import Calculator from './components/Calculator.jsx';
import ExportBox from './components/ExportBox.jsx';

const searchBoxId = 'search';
const filtersMenuId = 'filters-menu';
const tableDataInfoId = 'table-data-info';
const tableOverviewId = 'table-overview';
const chartOverviewId = 'chart-overview';
const dataVisualizationId = 'data-visualization-wrapper';
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
            'chartWalletsColors': defaultStorage.getData().chartWalletsColors || {},
            'notes': defaultStorage.getData().notes || {},
            'showFiltersMenu': true,
            'showTableDataInfo': true
        };
        this.importData = this.importData.bind(this);
        this.addActivity = this.addActivity.bind(this);
        this.editActivity = this.editActivity.bind(this);
        this.addFilter = this.addFilter.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
        this.filterData = this.filterData.bind(this);
        this.setStoreProp = this.setStoreProp.bind(this);
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

    addFilter(filterName, filterValue){
        var newFilters = Object.assign({}, this.state.filters, { [filterName]: filterValue });
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
                    var valueFoundInComment = typeof object.comment !== 'undefined' && object.comment.indexOf(searchedValue) !== -1;
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

    setStoreProp(prop, value, callback){

        var storedProp = ['data', 'showTableOrChart', 'chartWalletsColors', 'notes'];

        if(storedProp.indexOf(prop) !== -1){
            this.setState({
                [prop]: value
            }, () => {
                defaultStorage.setData({
                    [prop]: value,
                });
                typeof callback === 'function' && callback();
            });
        } else {
            throw "Prop not allowed.";
        }

    }

    componentDidUpdate(prevProps, prevState){
        //To trigger adjustWidth event of Chart Component
        if (prevState.showFiltersMenu !== this.state.showFiltersMenu && this.state.showTableOrChart === 'chart'){
            window.dispatchEvent(new Event('resize'));
        }
        M.updateTextFields();
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
                        onChangeData={(value) => this.setStoreProp('data', value)}
                        openEditActivity={(activityToEdit) => {
                            this.setState({
                                activityToEdit,
                            }, () => {Utils.modal('editActivity').open()});
                        }}
                        />
                    );
                case 'chart':
                    return (
                        <Chart
                        id={chartOverviewId}
                        dataToRender={dataToRender}
                        walletsColors={this.state.chartWalletsColors}
                        onChangeWalletsColors={(value) => this.setStoreProp('chartWalletsColors', value)}
                        />
                    );
            }
        })();

        return (

            <div>
                <SideNav
                    id={Utils.modal('sidenav').id}
                    allData={this.state.data}
                    showTableOrChart={this.state.showTableOrChart}
                    tableDataInfo={{
                        visible: this.state.showTableDataInfo,
                        toggle: () => {
                            this.setState({ showTableDataInfo: !this.state.showTableDataInfo })
                        }
                    }}
                    filtersMenu={{
                        visible: this.state.showFiltersMenu,
                        toggle: () => {
                            this.setState({ showFiltersMenu: !this.state.showFiltersMenu })
                        }
                    }}
                    onChangeShowTableOrChart={(value) => {
                        this.setStoreProp('showTableOrChart', value)
                    }}
                    onImportData={this.importData}
                    onClearFilters={this.clearFilters}
                ></SideNav>

                <div className="fixed-action-btn">
                    <a href='#!'
                    className='btn-floating btn-large'
                    title='Apri menu'
                    onClick={() => {
                        Utils.modal('sidenav').open();
                    }}>
                        <i className='material-icons'>apps</i>
                    </a>
                </div>

                <div className='row'>
                    <div id={searchBoxId} className='input-field col s6'>
                        <i className='material-icons prefix'>search</i>
                        <input
                        id={searchBoxId + '__input'}
                        type='text'
                        onChange={(event) => this.addFilter('searchedValue', event.target.value)}
                        value={this.state.filters.searchedValue || ''}
                        ></input>
                        <label htmlFor={searchBoxId + '__input'}>Cerca</label>
                    </div>
                    <div className='col s6'>
                    </div>
                </div>

                <div className='row'>
                    <div className={this.state.showTableDataInfo ? 'col s12' : 'hide'}>
                        <TableInfo
                        id={tableDataInfoId}
                        dataInfo={dataInfo}
                        ></TableInfo>
                    </div>
                </div>

                <div className='row'>

                    <div
                    className={(this.state.showFiltersMenu ? 'col s3' : 'hide')}
                    >
                        <FiltersMenu
                            id={filtersMenuId}
                            activeFilters={this.state.filters}
                            wallets={dataInfo.allWallets}
                            activities={dataInfo.allActivities}
                            maxAmount={dataInfo.allMaxAmount}
                            minAmount={dataInfo.allMinAmount}
                            onAddFilter={this.addFilter}
                        ></FiltersMenu>
                    </div>

                    <div
                        id={dataVisualizationId}
                        className={this.state.showFiltersMenu ? 'col s9' : 'col s12'}>
                            {dataVisualization}
                    </div>

                    <Calculator></Calculator>
                    
                    <EditActivity
                        id={Utils.modal('editActivity').id}
                        wallets={dataInfo.allWallets}
                        activity={dataInfo.allActivities}
                        activityToEdit={this.state.activityToEdit}
                        onSubmit={(editedActivity) => {
                            this.editActivity(editedActivity);
                            Utils.modal('editActivity').close();
                        }}
                    ></EditActivity>

                    <EditActivity
                        id={Utils.modal('newActivity').id}
                        wallets={dataInfo.allWallets}
                        activity={dataInfo.allActivities}
                        onSubmit={(newActivity) => {
                            this.addActivity(newActivity);
                            Utils.modal('newActivity').close();
                        }}
                    ></EditActivity>

                    <CalendarNote
                        notes={this.state.notes}
                        onChange={(newNote) => this.setStoreProp('notes', newNote)}
                    ></CalendarNote>

                    <ExportBox
                        data={this.state.data}
                    ></ExportBox>
                    
                </div>
            </div>
        );
    }
}