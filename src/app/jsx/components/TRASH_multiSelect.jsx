import React from 'react';

export default class MultiSelect extends React.Component {

    constructor(props){

        super(props);
        this.state = {
            optionsState: {},
            showOptions: false
        };
        var THAT = this;
        props.list.forEach(function(value, index){
            THAT.state['optionsState'][value] = false;
        });
        this.showOptions = this.showOptions.bind(this);
        this.setSelectedOption = this.setSelectedOption.bind(this);
        this.getSelectedOptions = this.getSelectedOptions.bind(this);
        
    }

    showOptions(){
        this.setState({
            'optionsState': this.state.optionsState,
            'showOptions': !this.state.showOptions
        });
    }

    setSelectedOption(option, e){
        var newerOptions = this.state.optionsState;
        newerOptions[option] = !newerOptions[option];
        this.setState({
            'optionsState': newerOptions
        })
    }

    getSelectedOptions(){
        var selected = [];
        for (var option in this.state.optionsState){
            if (this.state.optionsState[option] === true){
                selected.push(option);
            };
        }
        return selected;
    }

    render(){

        var THAT = this;
        var display = ( this.state.showOptions === true ? 'block' : 'none' );
        var inputValue = this.getSelectedOptions();

        var optionsList = [];
        for (var item in this.state.optionsState){
            optionsList.push(item);
        }
        var optionsListHTML = optionsList.map(function(value){
            var checked = (THAT.state['optionsState'][value] === true ? true : false);
            return (
                <li key={value.toString()}><label>
                    <input type='checkbox' onClick={(e) => THAT.setSelectedOption(value, e)} checked={checked}></input> 
                {value}</label></li>
            );
        });

        return(
            <div className='multi-select'>
                <div>
                    <input type='text' readOnly='true' value={inputValue}></input>
                    <button onClick={this.showOptions}><i className="fas fa-caret-down"></i></button>
                </div>
                <ul style={{'display': display}}>
                    {optionsListHTML}
                </ul>
            </div>
        );
    }

}