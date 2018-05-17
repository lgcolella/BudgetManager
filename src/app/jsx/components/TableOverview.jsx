import React from 'react';
import PropTypes from 'prop-types';
import Pagination from '../elements/Pagination.jsx';

export default class TableOverview extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            id: this.props.id,
            tableId: this.props.id + '__table',
            elementsInPaginationGroup: 8
        }
        this.getTHead = this.getTHead.bind(this);
        this.getTbody = this.getTbody.bind(this);
        this.deleteActivity = this.deleteActivity.bind(this);
        this.sortColumns = this.sortColumns.bind(this);
        this.checkActivity = this.checkActivity.bind(this);
        this.changePaginationGroup = this.changePaginationGroup.bind(this);
        this.changeDisplayedElements = this.changeDisplayedElements.bind(this);
    }

    getTHead(){
        return(
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
                <th>Portafoglio <i className='material-icons' onClick={(event) => this.sortColumns(event, 'wallet')}>sort</i></th>
                <th>Attività <i className='material-icons' onClick={(event) => this.sortColumns(event, 'activity')}>sort</i></th>
                <th>Importo <i className='material-icons' onClick={(event) => this.sortColumns(event, 'amount')}>sort</i></th>
                <th>Data <i className='material-icons' onClick={(event) => this.sortColumns(event, 'date')}>sort</i></th>
                <td>
                    <div>
                        <i className='material-icons' onClick={this.props.openNewActivity}>add_shopping_cart</i>
                    </div>
                </td>
            </tr>
        );
    }

    getTbody(data){
        return data.map((object) => {

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
                    <td>
                        <div>
                            <a href='#!'><i className='material-icons tooltipped' data-position="top" data-tooltip={object.comment}>comment</i></a>
                            <a href='#!'><i className='material-icons'
                                onClick={() => {
                                    this.props.openEditActivity(object);
                                }}>edit</i>
                            </a>
                            <a href='#!'><i className='material-icons hover-red' onClick={() => this.deleteActivity(object)}>delete</i></a>
                        </div>
                    </td>
                </tr>
            );
        });
    }

    deleteActivity(selectedActivity){

        function filterCb(object){
            return ( selectedActivity.id === object.id ? false : true );
        }

        var newData = this.props.data.filter(filterCb);
        this.props.onChangeData(newData);
    }

    sortColumns(event, dataToSort){

        const aLessThanB = (() => {
            var el = event.target;
            var elSimilars = document.querySelectorAll('#'+this.state.tableId+' thead th i');
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
            var tableRows = document.querySelectorAll('#'+this.state.tableId+'>tbody>tr');
            Array.from(tableRows).forEach((tr) => {
                Array.from(tr.childNodes).forEach((td, index) => {
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

        var sortedData = this.props.data.sort(function(obj1, obj2){

            var prop1 = obj1[dataToSort];
            var prop2 = obj2[dataToSort];
            if ( sortedValues.indexOf(prop1) < sortedValues.indexOf(prop2) ){ return -1 }
            else if ( sortedValues.indexOf(prop1) > sortedValues.indexOf(prop2) ){ return 1 }
            else { return 0 }

        });

        this.props.onChangeData(sortedData);

    }

    checkActivity(event){
        var data = this.props.data;
        var inputValue = event.target.value;

        if (inputValue === 'all'){
            data = data.map((activity) => {
                activity['selected'] = event.target.checked;
                return activity;
            });
        } else {
            var id = Number(inputValue);
            data = data.map((activity) => {
                if (activity.id === id){
                    activity['selected'] = event.target.checked;
                }
                return activity;
            });
        }
        
        this.props.onChangeData(data);
    }

    changeDisplayedElements(groupNum){
        var elementsInPaginationGroup = Number(this.state.elementsInPaginationGroup);
        if (groupNum === 'all' || isNaN(elementsInPaginationGroup) || elementsInPaginationGroup === 0){
            var hiddenRows = document.querySelectorAll('#'+this.state.tableId+'>tbody>tr.hide');
            if (hiddenRows !== null);
            hiddenRows.forEach((row) => {
                row.classList.remove('hide');
            });
        } else {
            var rows = document.querySelectorAll('#'+this.state.tableId+'>tbody>tr');
            rows.forEach((row, index) => {
                if (groupNum - 1 <= index/elementsInPaginationGroup && index/elementsInPaginationGroup < groupNum){
                    row.classList.remove('hide');
                } else {
                    row.classList.add('hide');
                }
            });
        }

    }

    changePaginationGroup(event){
        var value = event.target.value;
        if (value > 0){
            this.setState({
                elementsInPaginationGroup: value
            }, () => {
                var activeButton = document.querySelector('#table-overview-pagination li.active');
                if (activeButton !== null){
                    activeButton.classList.remove('active');
                }
                document.querySelectorAll('#table-overview-pagination li')[1].classList.add('active');
                this.changeDisplayedElements(1);
            });
        } else {
            this.setState({
                elementsInPaginationGroup: ''
            }, () => {
                this.changeDisplayedElements('all');
            });
        }
    }

    componentDidMount(){
        var elem = document.querySelectorAll('.tooltipped');
        M.Tooltip.init(elem);
        this.changeDisplayedElements(1);
    }

    componentDidUpdate(){
        var elem = document.querySelectorAll('.tooltipped');
        M.Tooltip.init(elem);
        this.changeDisplayedElements(1);
    }

    render(){

        var tBodyJSX = this.getTbody(this.props.dataToRender);

        return(
            <div id={this.state.id}>
                <div id='pagination-wrapper' className='row'>
                    <div id='pagination-choice' className='col s3'>
                        <label>Risultati per pagina</label>
                        <input type='number' value={this.state.elementsInPaginationGroup} onChange={(event) => this.changePaginationGroup(event)}></input> 
                    </div>
                    <div className='col s9'>
                        <Pagination
                        elementsInGroup={this.state.elementsInPaginationGroup}
                        elementsNum={this.props.dataToRender.length}
                        onChange={this.changeDisplayedElements}
                        ></Pagination>
                    </div>
                </div>
                <div className='row'>
                    <div className='col s12'>
                        <table id={this.state.tableId} className='highlight centered'>
                            <thead>
                                {this.getTHead()}
                            </thead>
                            <tbody>
                                {tBodyJSX}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );

    }

}

TableOverview.propTypes = {
    id: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    dataToRender: PropTypes.array.isRequired,
    openEditActivity: PropTypes.func.isRequired,
    openNewActivity: PropTypes.func.isRequired,
    onChangeData: PropTypes.func.isRequired
}