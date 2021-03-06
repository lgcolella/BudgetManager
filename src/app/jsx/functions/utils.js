import { isArray } from "util";

const sideNavId = 'sidenav';
const modalNewActivity = 'modal-new-activity';
const modalEditActivity = 'modal-edit-activity';
const modalCalendarNoteId = 'modal-calendar-note';
const modalCalculatorId = 'modal-calculator';
const modalExportBoxId = 'modal-export';

export default {

    generateId(data){
        var listOfId = data.map((activity) => {
            return activity.id;
        });
        var id = 1;
        if ( isArray(listOfId) ){
            while ( listOfId.indexOf(id) !== -1 ){
                id += 1;
            }
        }

        return id;
    },

    getDataInfo(data, dataToRender){

        var allPositiveActivitiesNum = 0;
        var allNegativeActivitiesNum = 0;
        var allWallets = [];
        var allActivities = [];
        var allActivitiesNum = data.length;
        var allMaxAmount = -Infinity;
        var allMinAmount = Infinity;

        data.forEach(function(activity){
            if (allWallets.indexOf(activity.wallet) === -1){ allWallets.push(activity.wallet) }
            if (allActivities.indexOf(activity.activity) === -1){ allActivities.push(activity.activity) }
            if (activity.amount > 0){ allPositiveActivitiesNum += 1 }
            if (activity.amount < 0){ allNegativeActivitiesNum += 1 }
            allMaxAmount = Math.max(activity.amount, allMaxAmount);
            allMinAmount = Math.min(activity.amount, allMinAmount);
        });
        allMaxAmount = (allMaxAmount === -Infinity ? 0 : allMaxAmount);
        allMinAmount = (allMinAmount === Infinity ? 0 : allMinAmount);

        var selectedPositiveActivitiesNum = 0;
        var selectedNegativeActivitiesNum = 0;
        var selectedWallets = [];
        var selectedActivitiesNum = dataToRender.length;
        var selectedPositiveMaxAmount = 0;
        var selectedPositiveMinAmount = 0;
        var selectedNegativeMaxAmount = 0;
        var selectedNegativeMinAmount = 0;
        var selectedActivitiesSum = 0;

        var tmpSelectedPositiveAmounts = [];
        var tmpSelectedNegativeAmounts = [];
        dataToRender.forEach(function(activity){
            if (selectedWallets.indexOf(activity.wallet) === -1){ selectedWallets.push(activity.wallet) }
            if (activity.amount > 0){ selectedPositiveActivitiesNum += 1 }
            if (activity.amount < 0){ selectedNegativeActivitiesNum += 1 }
            if (activity.amount > 0){
                tmpSelectedPositiveAmounts.push(activity.amount);
            } else {
                tmpSelectedNegativeAmounts.push(activity.amount);
            }
            if (activity.selected !== false){ selectedActivitiesSum += activity.amount; }
        });

        if (tmpSelectedPositiveAmounts.length > 0){
            selectedPositiveMaxAmount = Math.max(...tmpSelectedPositiveAmounts);
            selectedPositiveMinAmount = Math.min(...tmpSelectedPositiveAmounts);
        }
        
        if (tmpSelectedNegativeAmounts.length > 0){
            selectedNegativeMaxAmount = Math.min(...tmpSelectedNegativeAmounts);
            selectedNegativeMinAmount = Math.max(...tmpSelectedNegativeAmounts);
        }
        
        selectedActivitiesSum = selectedActivitiesSum.toFixed(2);

        return {
            allPositiveActivitiesNum,
            allNegativeActivitiesNum,
            allWallets,
            allActivities,
            allActivitiesNum,
            allMaxAmount,
            allMinAmount,
            selectedPositiveActivitiesNum,
            selectedNegativeActivitiesNum,
            selectedWallets,
            selectedActivitiesNum,
            selectedPositiveMaxAmount,
            selectedPositiveMinAmount,
            selectedNegativeMaxAmount,
            selectedNegativeMinAmount,
            selectedActivitiesSum
        };
    },


    modal: (modalName) => {
        /**
         * This method is used for handling Materialize modals opening.
         * I've preffered use this because I've noticed that many Materialize modals don't work really well with React async rendering 
         * cause its autofocus method.
         */
        let map = {
            sidenav: sideNavId,
            newActivity: modalNewActivity,
            editActivity: modalEditActivity,
            calendar: modalCalendarNoteId,
            calculator: modalCalculatorId,
            export: modalExportBoxId
        }

        if(map.hasOwnProperty(modalName)){
            let id = map[modalName];
            let el = document.getElementById(id);
            return {
                id,
                open: () => {
                    if(modalName === 'calendar'){
                        M.Datepicker.getInstance(el).open();
                    } else if (modalName === 'sidenav'){
                        M.Sidenav.getInstance(el).open();
                    } else {
                        M.Modal.getInstance(el).open();
                    }
                },
                close: () => {
                    if(modalName === 'calendar'){
                        M.Datepicker.getInstance(el).close();
                    } else if (modalName === 'sidenav'){
                        M.Sidenav.getInstance(el).close();
                    } else {
                        M.Modal.getInstance(el).close();
                    }
                }
            }
        } else {
            throw modalName + ': modal not allowed';
        }
        
    }

}