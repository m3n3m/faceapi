/* eslint-disable */
import * as _ from 'lodash';
import { getRect } from '../util/canvasUtil';
import {
  LEFT_EYE,
  RIGHT_EYE,
  LEFT_EYEBROW,
  RIGHT_EYEBROW,
  NOSE,
  MOUTH,
  JAW
} from '../constants/face';
import { FACEAPI_OPTION } from '../config';

const _face = () => {
  let src = null; //video
  let options = null;
  let face_points = {};
  let shift = {};
  let rate = {};
  let landmarksImage = {};

  const init = (_src) => {
    src = _src;
    // console.log("load models");
    return new Promise(async (resolved) => {
      await faceapi.loadTinyFaceDetectorModel(
        '/js/tiny_face_detector_model-weights_manifest.json'
      );
      await faceapi.loadFaceLandmarkTinyModel(
        '/js/face_landmark_68_tiny_model-weights_manifest.json'
      );
      options = new faceapi.TinyFaceDetectorOptions(FACEAPI_OPTION);
      // console.log("loaded models");
      resolved();
    });
  };
  //videoからcanvasサイズを変換
  const resizeCanvasAndResults = (dimensions, results) => {
    const { width, height } =
      dimensions instanceof HTMLVideoElement
        ? faceapi.getMediaDimensions(dimensions)
        : dimensions;
    return results.map((res) => res.forSize(width, height));
  };
  const drawLandmarks = (video, results) => {
    const resizedResults = resizeCanvasAndResults(video, results);
    const faceLandmarks = resizedResults.map((det) => det.landmarks);
    // const rect = {
    //   width: window.innerWidth,
    //   height: window.innerHeight
    // };
    const rect = {
      width: video.width,
      height: video.height
    };
    //縮尺計算
    rate = {
      x: faceLandmarks[0].imageWidth / rect.width,
      y: faceLandmarks[0].imageHeight / rect.height
    };

    shift = faceLandmarks[0].shift;

    landmarksImage = {
      width: faceLandmarks[0].imageWidth,
      height: faceLandmarks[0].imageHeight
    };

    face_points = faceLandmarks[0].positions;
    // console.log(">>>>>landmarks", JSON.stringify(faceLandmarks[0]));
    // console.log('face', faceLandmarks[0].relativePositions, shift, rate);
    //目の全頂点
    const left_face_eye_points = getRect(
      faceLandmarks[0].positions,
      LEFT_EYE
    ).getPartsPoints();
    const right_face_eye_points = getRect(
      faceLandmarks[0].positions,
      RIGHT_EYE
    ).getPartsPoints();
    //眉の全頂点
    const left_face_eyebrow_points = getRect(
      faceLandmarks[0].relativePositions,
      LEFT_EYEBROW
    ).getPartsPoints();
    const right_face_eyebrow_points = getRect(
      faceLandmarks[0].relativePositions,
      RIGHT_EYEBROW
    ).getPartsPoints();
    //鼻の全頂点
    const face_nose_points = getRect(
      faceLandmarks[0].relativePositions,
      NOSE
    ).getPartsPoints();
    //口の全頂点
    const face_mouth_points = getRect(
      faceLandmarks[0].relativePositions,
      MOUTH
    ).getPartsPoints();
    //顎の全頂点
    const face_jaw_points = getRect(
      faceLandmarks[0].relativePositions,
      JAW
    ).getPartsPoints();
    return {
      left_face_eye_points,
      right_face_eye_points,
      left_face_eyebrow_points,
      right_face_eyebrow_points,
      face_nose_points,
      face_mouth_points,
      face_jaw_points,
      rate,
      shift,
      landmarksImage
    };
  };
  /**
   * FaceAPiの両目の頂点
   */
  const getFaceData = () => {
    return { points: face_points, shift, rate };
  };
  const getFacePoints = () => {
    return new Promise(async (resolved) => {
      //faceapiの検出結果を取得
      let result = await faceapi
        .detectSingleFace(src, options)
        .withFaceLandmarks(true);
      if (result) {
        //検出したデータから描画
        const {
          left_face_eye_points,
          right_face_eye_points,
          left_face_eyebrow_points,
          right_face_eyebrow_points,
          face_nose_points,
          face_mouth_points,
          face_jaw_points,
          rate,
          shift,
          landmarksImage
        } = drawLandmarks(src, [result]);
        // console.log('eyes', left_face_eye_points, right_face_eye_points);
        const map = (points) => {
          return _.map(points, (point) => {
            return {
              x: point.point.x,
              y: point.point.y
            };
          });
        };
        face_points = {
          eyes: {
            left: map(left_face_eye_points),
            right: map(right_face_eye_points)
          },
          eyebrows: {
            left: map(left_face_eyebrow_points),
            right: map(right_face_eyebrow_points)
          },
          nose: map(face_nose_points),
          mouth: map(face_mouth_points),
          jaw: map(face_jaw_points),
          rate: rate,
          shift: shift,
          landmarksImage: landmarksImage
        };

        const points = face_points;
        // console.log(">>>>>face.js points", points);
        resolved(points);
      }
    });
  };
  return {
    init,
    getFaceData,
    getFacePoints
  };
};
export const face = _face();
/* eslint-enable */
