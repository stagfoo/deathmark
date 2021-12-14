function outwardProcess() {
  let red_frames = {};
  let processor = {
    doLoad: undefined,
    timerCallback: undefined,
    computeFrame: undefined,
  };
  processor.doLoad = function doLoad() {
    this.video = document.getElementById("video");
    this.c1 = document.getElementById("c1");
    this.ctx1 = this.c1.getContext("2d");
    this.c2 = document.getElementById("c2");
    this.ctx2 = this.c2.getContext("2d");
    this.video.playbackRate = 2.0;
    this.video.muted = "muted";
    let self = this;
    this.video.addEventListener(
      "play",
      function () {
        self.width = self.video.videoWidth / 2;
        self.height = self.video.videoHeight / 2;
        self.timerCallback();
        state._update("updateScanStatus", true);
      },
      false
    );
    this.video.addEventListener(
      "pause",
      function () {
        state._update("updateScanStatus", false);
        let lastValue = 0;
        const arr = Object.keys(red_frames).map((k) => {
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
        red_frames = {};
      },
      false
    );
  };
  processor.timerCallback = function timerCallback() {
    if (this.video.paused || this.video.ended) {
      return;
    }
    this.computeFrame();
    let self = this;
    setTimeout(function () {
      self.timerCallback();
    }, 0);
  };

  const red = [110, 100, 100];
  //todo fix
  //Helath bar
  // window["k_x"] = 7;
  // window["k_y"] = 280;

  //Health bar
  window["k_x"] = 280 + 25;
  window["k_y"] = 140 + 25;

  processor.computeFrame = function computeFrame() {
    const killx = window["k_x"];
    const killy = window["k_y"];
    this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
    let frame = this.ctx1.getImageData(killx, killy, 25, 25); //10,10 for healhbar
    let redAmount = [];
    let l = frame.data.length / 4;
    if (!this.video.paused) {
      for (let i = 0; i < l; i++) {
        //goes through every pixel in a frame for color
        let r = frame.data[i * 4 + 0];
        let g = frame.data[i * 4 + 1];
        let b = frame.data[i * 4 + 2];
        console.log([r,g,b], red)
        if (g >= red[0] && r >= red[1] && b >= red[2]) {
          redAmount.push({ r,g,b });
        }
      }
      //perfect percentage of white and green any more is false positive
      const frameTime = Math.round(this.video.currentTime);
      const color = {
        w: 0,
        g: 0,
        r: redAmount.length,
      };
      // console.log({ frameTime, ...color })
      if (redThres(color.r)) {
        red_frames[frameTime] = redAmount;
      }
    }
    this.ctx2.putImageData(frame, 0, 0);
    return;
  };
  function redThres(n) {
    return n >= 180 && n <= 1000;
  }
  return processor
}
window["processors"]['outward'] = outwardProcess();
