<template>
  <div class="vid">
    <div class="videoFrame">
      <video
        ref="video"
        id="video"
        class="video"
        width="640"
        height="480"
        playsinline
        muted
        autoplay
      ></video>
    </div>
    <div class="canvasFrame">
      <canvas
        ref="canvas"
        id="canvas"
        class="canvas"
        :width="rect ? rect.width : ''"
        :height="rect ? rect.height : ''"
      ></canvas>
    </div>
  </div>
</template>

<script>
import { face } from "../util/face";
import { observer } from "../util/observer";

export default {
  name: "Video",
  data: () => {
    return {
      videoAnimationFrame: null,
      time: null,
      rect: null,
      frame_rect: null
    };
  },
  async mounted() {
    const vid = document.getElementById("video");
    if (vid) {
      this.rect = vid.getBoundingClientRect();
    }

    const frame = document.getElementById("videoFrame");
    if (frame) {
      this.frame_rect = frame.getBoundingClientRect();
    }

    //レスポンシブ対応するときにどうするか考える
    if (this.rect && this.frame_rect) {
      const left = (this.rect.width - this.frame_rect.width) / 2;
      this.$refs.video.style.left = `-${left}px`;
      this.$refs.canvas.style.width = this.rect.width;
      this.$refs.canvas.style.height = this.rect.height;
    }

    // const rate = this.frame_rect.height / this.rect.height;

    await face.init(this.$refs.video); //face-api.jsにvideo渡す
    await this.initCamera(this.$refs.video); //カメラ起動

    //ループ
    const startTime = Date.now();
    const update = () => {
      this.time = Date.now() - startTime;
      this.faceDetect();
      requestAnimationFrame(update);
    };
    update();
    // this.$nextTick(() => {
    /* eslint-disable */
    initThree(); //Three.js初期化？
    observer.setCallback(points => {
      draw(points);
      /* eslint-enable */
    });
    // });
  },
  methods: {
    initCamera(video) {
      return new Promise((resolved, rejected) => {
        let media = navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: "user"
          }
        });
        media
          .then(stream => {
            video.muted = true;
            video.playsinline = true;
            /* eslint-disable */
            video.onloadedmetadata = e => {
              resolved(true);
            };
            /* eslint-enable */
            video.srcObject = stream;
          })
          .catch(err => {
            alert(err);
            rejected(false);
          });
      });
    },
    async faceDetect() {
      const points = await face.getFacePoints();
      observer.setValue(points);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.videoFrame {
  position: relative;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.video {
  position: absolute;
  top: 0;
  left: 0;
  transform: scale(-1, 1);
}
.canvasFrame {
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
.canvas {
  position: absolute;
  top: 0;
  left: 0;
  transform: scale(-1, 1);
}
</style>
