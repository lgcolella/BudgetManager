import Storage from '../storage.js';
import Utils from './functions/utils.js';
import React from 'react';
import {SideNav, SideNavButton} from './components/sideNav.jsx';
import FiltersMenu from './components/FiltersMenu.jsx';
import EditActivity from './components/EditActivity.jsx';
import { throttle } from 'rxjs/operator/throttle';

const editActivityModalId = 'edit-activity-modal';
var defaultStorage = new Storage();

/*function getData(){
    return [
        { wallet: 'Casa', activity: 'Ricarica Cell', amount: 40,date:'2016-05-18' , fromDate: '2016-05-18',toDate: '2018-12-05' , period: '2 anni'},
        { wallet: 'Casa', activity: 'Gas', amount: -270,date:'2017-07-07' , fromDate: '2017-05-18', toDate: '2018-12-05' , period: '1 anni'},
        { wallet: 'Lavoro', activity: 'Stampante', amount: 67, date:'2017-05-14' , fromDate: '',toDate: '' , period: ''},
        { wallet: 'Hobby', activity: 'Libro', amount: -12,date:'2018-01-05' , fromDate: '2016-02-19',toDate: '2018-12-05' , period: '2 anni'},
        { wallet: 'Amici', activity: 'Pizza', amount: -2,date:'2017-12-18' , fromDate: '2016-05-18', toDate: '2018-12-05' , period: '1 anni'},
        { wallet: 'Hobby', activity: 'Vittoria concorso', amount: +107, date:'2018-01-14' , fromDate: '',toDate: '' , period: ''},

    ];
};*/

export default class Home extends React.Component {

    constructor(props){
        super(props);
        var data = defaultStorage.getData();
        this.state = {
            'id': 'homepage',
            'data': data,
            'dataToRender': data,
            'activityToEdit': undefined,
            'filters': undefined
        };
        this.importData = this.importData.bind(this);
        this.addActivity = this.addActivity.bind(this);
        this.editActivity = this.editActivity.bind(this);
        this.deleteActivity = this.deleteActivity.bind(this);
        this.addFilters = this.addFilters.bind(this);
        this.filterData = this.filterData.bind(this);
        this.sortColumns = this.sortColumns.bind(this);
        this.checkActivity = this.checkActivity.bind(this);
    }

    importData(data){
        this.setState({
            data: data,
            dataToRender: data
        });
        defaultStorage.setData(data);
    }

    addActivity(newActivity){

        var idList = Utils.getAllValuesOfProperty(this.state.data, 'id');
        var id = Utils.generateId(idList);
        
        newActivity['id'] = id;
        var newData = this.state.data.concat(newActivity);
        this.setState({
            data: newData,
            dataToRender: newData
        });
        defaultStorage.setData(newData);
        
    }

    editActivity(editedActivity){
        
        function mapCb(object){
            return (editedActivity.id === object.id ? editedActivity : object);
        };
        var newData = this.state.data.map(mapCb);

        this.setState({
            data: newData,
            dataToRender: this.state.data.map(mapCb),
        });
        defaultStorage.setData(newData);
    }

    deleteActivity(selectedActivity){

        function filterCb(object){
            return ( selectedActivity.id === object.id ? false : true );
        };

        var newData = this.state.data.filter(filterCb);
        this.setState({
            data: newData,
            dataToRender: this.state.dataToRender.filter(filterCb)
        });

        defaultStorage.setData(newData);
    }

    addFilters(filters, event){


        if (filters === 'searchedValue'){
            var filters = (typeof this.state.filters === 'undefined' ? {} : this.state.filters);
            filters['searchedValue'] = event.target.value;
        } else {
            var oldFilters = (typeof this.state.filters === 'undefined' ? {} : this.state.filters);
            if (oldFilters.hasOwnProperty('searchedValue')){
                filters['searchedValue'] = oldFilters['searchedValue'];
            }
        }
        
        this.setState({
            filters
        });
    }

