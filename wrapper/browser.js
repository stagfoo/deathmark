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
  console.log('updateMachineState', arg)
  state._update("updateMachineState", arg);
  console.log("browser-state", state);
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
  window["processor"].doLoad();
}