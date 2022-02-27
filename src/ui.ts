import html from 'nanohtml';
import {State} from './store';
import * as ACTIONS from './actions';

// Components
export function ui(state: State) {
  return html`
    <div id="app">
      <div class="page">${routing(state)}</div>
    </div>
  `;
}

export function routing(state: State) {
  switch (state?.currentPage) {
    case 'project':
      return projectPage(state);
    default:
      return homePage(state);
  }
}

export function video(filename: string) {
  if (filename === '') {
    return html`<div class="open-video">
      <button onclick="${ACTIONS.onClickOpenVideo}">
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

export function scanVideo(state: State, isScanning: boolean) {
  if (isScanning) {
    return html`
      <button
        id="stop-scan"
        class="scan red"
        onclick="${() => {
    ACTIONS.stopVideo();
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
    ACTIONS.startProcessor();
    ACTIONS.playVideo();
  }}"
    >
      Start Scan
    </button>
  `;
}

export function gameSelect(state: State) {
  return html`
    <div class="item span-1">
      <div class="game-select">
        <button
          class="${state?.currentGame === 'valorant' ? 'active' : ''}"
          onclick="${() => { ACTIONS.setCurrentGame('valorant') }}"
        >
          <img width="70" src="assets/valorant.png" />
        </button>
        <button
          class="${state?.currentGame === 'outward' ? 'active' : ''}"
          onclick="${() => { ACTIONS.setCurrentGame('outward') }}"
        >
          <img width="70" src="assets/outward.png" />
        </button>
        <button disabled>
          <img width="70" src="assets/more.png" />
        </button>
      </div>
    </div>
  `;
}

export function titleBlock(currentPage: string, filename: string) {
  if (currentPage === 'home') {
    return html`<div class="title-block">
      <h1>Deathmark</h1>
    </div>`;
  }

  if (filename === '') {
    return html` <div class="title-block empty"></div> `;
  }

  return html`
    <div class="title-block black">
      <h1>${ACTIONS.getTitle(filename)}</h1>
      <small>${filename}</small>
    </div>
  `;
}

export function backToProjectButton(currentPage: string) {
  if (currentPage === 'home') {
    return;
  }

  return html`<button
    id="btn-project"
    class="projects top-button"
    onclick="${ACTIONS.onClickHome}"
  >
    Projects 📁
  </button>`;
}

function donationButton() {
  return html`<button
    id="btn-donate"
    class="donate top-button"
    onclick="${ACTIONS.onClickDonate}"
  >
    Donate ❤️‍🔥
  </button>`;
}

export function topNav(state: State) {
  return html`
    <div class="container">
      <div class="item span-1">
        <button class="logo-click" onclick="${ACTIONS.onClickHome}">
          <img class="logo" src="../assets/logo.png" />
        </button>
      </div>
      <div class="item span-5">
        ${titleBlock(state?.currentPage, state?.currentProject?.filename)}
        ${backToProjectButton(state?.currentPage)}
      </div>
      <div class="item span-2">${donationButton()}</div>
    </div>
  `;
}

export function projectPage(state: State) {
  return html` ${topNav(state)}
    <div class="container">
      ${gameSelect(state)}
      <div class="item single-project span-5">
        ${video(state?.currentProject?.filename)}
        <div class="button-bar">
          ${scanVideo(state, state?.isScanning)}
          <button
            class="skull"
            onclick="${() => {
    ACTIONS.manualDeathMark();
  }}"
          >
            💀
          </button>
          <!-- <button
            class="export"
            onclick="${() => {
    ACTIONS.startProcessor();
  }}"
          >
            Export Deathmarks
          </button> -->
        </div>
        <div class="debug">
          <!-- <div class="debug"> -->
          <canvas id="c1" width="960" height="520"></canvas>
          <canvas id="c2" width="24" height="24"></canvas>
        </div>
      </div>
      <div class="item span-2">
        <div class="deathmarks">
          ${state?.currentProject?.deathmarks.map(
    (v: string, i: number) => html`<button
              id="mark-${v}"
              class="mark"
              onclick="${() => ACTIONS.scrubTo(v)}"
            >
              <span><b>💀</b> #${i + 1}</span>
              <small>[${ACTIONS.secondsToHms(v)}]</small>
              <span
                onclick="${() => {
    ACTIONS.deleteDeathMark(v);
  }}"
                class="delete"
                >X</span
              >
            </button>`,
  )}
        </div>
      </div>
    </div>`;
}

export function homePage(state: State) {
  return html` ${topNav(state)}
    <div class="container">
      ${gameSelect(state)}
      <div class="item projects">
        <div class="container wrap">
          <div
            onclick="${ACTIONS.onClickCreateProject}"
            class="create-card item"
          >
            Create Project ✨
          </div>
          ${state?.projects.map(
    (item: { filename: string }) => html`<div class="item card">
              <div onclick="${() => ACTIONS.onClickLoadProject(item.filename)}">
                <video
                  muted
                  width="280"
                  height="140"
                  controls="false"
                  src="${item.filename}"
                ></video>
                <div class="info-panel">
                  <span>${ACTIONS.getTitle(item.filename)}</span>
                  <small>${item.filename}</small>
                </div>
              </div>
              <button
                onclick="${() => {
    ACTIONS.onClickDeleteProject(item);
  }}"
              >
                X
              </button>
            </div>`,
  )}
        </div>
      </div>
      <div class="item"></div>
    </div>`;
}