    filterData(){
        
        if (typeof this.state.filters === 'undefined'){
            return this.state.dataToRender;
        } else {
            var filters = this.state.filters;
        }
        //console.table(filters);
        //console.table(this.state.data);

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
                    result = ( value !== NaN ? true : false );
                break;

                case 'object':
                    if ( objectType === 'Array' && value instanceof Array ){
                        result = ( value.length > 0 ? true : false);
                    } else if ( objectType === 'Date' && value instanceof Date ){
                        result = ( value.toString() !== 'Invalid Date' ? true : false);
                    }
                break;

            };
            return result;
        };

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
                    };
                } else {
                    result = true;
                };

                return result;
            })();
            var searchedValueCond = (function(){
                if (check(filters.searchedValue)){
                    var searchedValue = filters.searchedValue.toLowerCase();
                    var valueFoundInWallet = object.wallet.toLowerCase().indexOf(searchedValue) !== -1;
                    var valueFoundInActivity = object.activity.toLowerCase().indexOf(searchedValue) !== -1;
                    var valueFoundInAmount = object.amount.toString().indexOf(searchedValue) !== -1;
                    var valueFoundInDate = object.date.indexOf(searchedValue) !== -1;
                    return valueFoundInWallet || valueFoundInActivity || valueFoundInAmount || valueFoundInDate;
                } else {
                    return !check(searchedValue);
                };
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
            if ( el.innerText === 'sort' || el.innerText === 'arrow_drop_up' ){
                var newIcon = 'arrow_drop_down';
                var aMinusB = -1;
            } else if ( el.innerText === 'arrow_drop_down' ){
                var newIcon = 'arrow_drop_up';
                var aMinusB = 1;
            };
            Array.from(elSimilars).forEach(function(i, index){
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
            };
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
            Array.from(tableRows).forEach(function(tr, index){
                Array.from(tr.childNodes).forEach(function(td, index){
                    if (index === columnIndex){
                        var value = ( td.innerText.indexOf('€') !== -1 ? Number(td.innerText.replace('€', '')) : td.innerText );
                        values.push(value);
                    };
                });
            });
            return values;
        })(columnIndex);

        var sortedValues = valuesToSort.sort(function(a, b){
            a = (typeof a === 'string' ? a.toLowerCase() : a);
            b = (typeof a === 'string' ? b.toLowerCase() : b);
            if (a < b){ return aLessThanB }
            else if (a > b){ return -aLessThanB }
            else { return 0 };
        });

        var sortedDataToRender = this.state.dataToRender.sort(function(obj1, obj2){

            var prop1 = obj1[dataToSort];
            var prop2 = obj2[dataToSort];
            if ( sortedValues.indexOf(prop1) < sortedValues.indexOf(prop2) ){ return -1 }
            else if ( sortedValues.indexOf(prop1) > sortedValues.indexOf(prop2) ){ return 1 }
            else { return 0 };

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
                };
                return activity;
            });
        };
        
        this.setState({
            data
        });
    }

    render() {
        var data = this.state.data;
        var dataToRender = this.filterData();

        var dataInfo = {
            wallets: Utils.getAllValuesOfProperty(data, 'wallet', false),
            activity: Utils.getAllValuesOfProperty(data, 'activity', false),
            minAmount: Utils.getMinAndMaxFromArray( Utils.getAllValuesOfProperty(data, 'amount') ).min,
            maxAmount: Utils.getMinAndMaxFromArray( Utils.getAllValuesOfProperty(data, 'amount') ).max,
        };
        let tbodyHTML = dataToRender.map((object) => {

            var type = (Number(object.amount) > 0 ? <i className='material-icons green-text'>arrow_upward</i> : <i className='material-icons red-text'>arrow_downward</i> );
            var selected = (typeof object.selected === 'undefined' ? false : object.selected );
            
            return (
                <tr key={object.id}>
                    <td>
                        <label>
                            <input type="checkbox" value={object.id} checked={selected} onChange={(event) => this.checkActivity(event)}></input>
                            <span></span>
                        </label>
                    </td>
                    <td>{type}</td>
                    <td>{object.wallet}</td>
                    <td>{object.activity}</td>
                    <td>{object.amount.toString() + '€'}</td>
                    <td>{object.date}</td>
                    {/*<td>{object.fromDate}</td>
                    <td>{object.toDate}</td>*/}
                    <td>
                        <a href='#!'><i className='material-icons delete' onClick={() => this.deleteActivity(object)}>delete</i></a>
                        <a href='#!'><i className='material-icons modal-trigger' data-target={editActivityModalId}
                        onClick={() => {this.setState({activityToEdit: object})}}>edit</i></a>
                    </td>
                </tr>
            );
        });
        
        function getBalance(){
            var selectedDataToRender = dataToRender.filter(function(activity){
                return activity['selected'];
            });
            var amounts = Utils.getAllValuesOfProperty(selectedDataToRender, 'amount', true);
            var sum = Utils.getSumfromArray(amounts);
            return sum.toFixed(2).toString();
        }; 

        return (
            <div>
                <SideNav allData={this.state.data} wallets={dataInfo.wallets} activity={dataInfo.activity} onAddActivity={this.addActivity} onImportData={this.importData}></SideNav>
                <SideNavButton></SideNavButton>
                <div className='row'>
                    <div className='input-field col s6'>
                        <i className='material-icons prefix'>search</i>
                        <input id={this.state.id + '__search-input'} type='text' onKeyUp={(event) => this.addFilters('searchedValue', event)}></input>
                        <label htmlFor={this.state.id + '__search-input'}>Cerca</label>
                    </div>
                    <div className='col s6'>
                        <h4 className='right'>Saldo: {getBalance()}€</h4>
                    </div>
                </div>
                <div className='divider'></div>
                <div className='row'>
                    <div className='col s9'>
                        <table id='table-overview' className='highlight centered'>
                            <thead>
                            <tr>
                                <th>
                                    <label>
                                        <input type="checkbox" value={'all'} onClick={(event) => this.checkActivity(event)}></input>
                                        <span></span>
                                    </label>
                                </th>
                                <th></th>
                                <th>Portafoglio <i className='material-icons' onClick={(event) => this.sortColumns(event, 'wallet')}>sort</i></th>
                                <th>Attività <i className='material-icons' onClick={(event) => this.sortColumns(event, 'activity')}>sort</i></th>
                                <th>Importo <i className='material-icons' onClick={(event) => this.sortColumns(event, 'amount')}>sort</i></th>
                                <th>Data <i className='material-icons' onClick={(event) => this.sortColumns(event, 'date')}>sort</i></th>
                                {/*<th>Da</th>
                                <th>A</th>*/}
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                                {tbodyHTML}
                            </tbody>
                        </table>
                    </div>
                    <div className='col s3'>
                        <FiltersMenu dataInfo={dataInfo} onChange={this.addFilters}></FiltersMenu>
                    </div>
                    <EditActivity
                        id={editActivityModalId}
                        wallets={dataInfo.wallets}
                        activity={dataInfo.activity}
                        activityToEdit={this.state.activityToEdit}
                        onSubmit={this.editActivity}
                    ></EditActivity>
                </div>
            </div>
        );
    }
}