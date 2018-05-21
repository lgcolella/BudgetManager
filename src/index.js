
const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
  
  let win
  
  function createWindow () {
    // Creazione della finestra del browser.
    win = new BrowserWindow({
      width: 1280,
      height: 720,
      icon: path.join(__dirname, '/app/style/icons/64x64.png')
    })
  
    
    win.maximize();
    if (process.env.NODE_ENV === 'production'){
      win.loadURL(`file://${__dirname}/app/index.html`);
    } else {
      win.loadURL(url.format({
        protocol: 'http',
        host: 'localhost:9000',
      }));
    }
    if (process.env.NODE_ENV == 'development') win.webContents.openDevTools();
    
    
    win.on('closed', () => {
      win = null
    })
  }
  
  app.on('ready', createWindow)
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    if (win === null) {
      createWindow()
    }
  })