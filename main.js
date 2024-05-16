const path = require('path');
const url = require('url');
const {app, BrowserWindow} = require('electron');

let win;

function createWindow() {
	win = new BrowserWindow({
		width: 1280,
		height: 720,
		icon: __dirname + "./mini_game/images/logo.png",
        resizable: false ,
        frame: false,
        autoHideMenuBar: true
        
        
	});

	win.loadURL(url.format({
		pathname: path.join(__dirname, './hub/hub.html'),
		protocol: 'file:',
		slashes: true,

	}));

}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
	app.quit();
});

























