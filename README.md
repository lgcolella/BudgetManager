# Budget Manager

## Indice dei contenuti
* [Presentazione](#presentazione)
* [Demo](#demo)
* [Installazione ed utilizzo](#installazione-ed-utilizzo)
* [Funzionalità](#funzionalità)
* [Stack utilizzato](#stack-utilizzato)
* [Sviluppo](#sviluppo)
* [Come contribuire](#come-contribuire)
* [Ringraziamenti](#ringraziamenti)

## Presentazione

Budget Manager è un'applicazione multi-piattaforma e portatile pensata per offrire un punto di riferimento chiaro, intutivo e preciso per controllare e tenere aggiornato lo stato del proprio bilancio.

Permette di differenziare le proprie finanze in diversi portafogli, filtrarle o cercare tra di esse e produrre grafici e tabelle di riepilogo.
Creare e ripristinare backup è facile e veloce, non importa da o verso quale versione dell'applicazione, sistema operativo o architettura viene fatto.
È inoltre possibile esportare le tabelle delle finanze registrate in vari formati.

Spero che la possa trovare utile e conforme alle tue esigenze.

## Demo

![Demo 1](https://github.com/lgcolella/budget-manager/raw/master/repo/demo/1.gif "Demo 1")
![Demo 2](https://github.com/lgcolella/budget-manager/raw/master/repo/demo/2.gif "Demo 2")

## Installazione ed utilizzo

Per iniziare ad usarla subito basta scaricare l'archivio corrispondente al proprio sistema operativo da questa [pagina](https://github.com/lgcolella/budget-manager/releases/tag/v1.0.0), scompattarlo ed avviare l'eseguibile al suo interno.
I file necessari per far girare l'applicazione sono tutti all'interno di questa cartella perciò può essere spostata a piacimento nel proprio filesystem.

## Funzionalità

* Organizzazione delle entrate e delle uscite (attività) in gruppi (portafogli).
* Visualizzazione delle attività in tabella o in grafico.
* Filtri e campo di ricerca per una visione più mirata delle attività.
* Calendario per appuntare eventi o note.
* Calcolatrice.
* Export in formato: Excel, CSV, ODS, HTML.
* Backup dei propri dati e ripsritino in una qualunque versione dell'applicazione (anche su OS diversi).
* Tabella riassuntiva delle attività visualizzate.
* Ordinamento delle attività per campi.

## Stack utilizzato
[![Electron JS](https://github.com/lgcolella/budget-manager/raw/master/repo/img/96x96/electron.png "Electron JS")](https://electronjs.org/)
[![React JS](https://github.com/lgcolella/budget-manager/raw/master/repo/img/96x96/react.png "React JS")](https://reactjs.org/)
[![Materialize CSS](https://github.com/lgcolella/budget-manager/raw/master/repo/img/96x96/materialize.png "Materialize CSS")](https://materializecss.com/)
[![Babel JS](https://github.com/lgcolella/budget-manager/raw/master/repo/img/96x96/babel.png "Babel JS")](https://babeljs.io/)
[![Webpack](https://github.com/lgcolella/budget-manager/raw/master/repo/img/96x96/webpack.png "Webpack")](https://babeljs.io/)
[![Sass](https://github.com/lgcolella/budget-manager/raw/master/repo/img/96x96/scss.png "Sass")](https://sass-lang.com/)
[![Eslint](https://github.com/lgcolella/budget-manager/raw/master/repo/img/96x96/eslint.png "Eslint")](https://eslint.org/)
[![Yarn](https://github.com/lgcolella/budget-manager/raw/master/repo/img/96x96/yarn.png "Yarn")](https://yarnpkg.com)

Altre Librerie:
* [Recharts](https://github.com/recharts/recharts)
* [Xlsx](https://github.com/SheetJS/js-xlsx)

## Sviluppo

Clona questo repository e installa le dipendenze
```
git clone https://github.com/lgcolella/budget-manager.git
cd budget-manager
npm install
```
oppure
```
git clone https://github.com/lgcolella/budget-manager.git
cd budget-manager
yarn install
```
Compila per il sistema operativo corrente
```
npm run dist
```
Avvia l'ambiente di sviluppo per la prima volta
```
npm run dev:rebuild
```
per le volte successive
```
npm run dev
```
## Come contribuire

Che tu sia uno sviluppatore o un utente, ogni contributo è prezioso per migliorare e far crescere l'applicazione. Ecco alcuni utili aiuti che potresti dare:
* Dare nuove idee o suggerimenti per l'interfaccia grafica e l'esperienza utente.
* Proporre e/ o presentare nuove funzionalità.
* Trovare bug o glitch.
* Migliorare le performance e/ o il codice.
* Far conoscere questa applicazione ai tuoi amici e conoscenti.
* Farmi sapere come ti trovi ad utilizzarla! :)
## Ringraziamenti

L'icona dellìapplicazione è stata realizzata da [Vectors Market](https://www.flaticon.com/authors/vectors-market "Vectors Market"). Questo è il [link](https://www.flaticon.com/free-icon/wallet_599068#term=wallet&page=6&position=52) di origine.
