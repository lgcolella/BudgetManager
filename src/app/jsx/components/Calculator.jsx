import React from 'react';

export default class Calculator extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            prevNum: 0,
            currentNum: 0,
            currentOp: '+',
            MAX_NUM_LENGTH: 10
        };
        this.handleNumberClick = this.handleNumberClick.bind(this);
        this.handleOperationClick = this.handleOperationClick.bind(this);
    }

    handleNumberClick(event){
        var num = event.target.value;
        this.setState({
            currentNum: Number(this.state.currentNum + num)
        });
    }

    handleOperationClick(event){

        var prevNum = Number(this.state.prevNum);
        var currentNum = Number(this.state.currentNum);
        var prevOp = this.state.currentOp;
        var currentOp = event.target.value;

        function mathEval(number1, number2, operation){

            switch (operation.trim()){

                case '+':
                    return number1 + number2;
                break;
    
                case '-':
                    return number1 - number2;
                break;
    
                case '*':
                    return number1 * number2;
                break;
    
                case '/':
                    return number1 / number2;
                break;
    
                case '%':
                    return number1 / 100 * number2;
                break;
    
            };

            
        }
        

        switch(currentOp){

            case '.':
                if (currentNum.toString().indexOf('.') === -1){
                    currentNum = currentNum + '.';
                }
                currentOp = prevOp;
            break;

            case 'c':
                currentNum = 0;
                currentOp = prevOp;
            break;

            case 'ac':
                prevNum = 0;
                currentNum = 0;
                currentOp = '+';
            break;

            case '%':
                currentNum = ( prevNum - mathEval(prevNum, currentNum, currentOp) );
                currentOp = prevOp;
            break;

            case '=':
                prevNum = mathEval(prevNum, currentNum, prevOp);
                currentNum = 0;
                currentOp = prevOp;
            break;

            default:
                if ( !isNaN(currentNum) && currentNum !== 0 ){
                    prevNum = mathEval(prevNum, currentNum, prevOp);
                    currentNum = 0;
                }
                currentOp = currentOp;
            break;
        }

        this.setState({
            prevNum,
            currentNum,
            currentOp
        });

    }
    
    render(){

        var maxLength = this.state.MAX_NUM_LENGTH;
        var leftNumber = ( Number(this.state.prevNum) === 0 ?  this.state.currentNum.toString().slice(0, maxLength) : this.state.prevNum.toString().slice(0, maxLength));
        var rightNumber = ( Number(this.state.prevNum) === 0 ?  this.state.prevNum.toString().slice(0, maxLength) : this.state.currentNum.toString().slice(0, maxLength));

        return(
            <div>
                <h4>Calcolatrice</h4>
                <div>
                    <div className='row'>
                        <div className='col s5'><input type='text' value={leftNumber} className='center-align' readOnly></input></div>
                        <div className='col s2'><p className='center-align'>{this.state.currentOp}</p></div>
                        <div className='col s5'><input type='text' value={rightNumber} className='center-align' readOnly></input></div>
                    </div>
                    <div className='row'>
                        <div className='col s3'><button className='btn btn-large waves-effect operation' value='c' onClick={(event) => this.handleOperationClick(event)}>C</button></div>
                        <div className='col s3'><button className='btn btn-large waves-effect operation' value='ac' onClick={(event) => this.handleOperationClick(event)}>AC</button></div>
                        <div className='col s3'><button className='btn btn-large waves-effect operation' value='%' onClick={(event) => this.handleOperationClick(event)}>%</button></div>
                        <div className='col s3'><button className='btn btn-large waves-effect operation' value='/' onClick={(event) => this.handleOperationClick(event)}>/</button></div>
                    </div>
                    <div className='row'>
                        <div className='col s3'><button className='btn btn-large waves-effect' value='7' onClick={(event) => this.handleNumberClick(event)}>7</button></div>
                        <div className='col s3'><button className='btn btn-large waves-effect' value='8' onClick={(event) => this.handleNumberClick(event)}>8</button></div>
                        <div className='col s3'><button className='btn btn-large waves-effect' value='9' onClick={(event) => this.handleNumberClick(event)}>9</button></div>
                        <div className='col s3'><button className='btn btn-large waves-effect operation' value='*' onClick={(event) => this.handleOperationClick(event)}>*</button></div>
                    </div>
                    <div className='row'>
                        <div className='col s3'><button className='btn btn-large waves-effect' value='4' onClick={(event) => this.handleNumberClick(event)}>4</button></div>
                        <div className='col s3'><button className='btn btn-large waves-effect' value='5' onClick={(event) => this.handleNumberClick(event)}>5</button></div>
                        <div className='col s3'><button className='btn btn-large waves-effect' value='6' onClick={(event) => this.handleNumberClick(event)}>6</button></div>
                        <div className='col s3'><button className='btn btn-large waves-effect operation' value='-' onClick={(event) => this.handleOperationClick(event)}>-</button></div>
                    </div>
                    <div className='row'>
                        <div className='col s3'><button className='btn btn-large waves-effect' value='1' onClick={(event) => this.handleNumberClick(event)}>1</button></div>
                        <div className='col s3'><button className='btn btn-large waves-effect' value='2' onClick={(event) => this.handleNumberClick(event)}>2</button></div>
                        <div className='col s3'><button className='btn btn-large waves-effect' value='3' onClick={(event) => this.handleNumberClick(event)}>3</button></div>
                        <div className='col s3'><button className='btn btn-large waves-effect operation' value='+' onClick={(event) => this.handleOperationClick(event)}>+</button></div>
                    </div>
                    <div className='row'>
                        <div className='col s6'><button className='btn btn-large waves-effect' value='0' onClick={(event) => this.handleNumberClick(event)}>0</button></div>
                        <div className='col s3'><button className='btn btn-large waves-effect operation' value='.' onClick={(event) => this.handleOperationClick(event)}>.</button></div>
                        <div className='col s3'><button className='btn btn-large waves-effect operation' value='=' onClick={(event) => this.handleOperationClick(event)}>=</button></div>
                    </div>
                </div>
            </div>
        );
    }

};