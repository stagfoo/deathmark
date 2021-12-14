// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const defaultMachineState = {
  filename: "",
  projects: []
}

const defaultState = {
  currentPage: "home",
  currentGame: "valorant",
  processorStart: false,
  isScanning: false,
  deathmarks: [],
  machineState: defaultMachineState,
};
const EVENTS = {
  click: "@click",
  routeChange: "@route-change",
  machineState: "@get-machine-state",
};
const ROOT_NODE = document.body.querySelector("#app");

//Create Store
const state = obake.createStore(
  defaultState,
  { renderer },
  {
    updateCurrentGame: obake.reducer((state, value) => {
      state.currentGame = value;
    }),
    updateCurrentPage: obake.reducer((state, value) => {
      state.currentPage = value;
    }),
    updateMachineState: obake.reducer((state, value) => {
      state.machineState = value;
    }),
    updateDeathMarkers: obake.reducer((state, value) => {
      state.deathmarks = value;
    }),
    updateScanStatus: obake.reducer((state, value) => {
      state.isScanning = value;
    }),
    processorStart: obake.reducer((state, value) => {
      state.processorStart = value;
    }),
  }
);

//First Render
morph(ROOT_NODE, AppRoot(defaultState));
//Render Loop function
function renderer(newState) {
  morph(ROOT_NODE, AppRoot(newState), {
    onBeforeElUpdated: function (fromEl, toEl) {
      if (fromEl.isEqualNode(toEl)) {
        return false;
      }
      return true;
    },
  });
}

//Sync Data
ipcRenderer.on("@machine-state", (event, arg) => {
  // console.log('updateMachineState', arg)
  state._update("updateMachineState", arg);
  // console.log("browser-state", state);
});
//Sync Data
ipcRenderer.on("@save-fail", (event, arg) => {
  // console.log('@save-fail', arg)
  alert('save failed')
});
ipcRenderer.on("@save-fail", (event, arg) => {
  // console.log('@save-fail', arg)
  alert('open failed')
});

ipcRenderer.send("@load-saved-state");

// UTILS
function secondsToHms(d) {
  d = Number(d);
  let h = Math.floor(d / 3600);
  let m = Math.floor((d % 3600) / 60);
  let s = Math.floor((d % 3600) % 60);

  let hDisplay = h + (h == 1 ? ":" : ":");
  let mDisplay = m + (m == 1 ? ":" : ":");
  let sDisplay = s + (s == 1 ? "" : "");
  return hDisplay + mDisplay + sDisplay;
}

function scrubTo(v) {
  const vid = document.getElementById("video");
  vid.currentTime = v;
}

function startProcessor(){
  if(!state.processorStart) {
    window["processors"][state.currentGame].doLoad();
    state._update('processorStart', true)
  }
}