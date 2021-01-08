// Modules to control application life and create native browser window
const { app, Menu, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { dialog } = require("electron");

const state = {
  filename: ""
}
let mainWindow;



function clickHandler(event, arg) {
  switch (arg.action) {
    case 'open-file':
      dialog.showOpenDialog({ properties: ["openFile"] }).then(function (response) {
        if (!response.canceled) {
          state.filename = response.filePaths[0];
          event.reply('@machine-state', state);
        } else {
          console.log("no file selected");
        }
      });
      break;
    default:
      break;
  }
  event.reply('@machine-state', state)
}

const dockMenu = Menu.buildFromTemplate([
  {
    label: 'New Window',
    click () { console.log('New Window') }
  }, {
    label: 'New Window with Settings',
    submenu: [
      { label: 'Basic' },
      { label: 'Pro' }
    ]
  },
  { label: 'New Command...' }
])

app.whenReady().then(() => {
  app.dock.setMenu(dockMenu)
})




function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      webSecurity: false,
      icon: path.join(__dirname + 'favicons/icon.icns'),
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("pages/index.html");

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then(() => {
  mainWindow = createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) mainWindow = createWindow();
  });

  ipcMain.on('@click', clickHandler)
  ipcMain.on('@get-machine-state', (e, a) => { e.reply('@machine-state', state) })


});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  // if (process.platform !== 'darwin') app.quit()
  app.quit();
});




