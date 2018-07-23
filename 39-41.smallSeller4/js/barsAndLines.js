  var table = document.querySelector('.table');
  var save = document.querySelector('.save');
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

  var sourceDataArr = [];
  var valueReplace = 0;
  var state = {};
  getData();

  // 当保存按钮被点击以后
  save.onclick = function () {
    var goodsAll = document.querySelector('.goods_all');
    var regionAll = document.querySelector('.region_all');
    var comfirmItem = document.querySelector('.data .comfirm.show');    
    if (!goodsAll.checked || !regionAll.checked) {
      alert('请在全选的情况下进行保存');
      return;
    } else if (comfirmItem) {
      alert('请先完成编辑');
      return;
    }
    else {
      saveData();
    }
  }

  // 通过事件委托触发事件
  regionSelect.onclick = function (event) {
    // 通过点击的input处理选择框之间的逻辑
    setChecked(event, regionSelect);

    // 每次点击都将商品和地区的信息保存到hash里面
    var hashMsg = '?' + getGoodsAndRegion();
    // 将hash的信息保存到url上
    history.pushState(state, null, hashMsg);
    run();
  }

  goodsSelect.onclick = function (event) {
    // 通过点击的input处理选择框之间的逻辑
    setChecked(event, goodsSelect);
    // 每次点击都将商品和地区的信息保存到hash里面
    var hashMsg = '?' + getGoodsAndRegion();
    // 将hash的信息保存到url上
    history.pushState(state, null, hashMsg);
    run();
  }

  window.onpopstate = function () {
    dealHash();
    run();
  }

  // 当点击的是页面耳朵空白处时，将所有编辑相关的全部隐藏
  document.body.onclick = function (event) {
    var event = event || window.event;
    var value = event.target.className;
    var nodeName = event.target.nodeName.toLowerCase();
    if (value === 'table' || value === 'select' || nodeName === 'body' ) {
      hideEditAll();
    }
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
      sourceDataArr.forEach(item => {
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
            str1 += `<td class="data"><span class="value">${item}</span></td>`
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
    // 等画面渲染以后, 为所有的input添加onblur事件，判断输入框里面的值是否是数字
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
    arrTemp.push(sourceDataArr[0].sale);

    var arr = arr || arrTemp;

    var colorArrTemp = [];
    
    if (svgHeight < 20) {
      svgHeight = 20;
    }
    svg.setAttribute('width', svgWidth);
    svg.setAttribute('height', svgHeight);

    cvs.setAttribute('width', svgWidth);
    cvs.setAttribute('height', svgHeight);

    // 通过regionSelectNumber值处理 颜色数组 barcolors
    barcolors.forEach(ele => {
      var colorCat = ele.slice(0, regionSelectNumber);
      colorArrTemp = colorArrTemp.concat(colorCat);
    })
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
      var tdList = ele.querySelectorAll('td.data .value');
      var tdArr = [];

      ele.onmouseenter = function () {
        var tdHoverList = ele.querySelectorAll('td.data .value');
        // 存放鼠标所放tr下td里面的input值的数组
        var tdArrHover = [];
        tdHoverList.forEach(item => {
          // 将td里面的input的value值
          tdArrHover.push(+item.innerText)
        })
        var valueArr = [];
        valueArr.push(tdArrHover)
        setSvgAndCanvas(valueArr);
      }
      tdList.forEach(ele => {
        tdArr.push(+ele.innerText);
      })
      valueArr.push(tdArr);
    })
    setSvgAndCanvas(valueArr);
  }

  // 保存表格里面的数据
  function saveData () {
    // 取出所有的月份值
    var tdArr = document.querySelectorAll('td.data .value');

    let i = 0;
    var tempArr = [];
    // 处理后分成9组进行保存
    tdArr.forEach((ele, index) => {
      if (!tempArr[i]) {
        tempArr[i] = [];
      }
      tempArr[i].push(+ele.innerText)
      if (index % 12 === 11) {
        i++;
      }
    })
    var sourceDataArrTemp = sourceDataArr.slice();
    sourceDataArrTemp.forEach((ele, index) => {
      ele.sale = tempArr[index].slice();
    })
    // 将数据保存到localStorage里面
    localStorage.setItem('sourceDataLocal', JSON.stringify(sourceDataArrTemp.slice()))
    alert('保存成功');
  }

  // 获取要处理的数据
  function getData () {
    if (localStorage.sourceDataLocal) {
      sourceDataArr = JSON.parse(localStorage.getItem('sourceDataLocal'));
    } else {
      sourceDataArr = sourceData.slice();
    }
  }

  // 设置td enter进去的效果（显示edit）
  function showEdit () {
    var tdArr = document.querySelectorAll('td.data');
    tdArr.forEach(ele => {
      // 为每个td创建编辑显示
      var value = ele.innerText;      
      var editItem = document.createElement('span');
      var comfirmItem = document.createElement('span');
      var cancelItem = document.createElement('span');
      var inputItem = document.createElement('input');
      // 将编辑放到td里面
      editItem.innerText = 'edit';
      editItem.className = 'edit';
      ele.appendChild(editItem);

      // 将确定放到td里面
      comfirmItem.innerText = '确定';
      comfirmItem.className = 'comfirm';
      ele.appendChild(comfirmItem);

      // 将取消放到td里面
      cancelItem.innerText = '取消';
      cancelItem.className = 'cancel';
      ele.appendChild(cancelItem);

      // 将input放到td里面
      inputItem.value = value;
      inputItem.className = 'input';
      ele.appendChild(inputItem);

      ele.onmouseenter = function () {
        var editItem = ele.querySelector('.edit');
        // 显示edit
        editItem.classList.add('show');
      }
      ele.onmouseleave = function () {
        var editItem = ele.querySelector('.edit');
        // 隐藏edit
        editItem.classList.remove('show');
      }
      // 当数字框被点击的时候
      ele.onclick = function () {
        hideEditAll();
        let editItem = ele.querySelector('.edit');
        let comfirmItem = ele.querySelector('.comfirm');
        let cancelItem = ele.querySelector('.cancel');
        let inputItem = ele.querySelector('.input');
        let valueItem = ele.querySelector('.value');
        let value = valueItem.innerText;

        // 将.value里面的文本放到input里面
        inputItem.value = value;
        // 将edit隐藏
        editItem.classList.remove('show');
        // 将数字变成input输入框
        inputItem.classList.add('show');
        inputItem.focus();
        // 显示确定、取消
        comfirmItem.classList.add('show');
        cancelItem.classList.add('show');
        // 点击取消, 编辑相关全部取消
        cancelItem.onclick = function (event) {
          /* 由于cancelItem为数字款的一部分，所以会冒泡到数字框，被关闭的cancelItem，马上又被打开
            所以必须要阻止冒泡
          */
          var event = event || window.event;
          if(event.stopPropagation){
            event.stopPropagation();
          } else{
              event.cancelBubble = true;
          }
          cancelEdit(cancelItem, comfirmItem, inputItem, value);
        }
        // 点击确定，如果是数字，便进行显示, 否则便进行alert提示， input框隐藏
        comfirmItem.onclick = function (event) {
          // 阻止事件冒泡
          var event = event || window.event;
          if(event.stopPropagation){
            event.stopPropagation();
          } else{
              event.cancelBubble = true;
          }
          comfirmEdit(cancelItem, comfirmItem, inputItem, valueItem, value);
        }

        inputItem.onkeydown = function (event) {
          var e = event || window.event || arguments.callee.caller.arguments[0];
          // 按下了回车键
          if (e && e.keyCode == 13) { 
            // 执行确认的函数
            comfirmEdit(cancelItem, comfirmItem, inputItem, valueItem, value)
          } 
          // 按下了esc键
          if (e && e.keyCode == 27) { 
            // 执行取消的函数
            cancelEdit(cancelItem, comfirmItem, inputItem, value)
          } 
        }; 
      }
    })
  }

  // 当编辑的确认键按下时
  function comfirmEdit (cancelItem, comfirmItem, inputItem, valueItem, value) {
    cancelItem.classList.remove('show');
    comfirmItem.classList.remove('show');
    inputItem.classList.remove('show');
    // 如果是正整数
    if (isParseInt(inputItem.value)) {
      valueItem.innerText = inputItem.value;
    } else {
      alert('请输入正整数')
      inputItem.value = value;
    }
  }

  // 当编辑的取消按下时
  function cancelEdit (cancelItem, comfirmItem, inputItem, value) {
    cancelItem.classList.remove('show');
    comfirmItem.classList.remove('show');
    inputItem.classList.remove('show');
    inputItem.value = value;
  }

  // 隐藏编辑相关
  function hideEditAll () {
    var editItem = document.querySelector('.edit.show');
    var comfirmItem = document.querySelector('.comfirm.show');
    var cancelItem = document.querySelector('.cancel.show');
    var inputItem = document.querySelector('.input.show');

    if (editItem) {
      editItem.classList.remove('show');
    }
    if (comfirmItem) {
      comfirmItem.classList.remove('show');
    }
    if (cancelItem) {
      cancelItem.classList.remove('show');
    }
    if (inputItem) {
      inputItem.classList.remove('show');
      // 将原来的值重新赋给input
      // var valueItem = inputItem.parentNode.querySelector('.value');
      // inputItem.value = valueItem.innerText;
      // valueItem.classList.add('show');
    }
  }

  // 判断是否是正整数
  function isParseInt (val) {
    if (isNaN(val)) {
      return false;
    }
    if (val.indexOf('.') > -1 || val.indexOf('-') > -1) {
      return false;
    }
    return true;
  }

  // 获取被选中的商品和地区
  function getGoodsAndRegion () {
    var goodsInput = document.querySelectorAll('.goods_select input:checked');
    var regionInput = document.querySelectorAll('.region_select input:checked');
    var goodsArr = [];
    var regionArr = [];
    goodsInput.forEach(ele => {
      if (ele.value !== '全选') {
        goodsArr.push(ele.value);
      }
    })
    regionInput.forEach(ele => {
      if (ele.value !== '全选') {
        regionArr.push(ele.value);
      }
    })
    return `goods=${goodsArr},regions=${regionArr}`;
  }
  // 处理hash
  function dealHash () {
    var str = decodeURIComponent(location.href.split('?')[1]);
    var goodsInput = document.querySelectorAll('.goods_select input');
    var regionInput = document.querySelectorAll('.region_select input');
    var goodsAll = document.querySelector('.goods_all');
    var regionAll = document.querySelector('.region_all');

    if (str == 'undefined') {
      return;
    }
    var index = str.indexOf('=');
    var index1 = str.indexOf('regions');
    var index2 = str.lastIndexOf('=');
    var goods = str.slice(index + 1, index1 - 1).split(',');
    var regions = str.slice(index2 + 1).split(',');
    
    console.log('这儿是goods');
    console.log(goods);
    
    console.log('这儿是regions');
    console.log(regions);

    goodsInput.forEach(ele => {
      if (goods.includes(ele.value)) {
        ele.checked = true;
        if (goods.length === 1) {
          ele.disabled = true;
        }
      } else {
        ele.checked = false;
      }
    })
    regionInput.forEach(ele => {
      if (regions.includes(ele.value)) {
        ele.checked = true;
        if (goods.length === 1) {
          ele.disabled = true;
        }
      } else {
        ele.checked = false;
      }
    })
    if (goods.length === 3) {
      goodsAll.checked = true;
    }
    if (regions.length === 3) {
      regionAll.checked = true;
    }
  }
  // 将程序的运行流程封装成一个函数
  function run () {
    // 更新表格
    update();
    // 更信坐标系里面的内容
    setSvgAndCanvasContent();
    // 设置编辑相关
    showEdit();
  }
  history.replaceState(state, null, location.href);
  // 首先处理hash上面的内容
  dealHash();
  run();

