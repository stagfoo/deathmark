import {Project, State} from 'store';
import {state} from 'index';

let log: object = {};
const killx = 305;
const killy = 165;
const redThre = 70;
const greenThre = 49;
const blueThre = 49;

export function outwardProcessor(actions: any) {
  const whiteFrames: Frames = {};
  const greenFrames: Frames = {};
  let redFrames: Frames = {};
  const processor: Processor = {
    doLoad() {
      this.video = document.getElementById('video') as HTMLVideoElement &
        VideoExtra;
      this.c1 = document.getElementById('c1') as HTMLCanvasElement;
      this.ctx1 = this.c1?.getContext('2d') as CanvasRenderingContext2D;
      this.c2 = document.getElementById('c2') as HTMLCanvasElement;
      this.ctx2 = this.c2?.getContext('2d') as CanvasRenderingContext2D;
      try {
        if (this.video === null) {
          throw new Error('Failed to get video');
        }

        this.video.playbackRate = 2.0;
        this.video.muted = true;
        this.video.addEventListener(
          'play',
          () => {
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
            console.log('last frame log', log);
            state._update('updateScanStatus', false);
            let lastValue = 0;
            const arr = Object.keys(redFrames).map(k => {
              // Wait 5 frames for the next frame
              if (Number(k) - lastValue > 3) {
                lastValue = Number(k);
                return Number(k);
              }

              return false;
            });
            const nextDeathMarks = arr.filter(v => v);
            if (state?.currentProject?.deathmarks.length === 0) {
              state._update('updateDeathMarkers', nextDeathMarks);
              actions.saveProject();
            } else {
              const current = state?.currentProject?.deathmarks
                ? state?.currentProject?.deathmarks
                : [];
              const next = [...current, ...nextDeathMarks];
              const nonDups = next.filter((v, i) => {
                if (next.indexOf(v) === i) {
                  return v;
                }

                return false;
              });
              state._update('updateDeathMarkers', nonDups);
              actions.saveProject();
            }

            redFrames = {};
          },
          false,
        );
      } catch (e) {}
    },
    timerCallback() {
      if (this.video?.paused || this.video?.ended) {
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
      const frame = this.ctx1.getImageData(killx, killy, 25, 25); // 10,10 for healhbar
      const redAmount = [];
      const l = frame.data.length / 4;
      if (!this.video.paused) {
        for (let i = 0; i < l; i++) {
          // Goes through every pixel in a frame for color
          const r = frame.data[0 + (i * 4)];
          const g = frame.data[1 + (i * 4)];
          const b = frame.data[2 + (i * 4)];
          if (g <= greenThre && r >= redThre && b <= blueThre) {
            redAmount.push({r, g, b});
          }

          log = {r: [r, g, b], ct: this.video.currentTime};
        }

        const frameTime = Math.round(this.video.currentTime);
        const color = {
          w: 0,
          g: 0,
          r: redAmount.length,
        };
        // Console.log({ frameTime, ...color })
        if (redThres(color.r)) {
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

  function redThres(n: number) {
    return n >= 180 && n <= 1000;
  }

  return processor;
}
