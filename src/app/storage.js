import fs from 'fs';
const appPath = require('electron').remote.app.getAppPath();

function Storage(name){
    if (typeof name !== 'string' || ['',' '].indexOf(name) !== -1 ){
        this.storagePath = appPath + '/storage.json';
    } else {
        this.storagePath = appPath + '/' + name + '.json';
    }
}

Storage.prototype.getData = function(){
    if (fs.existsSync(this.storagePath)){
        var string = fs.readFileSync(this.storagePath);
        return JSON.parse(string);
    } else {
        var obj = {
            data: [],
            filters: {}
        };
        fs.appendFileSync(this.storagePath, JSON.stringify(obj));
        return obj;
    }
}

Storage.prototype.setData = function(data){
    fs.writeFileSync(this.storagePath, JSON.stringify(data) );
}

export default Storage;