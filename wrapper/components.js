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
function Video(filename) {
  if (filename === "") {
    return html`<div class="open-video">
      <button onclick="${onClickOpenVideo}">
        <span>Open Video File 📂</span>
      </button>
    </div>`;
  }
  return html`
    <video
      muted
      width="100%"
      id="video"
      src="${filename}"
      controls="true"
      crossorigin="anonymous"
    ></video>
  `;
}

function ScanVideo(isScanning) {
  if(isScanning){
  return html`
    <button
      id="stop-scan"
      class="scan red"
      onclick="${() => {
        stopVideo();
      }}"
    >
      Stop Scan
    </button>
  `;
  }

  return html`
    <button
      id="start-scan"
      class="scan"
      onclick="${() => {
        startProcessor();
        playVideo();
      }}"
    >
      Start Scan
    </button>
  `;
}

function GameSelect() {
  return html`
    <div class="item span-1">
      <div class="game-select">
        <button>
          <img width="70" src="../assets/valorant.webp" />
        </button>
      </div>
    </div>
  `;
}
function TitleBlock(filename) {
  if (state.currentPage === "home") {
    return html`<div class="title-block">
      <h1>Your Project</h1>
    </div>`;
  }
  if (filename === "") {
    return html` <div class="title-block empty"></div> `;
  }
  return html`
    <div class="title-block black">
      <h1>${getTitle(filename)}</h1>
      <small>${filename}</small>
    </div>
  `;
}

function BackToProjectButton() {
  if (state.currentPage === "home") {
    return;
  }
  return html`<button
    id="btn-project"
    class="projects top-button"
    onclick="${onClickHome}"
  >
    Projects 📁
  </button>`;
}

function DonationButton() {
  return html`<button
    id="btn-donate"
    class="donate top-button"
    onclick="${onClickDonate}"
  >
    Donate ❤️‍🔥
  </button>`;
}

function TopNav() {
  return html`
    <div class="container">
      <div class="item span-1">
        <button class="logo-click" onclick="${onClickHome}">
          <img class="logo" src="../assets/logo.png" />
        </button>
      </div>
      <div class="item span-5">${TitleBlock(state.machineState.filename)}</div>
      <div class="item span-2">
        ${BackToProjectButton()} ${DonationButton()}
      </div>
    </div>
  `;
}
function ProjectPage(state) {
  return html` ${TopNav()}
    <div class="container">
      ${GameSelect()}
      <div class="item single-project span-5">
        ${Video(state.machineState.filename)}
        <div class="button-bar">
          ${ScanVideo(state.isScanning)}
          <button
            class="skull"
            onclick="${() => {
              manualDeathMark()
            }}"
          >
            💀
          </button>
          <!-- <button
            class="export"
            onclick="${() => {
              startProcessor();
            }}"
          >
            Export Deathmarks
          </button> -->
        </div>
        <div class="debug">
          <!-- <div class="debug"> -->
          <canvas id="c1" width="960" height="520"></canvas>
          <canvas id="c2" width="50" height="15"></canvas>
        </div>
      </div>
      <div class="item span-2">
        <div class="deathmarks">
          ${state.deathmarks.map((v, i) => {
            return html`<button id="mark-${v}" class="mark" onclick="${() => scrubTo(v)}">
              <span><b>💀</b> #${i + 1}</span>
              <small>[${secondsToHms(v)}]</small>
              <span onclick="${() => { deleteDeathMark(v)}}" class="delete">X</span>
            </button>`;
          })}
        </div>
      </div>
    </div>`;
}

function HomePage(state) {
  return html` ${TopNav()}
    <div class="container">
      ${GameSelect()}
      <div class="item projects">
        <div class="container wrap">
          <div onclick="${onClickCreateProject}" class="create-card item">
            Create Project ✨
          </div>
          ${state.machineState.projects.map((item) => {
            return html`<div onclick="${() => onClickLoadProject(item.filename)}" class="item card">
                  <video muted width="280" height="140" controls="false" src="${item.filename}"></video>
              <div class="info-panel">
                <span>${getTitle(item.filename)}</span>
                <small>${item.filename}</small>
              </div>
            </div>`;
          })}
        </div>
      </div>
      <div class="item"></div>
    </div>`;
}
