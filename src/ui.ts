import { scrubTo } from "./actions";
import html from "nanohtml";
import { routes } from "./store";
import { notificationStyle } from "styles";

export function AppRoot(state) {
  return html`
    <div id="app">
      <div class="page">${routing(state)}</div>
      ${notification(state)}
    </div>
  `;
}

export function routing(state) {
  switch (state.currentPage.name) {
    case "HOME":
      setTimeout(() => {
        window["processor"].doLoad();
      }, 1000);
      return html`
        <video
          width="1080"
          height="720"
          id="video"
          src="/media/1hr-test.mp4"
          controls="true"
          crossorigin="anonymous"
        ></video>
        <canvas id="c1" width="1920" height="1080"></canvas>
        <canvas id="c2" width="50" height="15"></canvas>
        <div class="button-bar">
          <h1>#KillMarker</h1>
          ${state.killMarkers.map((v, i) => {
            return html`<button onclick="${() => scrubTo(v)}">
              <span><b>💀</b> #${i + 1}</span>
              <small>[${v}]</small>
            </button>`;
          })}
        </div>
      `;
  }
}
export function navbar(state) {
  return html`
    <div class="nav">
      <ul class="row start-xs">
        ${Object.keys(routes).map((name) => {
          const isActive = state.currentPage.activePage === routes[name];
          const activeText = isActive ? "#" + name : name;
          return html` <li class="${isActive ? "active" : ""}">
            <a class="box" href="${routes[name]}">${activeText}</a>
          </li>`;
        })}
      </ul>
    </div>
  `;
}

function notification(state) {
  notificationStyle();
  return html`
    <!-- <div class="notification ${state.notification.show ? "show" : "hide"}">
      ${state.notification.text}
    </div> -->
  `;
}
