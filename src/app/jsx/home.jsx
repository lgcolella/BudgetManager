import React from 'react';
import {SideNav, SideNavButton} from './components/sideNav.jsx';
import FiltersMenu from './components/FiltersMenu.jsx';
/*import MultiSelect from './components/multiSelect.jsx';
import RangeInput from './components/rangeInput.jsx';*/

function getData(){
    return [
        { wallet: 'Casa', activity: 'Ricarica Cell', amount: 40,date:'2016-05-18' , fromDate: '2016-05-18',toDate: '2018-12-05' , period: '2 anni'},
        { wallet: 'Casa', activity: 'Gas', amount: -270,date:'2017-07-07' , fromDate: '2017-05-18', toDate: '2018-12-05' , period: '1 anni'},
        { wallet: 'Lavoro', activity: 'Stampante', amount: 67, date:'2017-05-14' , fromDate: '',toDate: '' , period: ''},
        { wallet: 'Hobby', activity: 'Libro', amount: -12,date:'2018-01-05' , fromDate: '2016-02-19',toDate: '2018-12-05' , period: '2 anni'},
        { wallet: 'Amici', activity: 'Pizza', amount: -2,date:'2017-12-18' , fromDate: '2016-05-18', toDate: '2018-12-05' , period: '1 anni'},
        { wallet: 'Hobby', activity: 'Vittoria concorso', amount: +107, date:'2018-01-14' , fromDate: '',toDate: '' , period: ''},

    ];
};

var Utils = {

    getAllValuesOfProperty: function(objectsList, property, distinct){
        var result = [];
        objectsList.forEach(function(object, index){
            var value = object[property];
            if ( distinct === true || result.indexOf(value) === -1 ){
                result.push(value);
            };
        });
        return result;
    },

    getSumfromArray: function(array){
        var sum = 0;
        array.forEach(function(value){
            sum += Number(value);
        });
        return sum;
    },

    getMinAndMaxFromArray: function(array){
        var min = 0;
        var max = 0;
        array.forEach(function(value){
            value = Number(value);
            min = Math.min(min, value);
            max = Math.max(max, value);
        });
        return {
            min,
            max
        };
    },

    getIndexOfObjInArray: function(searchedObj, array){

        for (let object in array){
            var result = true;
            for (let property  in searchedObj){
                var cond = searchedObj.hasOwnProperty(property) && searchedObj[property] === array[object][property] /*&& JSON.stringify(array[object]).length === JSON.stringify(searchedObj).length*/;
                if (cond===true){
                    var index = Number(object);
                } else {
                    result = false;
                }
            }

            if (result === true){
                return index;
            };
        }

        return -1;

    }



};

export default class Home extends React.Component {

    constructor(props){
        super(props);
        var data = getData();
        this.state = {
            'data': data,
            'dataToRender': data
        };
        this.filterData = this.filterData.bind(this);
        this.addActivity = this.addActivity.bind(this);
        this.deleteActivity = this.deleteActivity.bind(this);
    }

    addActivity(newActivity){

        var result = true;
        var indexInData = Utils.getIndexOfObjInArray(newActivity, this.state.data);
        if (typeof this.state.data[indexInData] !== 'undefined'){
            result = false;
        }
        /*this.state.data.forEach(function(object){
            var wallets = object.wallet === newActivity.wallet;
            var activities = object.activity === newActivity.activity;
            var amount = object.amount === newActivity.amount;
            var date = object.date === newActivity.date;

            if (wallets && activities && amount && date){
                result = false;
            }
        });*/

        if (result){
            this.setState({
                data: this.state.data.concat(newActivity),
                dataToRender: this.state.data.concat(newActivity)
            });
        } else {
            return result;
        };
        
    }

    filterData(filters){
        /*console.table(filters);
        console.table(this.state.data);*/

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
            

            var result = walletCond && activityCond && minAmountCond && maxAmountCond && dataCond;
            return result;
        });
        this.setState({
            dataToRender
        });
    }

    deleteActivity(selectedActivity){
        var data = this.state.data;
        var dataToRender = this.state.dataToRender;

        var indexInData = Utils.getIndexOfObjInArray(selectedActivity, data);
        if (typeof data[indexInData] !== 'undefined'){
            data.splice(indexInData, 1);
        }
        var indexInDataToRender = Utils.getIndexOfObjInArray(selectedActivity, dataToRender);
        if (typeof dataToRender[indexInDataToRender] !== 'undefined'){
            var a = dataToRender.splice(indexInDataToRender, 1);
        }
        console.log(data, indexInData);
        this.setState({
            data,
            dataToRender
        });
    }

    render() {

        var data = this.state.data;
        //console.table(data);
        var dataToRender = this.state.dataToRender;

        var dataInfo = {
            wallets: Utils.getAllValuesOfProperty(data, 'wallet', false),
            activity: Utils.getAllValuesOfProperty(data, 'activity', false),
            minAmount: Utils.getMinAndMaxFromArray( Utils.getAllValuesOfProperty(data, 'amount') ).min,
            maxAmount: Utils.getMinAndMaxFromArray( Utils.getAllValuesOfProperty(data, 'amount') ).max,
        };
        let tbodyHTML = dataToRender.map((object) => {

            var type = (Number(object.amount) > 0 ? <i className='material-icons green-text'>arrow_upward</i> : <i className='material-icons red-text'>arrow_downward</i> );
            var reactKey = object.wallet + object.activity + object.amount.toString() + object.date;
        
            return (
                <tr key={reactKey}>
                    <td>{type}</td>
                    <td>{object.wallet}</td>
                    <td>{object.activity}</td>
                    <td>{object.amount.toString() + '€'}</td>
                    <td>{object.date}</td>
                    {/*<td>{object.fromDate}</td>
                    <td>{object.toDate}</td>*/}
                    <td><a href='#!'><i className='material-icons red-text' onClick={() => this.deleteActivity(object)}>delete</i></a></td>
                </tr>
            );
        });
        
        function getBalance(){
            var amounts = Utils.getAllValuesOfProperty(dataToRender, 'amount', true);
            var sum = Utils.getSumfromArray(amounts);
            return sum.toString();
        }; 

        return (
            <div>
                <SideNav wallets={dataInfo.wallets} activity={dataInfo.activity} onAddActivity={this.addActivity}></SideNav>
                <SideNavButton></SideNavButton>
                <div className='row'>
                    <div className='col s12'>
                        <h4 className='right'>Saldo: {getBalance()}€</h4>
                    </div>
                </div>
                <div className='divider'></div>
                <div className='row'>
                    <div className='col s9'>
                        <table className='highlight centered'>
                            <thead>
                            <tr>
                                <th></th>
                                <th>Portafoglio</th>
                                <th>Attività</th>
                                <th>Importo</th>
                                <th>Data</th>
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
                        <FiltersMenu dataInfo={dataInfo} onChange={this.filterData}></FiltersMenu>
                    </div>
                </div>
            </div>
        );
    }
}