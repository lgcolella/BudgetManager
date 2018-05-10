import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ChromePicker } from 'react-color';

export default class Chart extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            id: this.props.id,
            chartWidth: 0,
            backgroundColor: window.getComputedStyle( document.body ,null).getPropertyValue('background-color'),
            colorPicker: {
                visible: false
            }
        }
        this.adjustWidth = this.adjustWidth.bind(this);
        this.createDataset = this.createDataset.bind(this);
        this.openColorPicker = this.openColorPicker.bind(this);
        this.closeColorPicker = this.closeColorPicker.bind(this);
        this.setWalletColor = this.setWalletColor.bind(this);
    }

    adjustWidth(){
        var componentWidth = document.getElementById(this.state.id).clientWidth / 100 * 90;
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

    openColorPicker(legendItem, index, event){
        event.stopPropagation();
        var wallet = legendItem.dataKey;
        var positionLeft = parseInt(event.target.getBoundingClientRect().left); + 'px';
        var positionTop = parseInt(event.target.getBoundingClientRect().top + 30); + 'px';
        this.setState({
            colorPicker: {
                visible: true,
                selectedWallet: wallet,
                style: {
                    'position': 'absolute',
                    'top': positionTop,
                    'left': positionLeft,
                    'zIndex': 1000
                }
            }
        }, () => {
            window.addEventListener('click', this.closeColorPicker);
        })
    }

    closeColorPicker(event){
        if (this.state.colorPicker.visible){
            var colorPicker = document.querySelector('#'+ this.state.id + ' div.chrome-picker');
            if (!colorPicker.contains(event.target)){
                event.stopPropagation();
                this.setState({
                    colorPicker: { visible: false }
                }, () => {
                    window.removeEventListener('click', this.closeColorPicker);
                });
            }
        }
    }

    setWalletColor(color){
        var wallet = this.state.colorPicker.selectedWallet;
        var newWalletsColors = Object.assign({}, this.props.walletsColors, {
            [wallet]: color.hex
        });
        this.props.onChangeWalletsColors(newWalletsColors);
    }

    componentDidMount(){
        this.adjustWidth();
        window.addEventListener('resize', this.adjustWidth);
    }

    componentWillUnmount(){
        window.removeEventListener('resize', this.adjustWidth);
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
                        stroke={this.props.walletsColors[wallet] || '#fff'}
                        strokeWidth='3px'
                        connectNulls={true}
                        formatter={(value, name, props) => {return value + '€'}}
                        key={wallet}
                        />
                    );
                })
            );

        })();

        var colorPicker = (() => {
            if (this.state.colorPicker.visible){
                var wallet = this.state.colorPicker.selectedWallet;
                return (
                    <div style={this.state.colorPicker.style}>
                        <ChromePicker
                            color={this.props.walletsColors[wallet]}
                            onChangeComplete={this.setWalletColor}
                        />
                    </div>
                )
            } else {
                return null;
            }
        })();

        return(
            <div id={this.state.id}>
                <div className='row'>
                    <div className='col s12'>
                        {colorPicker}
                        <LineChart width={this.state.chartWidth} height={400} data={this.createDataset(dataToRender)}>
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                            <XAxis
                            dataKey='date'
                            tickFormatter={(value) => {
                                var options = { year: 'numeric', month: 'short' };
                                return new Date(value).toLocaleDateString('it-IT', options);
                            }}
                            />
                            <YAxis tickFormatter={(value) => {return value + '€';}}
                            />
                            <Tooltip wrapperStyle={{backgroundColor: this.state.backgroundColor}}/>
                            <Legend verticalAlign='top' wrapperStyle={{top: '-5px'}} onClick={this.openColorPicker}/>
                            {lines}
                        </LineChart>
                    </div>
                </div>
            </div>
        );
    }

}