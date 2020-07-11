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
import { face } from '../util/face';
export default {
  name: 'Video',
  data: () => {
    return {
      videoAnimationFrame: null,
      time: null,
      rect: null,
      frame_rect: null
    };
  },
  async mounted() {
    const vid = document.getElementById('video');
    if (vid) {
      this.rect = vid.getBoundingClientRect();
    }

    const frame = document.getElementById('videoFrame');
    if (frame) {
      this.frame_rect = frame.getBoundingClientRect();
    }

    if (this.rect && this.frame_rect) {
      const left = (this.rect.width - this.frame_rect.width) / 2;
      this.$refs.video.style.left = `-${left}px`;
      this.$refs.canvas.style.width = this.rect.width;
      this.$refs.canvas.style.height = this.rect.height;
    }

    // const rate = this.frame_rect.height / this.rect.height;
    // console.log(this.rect, this.frame_rect, rate);
    // console.log(this.rect.width, window.innerWidth, left);

    await face.init(this.$refs.video);
    await this.initCamera(this.$refs.video);

    const startTime = Date.now();
    const update = () => {
      this.time = Date.now() - startTime;
      this.faceDetect();
      // とりあえずのアニメーション
      requestAnimationFrame(update);
    };
    update();
    this.$nextTick(() => {
      /* eslint-disable */
      drawShape();
      /* eslint-enable */
    });
  },
  methods: {
    initCamera(video) {
      return new Promise((resolved, rejected) => {
        let media = navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: 'user'
          }
        });
        media
          .then((stream) => {
            video.muted = true;
            video.playsinline = true;
            /* eslint-disable */
            video.onloadedmetadata = (e) => {
              resolved(true);
            };
            /* eslint-enable */
            video.srcObject = stream;
          })
          .catch((err) => {
            alert(err);
            rejected(false);
          });
      });
    },
    async faceDetect() {
      const points = await face.getFacePoints();
      /* eslint-disable */
      loop(points);
      /* eslint-enable */
      // this.draw(points);
    }
    // draw(points) {
    //   // console.log(">>>points", points);
    //   const canvas = document.getElementById("canvas");
    //   const ctx = canvas.getContext("2d");
    //   ctx.clearRect(0, 0, this.rect.width, this.rect.height);
    //   ctx.fillStyle = "rgb(255,0,0)";
    //   // TODO: imageWidth, imageHeightで拡大縮小する;
    //   ctx.fillRect(
    //     points.eyes.right[0].x * points.landmarksImage.width + points.shift.x,
    //     points.eyes.right[0].y * points.landmarksImage.height + points.shift.y,
    //     10,
    //     10
    //   );
    //   ctx.fillRect(
    //     points.eyes.left[0].x * points.landmarksImage.width + points.shift.x,
    //     points.eyes.left[0].y * points.landmarksImage.height + points.shift.y,
    //     10,
    //     10
    //   );
    // }
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
