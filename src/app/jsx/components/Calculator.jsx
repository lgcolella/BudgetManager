import React from 'react';
import PropTypes from 'prop-types';
import ModalBox from '../elements/ModalBox.jsx';
import Utils from '../functions/utils.js';

const modalCalculatorId = 'modal-calculator';

export default class Calculator extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            prevNum: 0,
            currentNum: 0,
            currentOp: '+',
            madeOperations: [],
            MAX_NUM_LENGTH: 10,
            MAX_MADE_OPERATIONS: 18
        };
        this.handleNumberClick = this.handleNumberClick.bind(this);
        this.handleOperationClick = this.handleOperationClick.bind(this);
        this.clearMadeOperations = this.clearMadeOperations.bind(this);
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
        var madeOperations = this.state.madeOperations;

        function mathEval(number1, number2, operation){

            switch (operation.trim()){

                case '+':
                    return number1 + number2;
    
                case '-':
                    return number1 - number2;
    
                case '*':
                    return number1 * number2;
    
                case '/':
                    return number1 / number2;
    
                case '%':
                    return number1 / 100 * number2;
    
            }

            
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
                var operation = prevNum + ' ' + prevOp + ' ' + currentNum;
                prevNum = mathEval(prevNum, currentNum, prevOp);
                operation = operation + ' = ' + prevNum;
                madeOperations = [operation].concat(madeOperations);
                currentNum = 0;
                currentOp = prevOp;
            break;

            default:
                if ( !isNaN(currentNum) && currentNum !== 0 ){
                    var operationString = prevNum + ' ' + prevOp + ' ' + currentNum;
                    prevNum = mathEval(prevNum, currentNum, prevOp);
                    if (madeOperations.length > 0){
                        var prevOperation = (() => {
                            var lastOperation = madeOperations.shift();
                            return lastOperation.slice(0, lastOperation.indexOf(' = '));
                        })();
                        operationString = prevOperation + prevOp + currentNum + ' = ' + prevNum;
                    } else {
                        operationString = operationString + ' = ' + prevNum;
                    }
                    madeOperations = [operationString].concat(madeOperations);                    
                    currentNum = 0;
                }
            break;
        }

        this.setState({
            prevNum,
            currentNum,
            currentOp,
            madeOperations
        });

    }

    clearMadeOperations(){
        this.setState({
            madeOperations: []
        });
    }
    
    render(){

        var { MAX_NUM_LENGTH, MAX_MADE_OPERATIONS, prevNum, currentNum, currentOp } = this.state;
        var leftNumber = ( Number(prevNum) === 0 ?  currentNum.toString().slice(0, MAX_NUM_LENGTH) : prevNum.toString().slice(0, MAX_NUM_LENGTH));
        var rightNumber = ( Number(prevNum) === 0 ?  prevNum.toString().slice(0, MAX_NUM_LENGTH) : currentNum.toString().slice(0, MAX_NUM_LENGTH));
        
        return(
            <ModalBox id={Utils.modal('calculator').id}>
                <div id={modalCalculatorId} className='row'>
                    <h4>Calcolatrice</h4>
                    <div className='col s8'>
                        <div className='row'>
                            <div className='col s12 center-align'>
                                <div className='operations-live'><p>{leftNumber + ' ' + currentOp + ' ' + rightNumber}</p></div>
                            </div>
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
                    <div className='col s4'>
                        <div className='row'>
                            <div className='col s12'>
                                <div className='operations-list'>
                                    <button className='btn btn-red waves-effect' onClick={this.clearMadeOperations}>Pulisci</button>
                                    {
                                        this.state.madeOperations.map((value, index) => {
                                            return (MAX_MADE_OPERATIONS > index ? <p key={value + index}>{value}</p> : null);
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalBox>
        );
    }

}

Calculator.propTypes = {
}