import fs from 'fs';
const appPath = require('electron').remote.app.getAppPath();

function Storage(name){
    if (typeof name !== 'string' || ['',' '].indexOf(name) !== -1 ){
        this.storagePath = appPath + '/storage.json';
    } else {
        this.storagePath = appPath + '/' + name + '.json';
    }
}

Storage.prototype.createStore = function(){

    var obj = {
        data: [],
        filters: {}
    };

    fs.appendFileSync(this.storagePath, JSON.stringify(obj));
    return obj;

}

Storage.prototype.getData = function(){
    
    if (fs.existsSync(this.storagePath)){
        var buffer = fs.readFileSync(this.storagePath);
        if (buffer.length > 0){
            return JSON.parse(buffer);
        }
    }

    return this.createStore();
}

Storage.prototype.setData = function(newData){
    var prevData = JSON.parse(fs.readFileSync(this.storagePath));
    var data = Object.assign({}, prevData, newData);
    fs.writeFileSync(this.storagePath, JSON.stringify(data) );

}

export default Storage;