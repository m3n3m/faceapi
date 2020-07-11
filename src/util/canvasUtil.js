import * as _ from 'lodash';

/*
 * array.indexOfが遅いのでforで代替
 */
// const exIndexOf = (arr, index) => {
//   let flag = -1;
//   for (let i = 0; i < arr.length; i++) {
//     if (index === arr[i]) {
//       flag = i;
//     }
//   }
//   return flag;
// };

/**
 * ２点座標で範囲を取得
 */
/* eslint-disable */
const getRect = (landmarks, partsIndex) => {
  //拡張量 > 検出領域を広げる
  const extend_x = 0.05;
  const extend_y = 0.07;
  //partsIndexのポイントを全て取得

  const getPartsPoints = (part) => {
    return _.map(partsIndex, (index) => {
      return { index, point: landmarks[index] };
    });
  };

  //２点座標で範囲を取得
  const get2Points = (part) => {
    const parts = _.map(partsIndex, (index) => {
      return { index, point: landmarks[index] };
    });
    const rect = {
      //左上
      x:
        _.minBy(parts, (item) => {
          return item.point.x;
        }).point.x + -extend_x,
      y:
        _.minBy(parts, (item) => {
          return item.point.y;
        }).point.y *
        (1 - extend_y),
      //右下
      x2:
        _.maxBy(parts, (item) => {
          return item.point.x;
        }).point.x + extend_x,
      y2:
        _.maxBy(parts, (item) => {
          return item.point.y;
        }).point.y *
        (1 + extend_y)
    };
    return rect;
  };
  return {
    get2Points,
    getPartsPoints
  };
};
/* eslint-enable */
/*
 *排除する行のpixelインデックス配列
 */
const getHideLineIndex = (data, n, width) => {
  const lines = data.length / width;
  let indexs = [];
  //上部
  for (let i = 0; i < n * width; i++) {
    indexs.push(i);
  }
  //下部
  const start = lines * width - n * width;
  for (let i = start; i < lines * width; i++) {
    indexs.push(i);
  }
  //左部
  for (let i = 0; i <= lines; i++) {
    for (let j = 1; j <= n; j++) {
      indexs.push(j + i * width * 4);
    }
  }
  //右部
  for (let i = 0; i < lines; i++) {
    for (let j = width * 4 - n; j <= width * 4; j++) {
      indexs.push(j + i * width * 4);
    }
  }
  return indexs;
};
// const getPixels = (rect, elem) => {
//   //設定
//   let config = {};
//   config.outlineColor = { r: 0, g: 255, b: 0 }; //色
//   config.colorDistance = 25; //エッジ検出量閾値
//   config.hideline = 30; //排除する上下の行数
//   config.showPoints = true; //頂点を描画するかどうか
//   const ctx = elem.getContext("2d");
//   let imageData = ctx.getImageData(rect.x, rect.y, rect.width, rect.height);
//   let data = imageData.data;
//   //上下左右のノイズをカットする
//   const hideIndexs = getHideLineIndex(data, config.hideline, rect.width);
//   //有効頂点
//   let points = [];
//   for (var i = 0, l = data.length; i < l; i += 4) {
//     if ((i / 4 + 1) % elem.width === 0) {
//       data[i + 3] = 0;
//     } else {
//       var currentIndex = i,
//         nextIndex = currentIndex + 4,
//         underIndex = currentIndex + rect.width * 4,
//         // チェックするピクセルの色
//         current = {
//           r: data[currentIndex],
//           g: data[currentIndex + 1],
//           b: data[currentIndex + 2]
//         },
//         // 右隣の色
//         next = {
//           r: data[nextIndex],
//           g: data[nextIndex + 1],
//           b: data[nextIndex + 2]
//         },
//         // 下の色
//         under = {
//           r: data[underIndex],
//           g: data[underIndex + 1],
//           b: data[underIndex + 2]
//         };
//       // 現在のピクセルと右隣、下の色の三次元空間上の距離を閾値と比較する
//       // console.log("draw", current, next,under);
//       if (
//         getColorDistance(current, next) > config.colorDistance ||
//         getColorDistance(current, under) > config.colorDistance
//       ) {
//         //カットした範囲
//         if (exIndexOf(hideIndexs, i) === -1) {
//           const y = Math.floor(currentIndex / rect.width) + 1;
//           const x = currentIndex - (y - 1) * rect.width;
//           // points.push({x,y});
//           points.push({
//             x: x + rect.x,
//             y: y + rect.y
//           });
//           //TODO:pointに変換する
//           if (config.showPoints) {
//             data[i] = config.outlineColor.r;
//             data[i + 1] = config.outlineColor.g;
//             data[i + 2] = config.outlineColor.b;
//           } else {
//             data[i + 3] = 0;
//           }
//         } else {
//           data[i + 3] = 0;
//         }
//       } else {
//         data[i + 3] = 0;
//       }
//     }
//   }
//   // 書き換えたdataをimageDataにもどし、描画する
//   imageData.data = data;
//   return imageData;
//   // const shadowctx = document.querySelector('#overlay').getContext("2d");
//   // shadowctx.putImageData(imageData,rect.x,rect.y);
//   // return points;
// };
const drawPoint = (canvas, point, rate, shift, color) => {
  const rect = canvas.getBoundingClientRect();
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(
    rect.width * point.x * rate.x + shift.x - 2,
    rect.height * point.y * rate.y + shift.y - 2,
    4,
    4
  );
};
/* eslint-disable */
const drawPoints = (canvas, points, color) => {
  const rect = canvas.getBoundingClientRect();
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  _.map(points, (point) => {
    ctx.fillRect(point.x, point.y, 1, 1);
  });
};
/* eslint-enable */
export { getRect, getHideLineIndex, drawPoint, drawPoints };
