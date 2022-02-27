import {state} from 'index';

const green = [92, 164, 132];
const red = [183, 86, 93];
const white = [220, 220, 220];
const killx = 455;
const killy = 415;

function whiteThres(n: number) {
  return n >= 10 && n <= 30;
}

function greenThres(n: number) {
  return n >= 700 && n <= 1500;
}

function redThres(n: number) {
  return n >= 520 && n <= 1000;
}

export function valorantProcessor(saveProject: any) {
  let whiteFrames: Frames = {};
  let greenFrames: Frames = {};
  let redFrames: Frames = {};
  const processor: Processor = {
    doLoad() {
      this.video = document.getElementById('video') as HTMLVideoElement;
      this.c1 = document.getElementById('c1') as HTMLCanvasElement;
      this.ctx1 = this.c1?.getContext('2d') as CanvasRenderingContext2D;
      this.c2 = document.getElementById('c2') as HTMLCanvasElement;
      this.ctx2 = this.c2?.getContext('2d') as CanvasRenderingContext2D;
      this.video.playbackRate = 2.0;
      this.video.muted = true;
      this.video.addEventListener(
        'play',
        () => {
          // TODO find where video width comes from
          this.width = (this.video as VideoExtra).videoWidth / 2;
          this.height = (this.video as VideoExtra).videoHeight / 2;
          this.timerCallback();
          state._update('updateScanStatus', true);
        },
        false,
      );
      this.video.addEventListener(
        'pause',
        () => {
          state._update('updateScanStatus', false);
          let lastValue = 0;
          const arr = Object.keys(whiteFrames).map(k => {
            // Wait 5 frames for the next frame
            if (Number(k) - lastValue > 3) {
              lastValue = Number(k);
              return Number(k);
            }

            return null;
          });
          const nextDeathMarks = arr.filter(v => v);
          if (state.deathmarks.length === 0) {
            state._update('updateDeathMarkers', nextDeathMarks);
            saveProject();
          } else {
            const next = [...state.deathmarks, ...nextDeathMarks];
            const nonDups = next.filter((v, i) => {
              if (next.indexOf(v) === i) {
                return v;
              }

              return false;
            });
            state._update('updateDeathMarkers', nonDups);
            saveProject();
          }

          whiteFrames = {};
          greenFrames = {};
          redFrames = {};
        },
        false,
      );
    },
    timerCallback() {
      if (this.video === null) {
        throw new Error('Failed to get video');
      }

      if (this.video.paused || this.video.ended) {
        return;
      }

      this.computeFrame();
      setTimeout(() => {
        this.timerCallback();
      }, 0);
    },
    computeFrame() {
      if (this.video === null) {
        throw new Error('Failed to get video');
      }

      if (this.ctx1 === null) {
        throw new Error('Failed to ctx1 video');
      }

      if (this.ctx2 === null) {
        throw new Error('Failed to ctx2 video');
      }

      this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
      const frame = this.ctx1.getImageData(killx, killy, 100, 100);
      const whiteAmount = [];
      const greenAmount = [];
      const redAmount = [];
      const l = frame.data.length / 4;
      if (!this.video.paused) {
        for (let i = 0; i < l; i++) {
          // Goes through every pixel in a frame for color
          const r = frame.data[0 + (i * 4)];
          const g = frame.data[1 + (i * 4)];
          const b = frame.data[2 + (i * 4)];
          if (g >= white[0] && r >= white[1] && b >= white[2]) {
            whiteAmount.push({g, r, b});
          }

          if (g >= green[0] && r >= green[1] && b >= green[2]) {
            greenAmount.push({g, r, b});
          }

          if (g >= red[0] && r >= red[1] && b >= red[2]) {
            redAmount.push({g, r, b});
          }
        }

        // Perfect percentage of white and green any more is false positive
        const frameTime = Math.round(this.video.currentTime);
        const color = {
          w: whiteAmount.length,
          g: greenAmount.length,
          r: redAmount.length,
        };
        if (whiteThres(color.w) && greenThres(color.g) && redThres(color.r)) {
          whiteFrames[frameTime] = whiteAmount;
          greenFrames[frameTime] = greenAmount;
          redFrames[frameTime] = redAmount;
        }
      }

      this.ctx2.putImageData(frame, 0, 0);
    },
    video: null,
    c1: null,
    ctx1: null,
    c2: null,
    ctx2: null,
    width: 0,
    height: 0,
  };

  return processor;
}
