import React from 'react';
import PropTypes from 'prop-types';

export default class TableInfo extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            id: this.props.id
        }
    }

    render(){

        var { dataInfo } = this.props;

        return(
            <div>
                <table id={this.state.id}>
                    <tbody>
                        <tr>
                            <th>Saldo</th><td>{dataInfo.selectedActivitiesSum + '€'}</td>
                            <th>Numero portafogli</th><td>{dataInfo.selectedWallets.length + '/' + dataInfo.allWallets.length}</td>
                            <th>Numero attività</th><td>{dataInfo.selectedActivitiesNum + '/' + dataInfo.allActivitiesNum}</td>
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
        )
    }

}

TableInfo.propTypes = {
    id: PropTypes.string.isRequired,
    dataInfo: PropTypes.object.isRequired,
}