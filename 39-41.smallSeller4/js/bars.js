/**
 * 设置树状图
 * @param {*} arr 柱状图数据组
 * @param {*} boxWidth 盒子宽度，默认500
 * @param {*} boxHeight  盒子高度，默认500
 * @param {*} shaftWidth 轴高度，默认480
 * @param {*} shaftHight 轴宽度，默认480
 * @param {*} interval 柱状图之间间隔，默认10
 * @param {*} markValue 标记值，每一类数据有多少个
 * @param {*} colors 颜色数组
 */
function setBar (arr, boxWidth = 500, boxHeight = 500, shaftWidth, shaftHight, interval, markValue, colors) {
  var interval = interval || 10;
  var shaftWidth = shaftWidth || (boxWidth - 40);
  var shaftHight = shaftHight || (boxHeight - 20);

  // 总共有多少条数据
  var valueArrLength = arr.length;

  // 一条数据里面有多少个值
  var length = arr[0].length;

  // 获取数据列表中最大的那个数组，也就是最高的那个柱状图
  var maxArr = [];
  arr.forEach(ele => {
    ele.forEach(item => {
      maxArr.push(item);
    })
  })
  var max = Math.max.apply(null, maxArr);

  // 获取比例放大值
  var scale = (shaftHight / max).toFixed(2);

  // 单个柱状图的的宽度
  var barWidth = Math.floor(((shaftWidth - interval * (length - 1)) / length) / valueArrLength);

  // 设置轴的颜色
  var shaftColor = '#666';

  var colorArr = [];
  // 生成随机颜色
  for (var i = 0; i < valueArrLength; i++) {
    var colorString = ''
    for (var j = 0; j < 3; j++) {
      var colorNum = (Math.floor(Math.random() * 256)).toString(16);
      colorString += colorNum;         
    }
    colorArr.push('#' + colorString);
  }
  // 设置折线的颜色
  var barColor = colors || colorArr;
  // 处理输入的颜色数组长度与实际的数量长度不一样的情况
  var lengthSize = Math.abs(barColor.length - arr.length);
  if (lengthSize > 0) {
    barColor = barColor.concat(colorArr).slice(0, valueArrLength);
  }

  // 设置y轴上面的终点坐标
  var beginPointX = Math.floor(boxWidth - shaftWidth);
  var beginPointY = 0;
  // 设置坐标的原点
  var originX = beginPointX;
  var originY = beginPointY + shaftHight;
  // 设置x轴上面的终点坐标
  var endPointX = beginPointX + shaftWidth;
  var endPointY = originY;

  /**** shaftPathHtml为svg内部的html字符串，下面设置的是坐标 ***/
  var shaftPathHtml = '';
  var monthTextHtml = '';
  var yTextHtml = '';
  var markLineHtml = '';

  /****  绘制纵坐标单位   *****/
  var xPoint = originX - 30;
  var yHeight = Math.round(Math.floor(max / 5));
  // 为了显示最大的标记，这儿多循环一次
  for (var i = 0; i < 6; i++) {
    var yPoint = originY - yHeight * i * scale;
    yTextHtml += `<text x="${xPoint}" y="${yPoint + 10}" style="font-size: 12px">${yHeight * i}</text>`
    markLineHtml += `<line x1="${originX}" y1="${yPoint}" x2="${originX + shaftWidth}" y2="${yPoint}" style="stroke:#eee;"/>`
    
  }
  shaftPathHtml += yTextHtml;
  shaftPathHtml += markLineHtml;

 /**** 绘制水平方向上的指示虚线 *****/



  /****  通过遍历获取柱状图   *****/
  var yMonthPoint = originY + 15;
  arr.forEach((ele, index) => {
    ele.forEach((item, i) => {
      // 这儿的i为12
      var barHeight = Math.floor(item * scale);
      var xPoint = originX + (valueArrLength * barWidth + interval) * i + barWidth * index;
      
      // 生成月份html
      if (index === 0) {
        // 在第一个柱状图的基础上 + (一个月份的所有宽度 / 4)
        var xMonthPoint = xPoint + barWidth * valueArrLength / 4;
        monthTextHtml += `<text x="${xMonthPoint}" y="${yMonthPoint}" style="font-size: 12px">${i+1}月</text>`
      }
      // 绘制柱状图
      shaftPathHtml += `<rect width="${barWidth}" height="${barHeight}" x="${xPoint}" y="${originY}" transform="translate(0,-${barHeight})" fill="${barColor[index]}"></rect>`
    })
  })
  // 绘制坐标系
  shaftPathHtml += `<path d="M${beginPointX},${beginPointY} L${originX},${originY} L${endPointX},${endPointY}" fill="none" stroke="${shaftColor}" stroke-width="2"/>`
  // 绘制月份
  shaftPathHtml += monthTextHtml;
 

 

  // 将html字符串进行返回
  return shaftPathHtml;
}