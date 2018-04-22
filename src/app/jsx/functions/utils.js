import { isArray } from "util";

module.exports = {

    generateId: function(listOfId){
        var id = 1;
        if ( isArray(listOfId) ){
            while ( listOfId.indexOf(id) !== -1 ){
                id += 1;
            }
        };

        return id;
    },

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

    /*getIndexOfObjInArray: function(searchedObj, array){

        for (let object in array){
            var result = true;
            for (let property  in searchedObj){
                var cond = searchedObj.hasOwnProperty(property) && searchedObj[property] === array[object][property];
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

    }*/

}