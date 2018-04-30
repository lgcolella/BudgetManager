import Storage from '../storage.js';
import Utils from './functions/utils.js';
import React from 'react';
import SideNav from './components/SideNav.jsx';
import FiltersMenu from './components/FiltersMenu.jsx';
import EditActivity from './components/EditActivity.jsx';
import { throttle } from 'rxjs/operator/throttle';

const sideNavId = 'sidenav';
const modalNewActivityId = 'new-activity-modal';
const editActivityModalId = 'edit-activity-modal';
const filtersMenuId = 'filters-menu';
const tableDataInfoId = 'table-data-info';
const tableOverviewId = 'table-overview';
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
            'filters': defaultStorage.getData().filters
        };
        this.importData = this.importData.bind(this);
        this.addActivity = this.addActivity.bind(this);
        this.editActivity = this.editActivity.bind(this);
        this.deleteActivity = this.deleteActivity.bind(this);
        this.addFilters = this.addFilters.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
        this.filterData = this.filterData.bind(this);
        this.sortColumns = this.sortColumns.bind(this);
        this.checkActivity = this.checkActivity.bind(this);
    }

    importData(data){
        this.setState({
            data: data,
            dataToRender: data
        });
        defaultStorage.setData({
            data,
            filters: this.state.filters
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
            filters: this.state.filters
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
            filters: this.state.filters
        });
    }

    deleteActivity(selectedActivity){

        function filterCb(object){
            return ( selectedActivity.id === object.id ? false : true );
        }

        var newData = this.state.data.filter(filterCb);
        this.setState({
            data: newData,
            dataToRender: this.state.dataToRender.filter(filterCb)
        });

        defaultStorage.setData({
            data: newData,
            filters: this.state.filters
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
            data: this.state.data,
            filters: newFilters
        });
        
    }

    clearFilters(){
        this.setState({
            filters: {}
        });
        defaultStorage.setData({
            data: this.state.data,
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

    sortColumns(event, dataToSort){

        const aLessThanB = (function toggleIconAndSetTypeOfSort(){
            var el = event.target;
            var elSimilars = document.querySelectorAll('#table-overview thead th i');
            var newIcon;
            var aMinusB;
            if ( el.innerText === 'sort' || el.innerText === 'arrow_drop_up' ){
                newIcon = 'arrow_drop_down';
                aMinusB = -1;
            } else if ( el.innerText === 'arrow_drop_down' ){
                newIcon = 'arrow_drop_up';
                aMinusB = 1;
            }
            Array.from(elSimilars).forEach(function(i){
                if (i === el){
                    el.innerText = newIcon;
                } else {
                    i.innerText = 'sort';
                }
            });
            return aMinusB;
        })();

        var columnIndex = (() => {
            var el = event.target;
            while (el.nodeName !== 'TH'){
                el = el.parentNode;
            }
            var index = 0;
            while (el.previousSibling !== null){
                el = el.previousSibling;
                index += 1;
            }
            return index;
        })();
        
        var valuesToSort = ((columnIndex) => {
            var values = [];
            var tableRows = document.querySelectorAll('#table-overview>tbody>tr');
            Array.from(tableRows).forEach(function(tr){
                Array.from(tr.childNodes).forEach(function(td, index){
                    if (index === columnIndex){
                        var value = ( td.innerText.indexOf('€') !== -1 ? Number(td.innerText.replace('€', '')) : td.innerText );
                        values.push(value);
                    }
                });
            });
            return values;
        })(columnIndex);

        var sortedValues = valuesToSort.sort(function(a, b){
            a = (typeof a === 'string' ? a.toLowerCase() : a);
            b = (typeof a === 'string' ? b.toLowerCase() : b);
            if (a < b){ return aLessThanB }
            else if (a > b){ return -aLessThanB }
            else { return 0 }
        });

        var sortedDataToRender = this.state.dataToRender.sort(function(obj1, obj2){

            var prop1 = obj1[dataToSort];
            var prop2 = obj2[dataToSort];
            if ( sortedValues.indexOf(prop1) < sortedValues.indexOf(prop2) ){ return -1 }
            else if ( sortedValues.indexOf(prop1) > sortedValues.indexOf(prop2) ){ return 1 }
            else { return 0 }

        });

        this.setState({
            dataToRender: sortedDataToRender
        });

    }

    checkActivity(event){
        var data = this.state.data;
        var inputValue = event.target.value;

        if (inputValue === 'all'){
            var data = data.map((activity) => {
                activity['selected'] = event.target.checked;
                return activity;
            });
        } else {
            var id = Number(inputValue);
            var data = data.map((activity) => {
                if (activity.id === id){
                    activity['selected'] = event.target.checked;
                }
                return activity;
            });
        }
        
        this.setState({
            data
        });
    }

    componentDidMount(){
        var elem = document.querySelectorAll('.tooltipped');
        M.Tooltip.init(elem);
    }

    componentDidUpdate(){
        var elem = document.querySelectorAll('.tooltipped');
        M.Tooltip.init(elem);
    }

    render() {
        var data = this.state.data;
        var dataToRender = this.filterData();
        var dataInfo = Utils.getDataInfo(data, dataToRender);

        let tbodyHTML = dataToRender.map((object) => {

            var type = (Number(object.amount) > 0 ? <i className='material-icons green-text'>arrow_upward</i> : <i className='material-icons red-text'>arrow_downward</i> );
            var selected = (typeof object.selected === 'undefined' ? true : object.selected );

            return (
                <tr key={object.id}>
                    <td>{type}</td>
                    <td>
                        <label>
                            <input type="checkbox" value={object.id} checked={selected} onChange={(event) => this.checkActivity(event)}></input>
                            <span></span>
                        </label>
                    </td>
                    <td>{object.wallet}</td>
                    <td>{object.activity}</td>
                    <td><i>{object.amount.toString() + '€'}</i></td>
                    <td><i>{object.date}</i></td>
                    {/*<td>{object.fromDate}</td>
                    <td>{object.toDate}</td>*/}
                    <td>
                        <div>
                            <a href='#!'><i className='material-icons tooltipped' data-position="top" data-tooltip={object.comment}>comment</i></a>
                            <a href='#!'><i className='material-icons modal-trigger' data-target={editActivityModalId}
                                onClick={() => {this.setState({activityToEdit: object})}}>edit</i>
                            </a>
                            <a href='#!'><i className='material-icons hover-red' onClick={() => this.deleteActivity(object)}>delete</i></a>
                        </div>
                    </td>
                </tr>
            );
        });

        return (
            <div>
                <SideNav
                    id={sideNavId}
                    allData={this.state.data}
                    wallets={dataInfo.allWallets}
                    activity={dataInfo.allActivities}
                    modalNewActivityId={modalNewActivityId}
                    tableDataInfoId={tableDataInfoId}
                    tableOverviewId={tableOverviewId}
                    filtersMenuId={filtersMenuId}
                    onAddActivity={this.addActivity}
                    onImportData={this.importData}
                    onClearFilters={this.clearFilters}
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
                        placeholder={( typeof this.state.filters !== 'undefined' && typeof this.state.filters.searchedValue !== 'undefined' ? this.state.filters.searchedValue : '')}
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
                        <table id={tableOverviewId} className='highlight centered'>
                            <thead>
                            <tr>
                                <th></th>
                                <th>
                                    <div>
                                        <label>
                                            <input type="checkbox" value={'all'} defaultChecked={true} onClick={(event) => this.checkActivity(event)}></input>
                                            <span></span>
                                        </label>
                                    </div>
                                </th>
                                <th> Portafoglio <i className='material-icons' onClick={(event) => this.sortColumns(event, 'wallet')}>sort</i></th>
                                <th>Attività <i className='material-icons' onClick={(event) => this.sortColumns(event, 'activity')}>sort</i></th>
                                <th>Importo <i className='material-icons' onClick={(event) => this.sortColumns(event, 'amount')}>sort</i></th>
                                <th>Data <i className='material-icons' onClick={(event) => this.sortColumns(event, 'date')}>sort</i></th>
                                <td>
                                    <div>
                                        <i className='material-icons' onClick={() => {M.Modal.getInstance(document.getElementById(modalNewActivityId)).open();}}>add_shopping_cart</i>
                                    </div>
                                </td>
                            </tr>
                            </thead>
                            <tbody>
                                {tbodyHTML}
                            </tbody>
                        </table>
                    </div>
                    <EditActivity
                        id={editActivityModalId}
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