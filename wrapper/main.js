// Modules to control application life and create native browser window
const { app, Menu, BrowserWindow, ipcMain, dialog } = require("electron");
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const path = require("path");

let state = {
  projects: [],
  filename: ""
}
let mainWindow;

function createNewProject(state, nextFilename){
  state.filename = nextFilename
  state.projects = [...state.projects, {
      id: new Date().valueOf(),
      createdAt: new Date().valueOf(),
      filename: nextFilename,
      deathmarks: []
  }]
}



function clickHandler(event, arg, db) {
  //Clear filename
  switch (arg.action) {
    case 'open-file':
      state.filename = ""
      dialog.showOpenDialog({ properties: ["openFile"] }).then(function (response) {
        if (!response.canceled) {
          const nextFilename = response.filePaths[0];
          const result = projectExists(state, nextFilename);
          if(!result.status){
            createNewProject(state, nextFilename)
            event.reply('@machine-state', state);
            db.set('state', state).write()
          } else {
            event.reply('@machine-state', state);
          }
        } else {
          // console.log("no file selected");
          event.reply('@failed-open', state);
          state.filename = ""
        }
      });
      break;
    default:
      break;
  }
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1680,
    height: 970,
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
  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then(() => {
  mainWindow = createWindow();
  const userPath = app.getPath('userData');
  const adapter = new FileSync(`${userPath}/db.json`)
  const db = low(adapter)
  db.defaults({state}).write()
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) mainWindow = createWindow();
  });

  ipcMain.on('@click', (e,v) =>  { clickHandler(e,v,db) })
  ipcMain.on('@load-saved-state', (e, a) => {
    const v = db.get('state').value()
    // console.log('reanimatiing dead state', state)
    state = v;
    e.reply('@machine-state', v)
  })
  ipcMain.on('@get-machine-state', (e, a) => {
      // console.log('getting live state')
      e.reply('@machine-state', state)
  })
  ipcMain.on('@save-state', (e, state) => {
    const _state = JSON.parse(state);
    // console.log('@save-state', _state)
    db.set('state', _state).write()
  })
  ipcMain.on('@save-project', (e, project) => {
    const result = projectExists(state, project.filename);
    // console.log('@save-project', result, state, project)
    if(result.status) {
      state.projects[result.index] = project;
      state.filename = project.filename
      db.set('state', state).write()
      e.reply('@machine-state', state)
    } else {
      e.reply('@save-fail', project)
    }
  })
  ipcMain.on('@delete-project', (e, project) => {
    state.projects = state.projects.filter(np => {
      return np.filename !== project.filename
    })
    db.set('state', state).write()
    e.reply('@machine-state', state)
  })
});

function projectExists(state, filename) {
  let found = -1;
    state.projects.map((item, i) => {
      if(filename === item.filename){
        found = i;
      }
    })
    if(found >= 0){
     return {
       index: found,
       status: true
     }
    } else {
      return {
        index: -1,
        status: false
      }
    }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== 'darwin') app.quit()
});




