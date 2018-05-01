import React from 'react';

export default class Pagination extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            id: 'table-overview-pagination',
            selectedButton: null
        }
        this.setActiveButton = this.setActiveButton.bind(this);
    }

    setActiveButton(event){
        var selectedButton = event.target.parentElement;
        selectedButton.classList.add('active');
        var previousSibling = selectedButton;
        while (previousSibling.previousSibling !== null){
            previousSibling.previousSibling.classList.remove('active');
            previousSibling = previousSibling.previousSibling;
        }
        var nextSibling = selectedButton;
        while (nextSibling.nextSibling !== null){
            nextSibling.nextSibling.classList.remove('active');
            nextSibling = nextSibling.nextSibling;
        }
        this.setState({
            selectedButton
        });
        var numGroup = Math.floor(event.target.innerText.trim());
        this.props.onChange(numGroup);
    }

    setActiveSiblingButton(event, siblingTarget){
        var activeButton;
        if (siblingTarget === 'previous'){
            activeButton = this.state.selectedButton.previousSibling;
            if (activeButton.previousSibling === null){ return; }
        } else if (siblingTarget === 'next') {
            activeButton = this.state.selectedButton.nextSibling;
            if (activeButton.nextSibling === null){ return; }
        }

        this.setActiveButton({
            target: {
                parentElement: activeButton,
                innerText: activeButton.childNodes[0].innerText
            }
        });
        
    }

    componentDidMount(){
        var firstButton = document.querySelectorAll('#'+this.state.id+' li')[1];
        if (firstButton !== null){
            firstButton.classList.add('active');
            if (this.state.selectedButton === null){
                this.setState({
                    selectedButton: firstButton
                });
            }
        }
    }

    render(){

        var paginationButtons = (() => {
            var quote = this.props.elementsNum / this.props.elementsInGroup;

            if (quote <= 0){ return ( <span></span> )}
            var buttons = [];
            for (let i = 0; i < Math.ceil(quote); i++){
                buttons.push(
                    <li className='waves-effect' key={i}><a href="#!" onClick={(event) => {this.setActiveButton(event)}}>{i+1}</a></li>
                );
            }
            return buttons;
        })();

        return(
            <ul id={this.state.id} className="pagination">
                <li className='waves-effect'><a href="#!" onClick={(event) => {this.setActiveSiblingButton(event, 'previous')}}><i className="material-icons">chevron_left</i></a></li>
                {paginationButtons}
                <li className='waves-effect'><a href="#!" onClick={(event) => {this.setActiveSiblingButton(event, 'next')}}><i className="material-icons">chevron_right</i></a></li>
            </ul>
        );
    }

}