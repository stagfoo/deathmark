import { reducers } from './store';
import { startRouters } from './url';
import { hydrateState, dehydrateState} from 'utils'
import { createStore } from 'obake.js';
import { AppRoot } from './ui';
import { BaseStyles  } from './styles';
import morph from 'nanomorph';
import ColorThief from 'colorthief';

//Default render
const ROOT_NODE = document.body.querySelector('#app');

//Create Store
const defaultState = hydrateState()
export const state = createStore(
    defaultState,
    {
      renderer,
      dehydrateState
    },
    reducers
  );

//Render Loop function
function renderer(newState) {
  morph(ROOT_NODE, AppRoot(newState), {
    onBeforeElUpdated: function(fromEl, toEl) {
        // spec - https://dom.spec.whatwg.org/#concept-node-equals

        if (fromEl.isEqualNode(toEl)) {
            return false
        }
        return true
    }
  })
}
//Start Router listener
startRouters();
BaseStyles();

let processor = {
  doLoad: undefined,
  timerCallback: undefined,
  computeFrame: undefined,
}
processor.doLoad = function doLoad() {
  this.video = document.getElementById('video');
  this.c1 = document.getElementById('c1');
  this.ctx1 = this.c1.getContext('2d');
  this.c2 = document.getElementById('c2');
  this.ctx2 = this.c2.getContext('2d');
  this.video.playbackRate = 2.0;
  let self = this;
  this.video.addEventListener('play', function() {
      self.width = self.video.videoWidth / 2;
      self.height = self.video.videoHeight / 2;
      self.timerCallback();
    }, false);
  this.video.addEventListener('pause', function() {
    let lastValue = 0
    const arr = Object.keys(white_frames).map(k => {
      //wait 5 frames for the next frame
      if((parseInt(k) - lastValue) > 3){
        lastValue = parseInt(k)
        return parseInt(k)
      }
    })

  console.log('Kill Markers', arr.filter(v => v))
  if(state.killMarkers.length > 0){
    const del = confirm('Are you sure?');
    if(del) {
      state._update('updateKillMarkers', arr.filter(v => v))
    } 
  } else {
    state._update('updateKillMarkers', arr.filter(v => v))
  }
}, false);
}
processor.timerCallback = function timerCallback() {
  if (this.video.paused || this.video.ended) {
    return;
  }
  this.computeFrame();
  let self = this;
  setTimeout(function() {
      self.timerCallback();
    }, 0);
}

const green = [92, 164, 132]
const red = [183, 86, 93]
const w1 = [208, 216, 208]
const w2 = [188, 188, 180]
window['k_x'] = 455
window['k_y'] = 410

const white_frames = {}
const green_frames = {}
const red_frames = {}
function greenRange(g){
  return g >= 225
}
function blueRange(n){
  return n >= 225
}
function redRange(n){
  return n >= 225
}

processor.computeFrame = function computeFrame() {
  const killx = window['k_x']
  const killy = window['k_y']
  const squareH = this.height/10
  const squareW = 200
  this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
  let frame = this.ctx1.getImageData(killx, killy, 100, 100);
  let whiteAmount = []
  let greenAmount = []
  let redAmount = []
  let l = frame.data.length / 2;
  if (!this.video.paused) {
  for (let i = 0; i < l; i++) {
    //goes through every pixel in a frame for color
    //must check 100*100 pixels
    let r = frame.data[i * 2 + 0];
    let g = frame.data[i * 2 + 1];
    let b = frame.data[i * 2 + 2];
    // console.log(r,g,b)
    if(greenRange(g) && redRange(r) && blueRange(b)){
      whiteAmount.push({g,r,b})
    }
    if(g >= green[0] && r >= green[1] && b >= green[2]){
      greenAmount.push({g,r,b})
    }
    if(g >= red[0] && r >= red[1] && b >= red[2]){
      redAmount.push({g,r,b})
    }
  }
  //perfect percentage of white and green any more is false positive
  if(whiteAmount.length >= 240 && whiteAmount.length < 300 && greenAmount.length >= 2200){
    const frameTime = (Math.round(this.video.currentTime))
    white_frames[frameTime] = whiteAmount
    green_frames[frameTime] = greenAmount
    console.log(whiteAmount.length, greenAmount.length)
  }
}
  this.ctx2.putImageData(frame, 0, 0);
  return;
}
window['processor'] = processor
