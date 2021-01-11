let white_frames = {}
let green_frames = {}
let red_frames = {}

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
  this.video.muted = "muted"
  let self = this;
  this.video.addEventListener('play', function() {
      self.width = self.video.videoWidth / 2;
      self.height = self.video.videoHeight / 2;
      self.timerCallback();
      state._update('updateScanStatus', true);
    }, false);
  this.video.addEventListener('pause', function() {
    state._update('updateScanStatus', false)
    let lastValue = 0
    const arr = Object.keys(white_frames).map(k => {
      //wait 5 frames for the next frame
      if((parseInt(k) - lastValue) > 3){
        lastValue = parseInt(k)
        return parseInt(k)
      }
    })
  const nextDeathMarks = arr.filter(v => v);
  if(state.deathmarks.length === 0){
      // console.log('nextDeathMarks', nextDeathMarks)
      // console.log('white_frames', nextDeathMarks)
      state._update('updateDeathMarkers', nextDeathMarks)
      saveProject()
  } else {
    const next = [...state.deathmarks, ...nextDeathMarks]
    const nonDups = next.filter((v,i) => {
        if(next.indexOf(v) === i){
            return v
        }
    })
    state._update('updateDeathMarkers', nonDups)
    saveProject()
  }
  white_frames = {}
  green_frames = {}
  red_frames = {}
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
window['k_y'] = 415


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
  this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
  let frame = this.ctx1.getImageData(killx, killy, 100, 100);
  //TODO test filter effects
//   frame = imagedataFilters.contrast(frame, {amount: '10'})
  // frame = imagedataFilters.brightness(frame, {amount: '10'})
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
//   console.log(whiteAmount.length, greenAmount.length)
  if(whiteAmount.length >= 130 && whiteAmount.length < 300 && greenAmount.length >= 1500){
    // console.log(whiteAmount.length, greenAmount.length)
    const frameTime = (Math.round(this.video.currentTime))
    white_frames[frameTime] = whiteAmount
    green_frames[frameTime] = greenAmount
  }
}
  this.ctx2.putImageData(frame, 0, 0);
  return;
}
window['processor'] = processor
