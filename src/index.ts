import {reducers, defaultState, State} from './store';
import {createStore} from 'obake.js';
import {ui} from './ui';
// Import {baseStyles} from './styles';
import morph from 'nanomorph';

const ROOT_NODE = document.body.querySelector('#app');
// Create Store
export const state: State = createStore(
  defaultState,
  {renderer, log(state:State) {
    console.log('STATE:', state);
  }},
  reducers,
);
// First Render
morph(ROOT_NODE, ui(state));
// Render Loop function
function renderer(newState: State) {
  morph(ROOT_NODE, ui(newState), {
    onBeforeElUpdated: (fromEl: HTMLElement, toEl: HTMLElement) => !fromEl.isEqualNode(toEl),
  });
}

