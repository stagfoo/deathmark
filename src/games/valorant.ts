import { state } from "index";


const green = [92, 164, 132];
const red = [183, 86, 93];
const white = [220, 220, 220];
const killx = 455;
const killy = 415;

export function valorantProcessor(saveProject: any) {
  let white_frames: Frames = {};
  let green_frames: Frames = {};
  let red_frames: Frames = {};
  let processor: Processor = {
    doLoad: () => {},
    timerCallback: () => {},
    computeFrame: () => {},
    video: null,
    c1: null,
    ctx1: null,
    c2: null,
    ctx2: null,
    width: 0,
    height: 0,
  };
  processor.doLoad = function doLoad() {
    this.video = document.getElementById("video") as HTMLVideoElement;
    this.c1 = document.getElementById("c1") as HTMLCanvasElement;
    this.ctx1 = this.c1?.getContext("2d") as CanvasRenderingContext2D;
    this.c2 = document.getElementById("c2") as HTMLCanvasElement;
    this.ctx2 = this.c2?.getContext("2d") as CanvasRenderingContext2D;
    this.video.playbackRate = 2.0;
    this.video.muted = true;
    this.video.addEventListener(
      "play",
       () => {
         //TODO find where video width comes from
        // this.width = this.video.videoWidth / 2;
        // this.height = this.video.videoHeight / 2;
        this.timerCallback();
        state._update("updateScanStatus", true);
      },
      false
    );
    this.video.addEventListener(
      "pause",
      function () {
        state._update("updateScanStatus", false);
        let lastValue = 0;
        const arr = Object.keys(white_frames).map((k) => {
          //wait 5 frames for the next frame
          if (parseInt(k) - lastValue > 3) {
            lastValue = parseInt(k);
            return parseInt(k);
          }
        });
        const nextDeathMarks = arr.filter((v) => v);
        if (state.deathmarks.length === 0) {
          state._update("updateDeathMarkers", nextDeathMarks);
          saveProject();
        } else {
          const next = [...state.deathmarks, ...nextDeathMarks];
          const nonDups = next.filter((v, i) => {
            if (next.indexOf(v) === i) {
              return v;
            }
          });
          state._update("updateDeathMarkers", nonDups);
          saveProject();
        }
        white_frames = {};
        green_frames = {};
        red_frames = {};
      },
      false
    );
  };
  processor.timerCallback = function timerCallback() {
    if (this.video === null) {
      throw new Error("Failed to get video");
    }
    if (this.video.paused || this.video.ended) {
      return;
    }
    this.computeFrame();
    setTimeout(() => {
      this.timerCallback();
    }, 0);
  };



  function greenRange(g: number) {
    return g >= 220;
  }
  function blueRange(n: number) {
    return n >= 220;
  }
  function redRange(n: number) {
    return n >= 220;
  }

  processor.computeFrame = function computeFrame() {
    if (this.video === null) {
      throw new Error("Failed to get video");
    }
    if (this.ctx1 === null) {
      throw new Error("Failed to ctx1 video");
    }
    if (this.ctx2 === null) {
      throw new Error("Failed to ctx2 video");
    }

    this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
    let frame = this.ctx1.getImageData(killx, killy, 100, 100);
    let whiteAmount = [];
    let greenAmount = [];
    let redAmount = [];
    let l = frame.data.length / 4;
    if (!this.video.paused) {
      for (let i = 0; i < l; i++) {
        //goes through every pixel in a frame for color
        let r = frame.data[i * 4 + 0];
        let g = frame.data[i * 4 + 1];
        let b = frame.data[i * 4 + 2];
        if (g >= white[0] && r >= white[1] && b >= white[2]) {
          whiteAmount.push({ g, r, b });
        } 
        if (g >= green[0] && r >= green[1] && b >= green[2]) {
          greenAmount.push({ g, r, b });
        }
        if (g >= red[0] && r >= red[1] && b >= red[2]) {
          redAmount.push({ g, r, b });
        }
      }
      //perfect percentage of white and green any more is false positive
      const frameTime = Math.round(this.video.currentTime);
      const color = {
        w: whiteAmount.length,
        g: greenAmount.length,
        r: redAmount.length,
      };
      // console.log({ frameTime, ...color })
      if (whiteThres(color.w) && greenThres(color.g) && redThres(color.r)) {
        white_frames[frameTime] = whiteAmount;
        green_frames[frameTime] = greenAmount;
        red_frames[frameTime] = redAmount;
      }
    }
    this.ctx2.putImageData(frame, 0, 0);
    return;
  };

  function whiteThres(n: number) {
    return n >= 10 && n <= 30;
  }
  function greenThres(n: number) {
    return n >= 700 && n <= 1500;
  }
  function redThres(n: number) {
    return n >= 520 && n <= 1000;
  }
  return processor;
}

