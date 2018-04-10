
const {app, BrowserWindow} = require('electron');
const url = require('url');
  
  // Mantenere un riferimento globale dell'oggetto window, altrimenti la finestra verrà 
  // chiusa automaticamente quando l'oggetto JavaScript è raccolto nel Garbage Collector.
  let win
  
  function createWindow () {
    // Creazione della finestra del browser.
    win = new BrowserWindow({width: 1280, height: 720})
  
    // e viene caricato il file index.html della nostra app.
    /*win.loadURL(url.format({
      pathname: path.join(__dirname, 'app/index.html'),
      protocol: 'file:',
      slashes: true
    }))*/
    if (process.env.NODE_ENV === 'production'){
      win.loadURL(`file://${__dirname}/app/index.html`);
    } else {
      win.loadURL(url.format({
        protocol: 'http',
        host: 'localhost:9000',
      }));
    }
    // Apertura degli strumenti per sviluppatori.
    win.webContents.openDevTools()
  
    // Emesso quando la finestra viene chiusa.
    win.on('closed', () => {
      // Eliminiamo il riferimento dell'oggetto window;  solitamente si tiene traccia delle finestre
      // in array se l'applicazione supporta più finestre, questo è il momento in cui 
      // si dovrebbe eliminare l'elemento corrispondente.
      win = null
    })
  }
  
  // Questo metodo viene chiamato quando Electron ha finito
  // l'inizializzazione ed è pronto a creare le finestre browser.
  // Alcune API possono essere utilizzate solo dopo che si verifica questo evento.
  app.on('ready', createWindow)
  
  // Terminiamo l'App quando tutte le finestre vengono chiuse.
  app.on('window-all-closed', () => {
    // Su macOS è comune che l'applicazione e la barra menù 
    // restano attive finché l'utente non esce espressamente tramite i tasti Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    // Su macOS è comune ri-creare la finestra dell'app quando
    // viene cliccata l'icona sul dock e non ci sono altre finestre aperte.
    if (win === null) {
      createWindow()
    }
  })
  
  // in questo file possiamo includere il codice specifico necessario 
  // alla nostra app. Si può anche mettere il codice in file separati e richiederlo qui.