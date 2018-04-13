import fs from 'fs';
const appPath = require('electron').remote.app.getAppPath();

function Storage(name){
    if (typeof name !== 'string' || ['',' '].indexOf(name) !== -1 ){
        this.storagePath = appPath + '/storage.json';
    } else {
        this.storagePath = appPath + '/' + name + '.json';
    };
}

Storage.prototype.getData = function(){
    var string = fs.readFileSync(this.storagePath);
    return JSON.parse(string);
}

Storage.prototype.setData = function(data){
    fs.writeFileSync(this.storagePath, JSON.stringify(data) );
}

export default Storage;