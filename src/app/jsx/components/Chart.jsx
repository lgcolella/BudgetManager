import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default class Chart extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            id: this.props.id,
            chartWidth: 0,
            backgroundColor: window.getComputedStyle( document.body ,null).getPropertyValue('background-color')
        }
        this.adjustWidth = this.adjustWidth.bind(this);
        this.createDataset = this.createDataset.bind(this);
    }

    adjustWidth(){
        var componentWidth = document.getElementById(this.state.id).clientWidth / 100 * 88;
        this.setState({
            chartWidth: componentWidth
        });
    }

    createDataset(data){
        /*var dataset2 = [
            {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
            {name: 'Page B', uv: 3000, pv: 3790, amt: 2210},
            {name: 'Page B', uv: 3000, pv: 4000, amt: 2210},
            {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
            {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
            {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
            {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
            {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
        ];*/
        var dataForDate = (() => {
            var result = {};
            data.forEach((obj) => {
                var date = obj.date.slice(0,7);
                var amount = obj.amount;
                if (!result.hasOwnProperty(date)){
                    result[date] = { [obj.wallet] : amount };
                } else {
                    if (!result[date].hasOwnProperty(obj.wallet)){
                        result[date][obj.wallet] = amount;
                    } else {
                        result[date][obj.wallet] = result[date][obj.wallet] + amount;
                    }
                }
            });
            return result;
        })();

        var dataset = (() => {
            var result = [];
            for (let date in dataForDate){
                var obj = { 'date': date };
                for (let wallet in dataForDate[date]){
                    obj[wallet] = dataForDate[date][wallet];
                }
                result.push(obj);
            }
            result = result.sort((a, b) => {
                return new Date(a['date']) - new Date(b['date'])
            });
            return result;
        })();

        return dataset;
    }

    componentDidMount(){
        this.adjustWidth();
        window.addEventListener('resize', this.adjustWidth);
    }

    render(){

        var dataToRender = this.props.dataToRender;
        var lines = (() => {
            var wallets = (() => {
                var result = [];
                dataToRender.forEach((activity) => {
                    if (result.indexOf(activity.wallet) === -1){
                        result.push(activity.wallet);
                    }
                });
                return result;
            })();
            
            return (
                wallets.map((wallet) => {
                    return (
                        <Line
                        type='monotone'
                        dataKey={wallet}
                        stroke={'#' + Math.random().toFixed(6).slice(2)}
                        strokeWidth='3px'
                        connectNulls={true}
                        formatter={(value, name, props) => {return value + '€'}}
                        key={wallet}
                        />
                    );
                })
            );

        })();

        return(
            <div id={this.state.id}>
                <div className='row'>
                    <div className='col s12'>
                        <LineChart width={this.state.chartWidth} height={400} data={this.createDataset(dataToRender)}>
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                            <XAxis dataKey='date'/>
                            <YAxis />
                            <Tooltip wrapperStyle={{backgroundColor: this.state.backgroundColor}}/>
                            <Legend verticalAlign='top' wrapperStyle={{top: '-5px'}}/>
                            {lines}
                        </LineChart>
                    </div>
                </div>
            </div>
        );
    }

}