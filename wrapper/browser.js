// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { ipcRenderer } = require("electron");
const morph = require("morphdom");
const obake = require("obake.js");
const html = require("nanohtml");
const defaultState = {
  home: {
    title: "Your Project",
  },
  project: {
    title: "Single Project",
  },
  deathmarks: [],
  machineState: {
    filename: "",
  },
};
const EVENTS = {
  click: "@click",
  routeChange: "@route-change",
  machineState: "@get-machine-state",
};
const ROOT_NODE = document.body.querySelector("#app");

// Components
function AppRoot(state) {
  return html`
    <div id="app">
      <div class="page">${routing(state)}</div>
    </div>
  `;
}
function routing(state) {
  switch (state.currentPage) {
    case "project":
      return ProjectPage(state);
    default:
      return HomePage(state);
  }
}

function ProjectPage(state) {
  return html`<div class="container">
    <div class="item">
      <img class="logo" src="../logo.png" />
      <div class="game-select"></div>
    </div>
    <div class="item single-project">
      <h1>${state.project.title}</h1>
      <small>${state.machineState.filename}</small>
      <video
        width="100%"
        height="720"
        id="video"
        src="${state.machineState.filename}"
        controls="true"
        crossorigin="anonymous"
      ></video>
      <button onclick="${() => {startProcessor()}}">Start Watching</button>
      <div class="debug">
        <!-- <div class="debug"> -->
        <canvas id="c1" width="960" height="520"></canvas>
        <canvas id="c2" width="50" height="15"></canvas>
      </div>
    </div>
    <div class="item">
      <div class="deathmarks">
        ${state.deathmarks.map((v, i) => {
          return html`<button class="mark" onclick="${() => scrubTo(v)}">
            <span><b>💀</b> #${i + 1}</span>
            <small>[${secondsToHms(v)}]</small>
          </button>`;
        })}
      </div>
    </div>
  </div>`;
}

function HomePage(state) {
  return html`<div class="container">
    <div class="item">
      <img class="logo" src="../logo.png" />
      <div class="game-select"></div>
    </div>
    <div class="item projects">
      <h1>Projects</h1>
      <div class="container wrap">
        <div class="create-card item">create project</div>
        <div class="card item"></div>
        <div class="card item"></div>
        <div class="card item"></div>
        <div class="card item"></div>
        <div class="card item"></div>
        <div class="card item"></div>
      </div>
    </div>
    <div class="item"></div>
  </div>`;
}

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

// Apply Click event
document.querySelector(".create-card").addEventListener("click", () => {
  ipcRenderer.send("@click", { action: "open-file" });
  state._update("updateCurrentPage", "project");
});

//Sync Data
ipcRenderer.on("@machine-state", (event, arg) => {
  state._update("updateMachineState", arg);
  console.log("browser-state", state);
});

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