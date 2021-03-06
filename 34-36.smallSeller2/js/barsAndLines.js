  var table = document.querySelector('.table');
  var regionSelect = document.querySelector('.region_select');
  var goodsSelect = document.querySelector('.goods_select');
  // 地区被选择的个数
  var regionSelectNumber = 0;

  // 颜色数组， 每一组数据对应一个颜色，一类数据对应的颜色类似
  var barcolors = [
  ['#FEB64D', '#FFDA43', '#FFE168'],
  ['#569AE2', '#60ACFC', '#9FCDFD'],
  ['#FF9F69', '#FA816D', '#FB6E6C']];

  var svg = document.querySelector('svg');
  var svg = document.querySelector('svg');
  var cvs = document.querySelector('#cvs');
  var ctx = cvs.getContext('2d');

  // 通过事件委托触发事件
  regionSelect.onclick = function (event) {
    setChecked(event, regionSelect);
    update();
    setSvgAndCanvasContent();
  }

  goodsSelect.onclick = function (event) {
    setChecked(event, goodsSelect);
    update();
    setSvgAndCanvasContent();
  }
  
  // 通过onresize事件达到页面的响应式
  window.onresize = function () {
    setSvgAndCanvasContent();
  }

  /**
   * 控制checkbox的勾选
   * @params event 第一个参数为事件的event;
   * @params node 第二个参数为dom节点;
   */
  function setChecked (event, node) {
    if (event.target.nodeName === 'LABEL') {
      return;
    }
    var event = event || window.event;
    // 如果点击的是全选
    if (event.target.value === '全选') {
      cancelDisabled(node);
      var inpArr = node.querySelectorAll('input');
      inpArr.forEach(ele => {
        ele.checked = true;
      })
    }
    // 如果点击的不是全选    
    else {
      var inpArr = node.querySelectorAll('input');
      var inpCheckedArr = node.querySelectorAll('input:checked');
      
      // 如果被选中的checkbox大于1个，那么取消disable的checkbox
      if (inpCheckedArr.length > 1) {
        cancelDisabled(node);
      }

      // 如果'选中数量'等于 '总数量' length-1, 说明所有的都被点击了，那么设置'全选'被选上
      if (inpCheckedArr.length === inpArr.length - 1 && (inpArr[inpArr.length - 1].checked === false)) {
        inpArr[inpArr.length - 1].checked = true;
      }

      // 如果'选中数量'小于 '总数量' length-1,并且'全选被选上'  说明至少有一个没有被点击, 取消'全选'被选上
      else if ((inpCheckedArr.length < inpArr.length) && inpCheckedArr.length > 1 && (inpArr[inpArr.length - 1].checked === true)) {
        inpArr[inpArr.length - 1].checked = false;
      }

      // 如果'选中数量' = 1个, 那么就让点击失效
      else if (inpCheckedArr.length === 1) {
        var inpCheckedLast = node.querySelector('input:checked');
        inpCheckedLast.disabled = true;
        // event.preventDefault();
        // event.target.disabled = true;
      }
    }
  }

  // 将disabled的按钮取消
  function cancelDisabled (node) {
    var inpCheckedLast = node.querySelector('input:disabled');
    if (inpCheckedLast) {
      inpCheckedLast.disabled = false;      
    }
  }

  // 将数据进行分类
  function classify(arr) {
    var arr = arr.slice();
    var obj = {}
    arr.forEach((ele, index) => {
      for (var key in obj) {
        if (ele.region === key) {
          obj[key].push(ele);
          return;
        }
      }
      if(!obj[ele['region']]) {
        obj[ele['region']] = [];        
      }
      obj[ele['region']].push(ele);
    });
    return obj;
  }

  // 当checkbox选择后，对数据进行过滤
  function filterList () {
    var regionArr = regionSelect.querySelectorAll('input:checked');
    var goodsArr = goodsSelect.querySelectorAll('input:checked');
    var arrTemp = [];
    goodsArr.forEach(ele => {
      sourceData.forEach(item => {
        if (item.product === ele.value) {
          arrTemp.push(item);
        }
      })
    })
    var arrTemp1 = [];
    arrTemp.forEach((item, index) => {
      regionArr.forEach(ele => {
        if (item.region === ele.value) {
          arrTemp1.push(item);
        }
      })
    })
    return arrTemp1;
  }
  
  // 将valueArr处理成html字符串
  function renderValue (valueArr) {
    var str = '<th>商品</th><th>地区</th>';
    for (var i = 1; i <= 12; i++) {
      str += '<th>' + i + '月' + '</th>'
    }

    var str1 = '';
    valueArr.forEach(ele => {
      str1 += '<tr>'
      for (var key in ele) {
        if (key === 'sale') {
          ele[key].forEach(item => {
            str1 += '<td>' + item + '</td>'
          })
          return;
        }
        str1+= '<td>' + ele[key] + '</td>'
      }
      str1 += '</tr>'
    })
    return '<table>' + str + str1 + '</table>'
  }

  // 开始进行table表格渲染
  function beginRender (value) {
    table.innerHTML = value;
  }

  // 将表格中相同商品的名称合并为一行
  function merge () {
    var regionArr = regionSelect.querySelectorAll('input:checked');
    var regionAll = regionSelect.querySelectorAll('input');

    var length = regionArr.length;
    // 如果选中的个数等于了所有的个数，说明'全选也被选中了',此时的length应该减去'全选'
    if (length === regionAll.length) {
      length--;
    }
    
    // 为选择的地区数赋值
    regionSelectNumber = length;
    
    var chooseTdArr = document.querySelectorAll('tr');
    chooseTdArr.forEach((ele, index) => {
      var firstTd = ele.querySelector('td');
      if (index % length === 1 && length > 1) {
        firstTd.setAttribute('rowspan', length);
        // continue;
        return;
      }
      if (index > 1 && length > 1) {
        ele.removeChild(firstTd);
      }
    })
  }

  // 将表格显示封装成一个新的函数
  function update () {
    var filterArr = filterList();
    var innerContent = renderValue(filterArr);
    beginRender(innerContent);
    merge();
  }

  // 自适应设置svg 的大小
  function setSvgAndCanvas (arr) {
    var svgWidth = (document.body.clientWidth - 100) / 2;
    var svgHeight = Math.floor(document.body.clientHeight - 380);
    var arrTemp = [];
    arrTemp.push(sourceData[0].sale);

    var arr = arr || arrTemp;

    var colorArrTemp = [];
    
    svg.setAttribute('width', svgWidth);
    svg.setAttribute('height', svgHeight);

    cvs.setAttribute('width', svgWidth);
    cvs.setAttribute('height', svgHeight);

    // 通过regionSelectNumber值处理 颜色数组 barcolors
    barcolors.forEach(ele => {
      var colorCat = ele.slice(0, regionSelectNumber);
      console.log('这儿是colorCat');
      console.log(colorCat);
      colorArrTemp = colorArrTemp.concat(colorCat);
    })
    console.log('这儿是colors');
    console.log(colorArrTemp);
    svg.innerHTML = setBar(arr, svgWidth, svgHeight, null, null, null, regionSelectNumber, colorArrTemp);
    setPolyline(arr, svgWidth, svgHeight, null, null, colorArrTemp);
  }

  // 设置canvas 与 svg 表格里面的内容
  function setSvgAndCanvasContent () {
    var trList = document.querySelectorAll('table tr');
    var valueArr = [];
    var tableItem = document.querySelector('table');
    // 当鼠标离开表格时，重新计算显示所有数据
    tableItem.onmouseleave = function () {
      setSvgAndCanvasContent();
    }
    trList.forEach((ele, index) => {
      if (index === 0) {
        return;
      }
      var tdList = ele.querySelectorAll('td');
      var tdArr = [];

      ele.onmouseenter = function () {
        var tdList = ele.querySelectorAll('td');
        var tdArr = [];
        tdList.forEach(ele => {
          tdArr.push(+ele.innerText)
        })
        tdArr = tdArr.slice(2);
        var valueArr = [];
        valueArr.push(tdArr)
        setSvgAndCanvas(valueArr);
      }
      tdList.forEach(ele => {
        tdArr.push(+ele.innerText)
      })
      
      tdArr = tdArr.slice(-12);
      valueArr.push(tdArr);
    })
    setSvgAndCanvas(valueArr);
  }

  update();
  // 设置canvas 与 svg的大小
  setSvgAndCanvas();
  // 更信坐标系里面的内容
  setSvgAndCanvasContent();
