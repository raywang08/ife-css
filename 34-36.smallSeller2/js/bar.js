/**
 * 设置树状图
 * @param {*} arr 树状图数据
 * @param {*} boxWidth 盒子宽度，默认500
 * @param {*} boxHeight  盒子高度，默认500
 * @param {*} shaftWidth 轴高度，默认480
 * @param {*} shaftHight 轴宽度，默认480
 * @param {*} interval 柱状图之间间隔，默认10
 */
function setBar (arr, boxWidth = 500, boxHeight = 500, shaftWidth, shaftHight, interval = 10) {
  var shaftWidth = shaftWidth || (boxWidth - 20);
  var shaftHight = shaftHight || (boxHeight - 20);
  var length = arr.length;
  // 获取数据列表中最大的那个数组，也就是最高的那个柱状图
  // var max = Math.max(arr);
  var max = Math.max.apply(null, arr);
  // 获取比例放大值
  var scale = (shaftHight / max).toFixed(2);
  // 单个柱状图的的宽度
  var barWidth = Math.floor((shaftWidth - interval * length) / length);
  // 设置轴的颜色
  var shaftColor = `#60acfc`;
  // 设置柱状图的颜色为一个数组，逐渐变淡
  var colorArr = ['0000ff'];
  var startColor = 256;
  for (var i = 0; i < length; i++) {
    // 定义颜色间隔
    var colorShaft = Math.floor(256 / length);
    startColor -= colorShaft;
    colorArr.push(`0000`+startColor.toString(16));
  }
  // 设置y轴上面的终点坐标
  var beginPointX = Math.floor((boxWidth - shaftWidth) / 2);
  var beginPointY = Math.floor((boxHeight - shaftHight) / 2);
  // 设置坐标的原点
  var originX = beginPointX;
  var originY = beginPointY + shaftHight;
  // 设置x轴上面的终点坐标
  var endPointX = beginPointX + shaftWidth;
  var endPointY = originY;

  // shaftPathHtml为svg内部的html字符串，下面设置的是坐标
  var shaftPathHtml = `<path d="M${beginPointX},${beginPointY} L${originX},${originY} L${endPointX},${endPointY}" fill="none" stroke="${shaftColor}" stroke-width="2"/>`

  // 通过遍历获取柱状图
  for (var i = 0; i < length; i++) {
    var barHeight = Math.floor(arr[i] * scale);
    var xPoint = originX + interval + (interval + barWidth) * i;
    shaftPathHtml += `<rect width="${barWidth}" height="${barHeight}" x="${xPoint}" y="${originY}" transform="translate(0,-${barHeight})" fill="#${colorArr[i]}"></rect>`
  }
  // 将html字符串进行返回
  return shaftPathHtml;
}