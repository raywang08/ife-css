//1. 定义一个接口类
var Interface = function (name,methods) {//name：接口名字
  if(arguments.length<2){
      alert("必须是两个参数")
  }
  this.name=name;
  this.methods=[];//定义一个空数组装载函数名
  for(var i=0;i<methods.length;i++){
      if(typeof  methods[i]!="string"){
          alert("函数名必须是字符串类型");
      }else {
          this.methods.push( methods[i]);
      }
  }
};

Interface.ensureImplement=function (object) {
  if(arguments.length<2){
      throw  new Error("参数必须不少于2个")
      return false;
  }
  for(var i=1;i<arguments.length;i++){
      var inter=arguments[i];
      //如果是接口就必须是Interface类型
      if(inter.constructor!=Interface){
          throw  new Error("如果是接口类的话，就必须是Interface类型");
      }
      //判断接口中的方法是否全部实现
      //遍历函数集合
      for(var j=0;j<inter.methods.length;j++){
          var method=inter.methods[j];//接口中所有函数

          //object[method]传入的函数
          //最终是判断传入的函数是否与接口中所用函数匹配
          if(!object[method]||typeof object[method]!="function" ){//实现类中必须有方法名字与接口中所用方法名相同
              throw  new Error("实现类中没有完全实现接口中的所有方法")
          }
      }
  }
}

// 创建一个借口对象
var Field = new Interface('Field', ['generateField', 'drawLine']);
var PlayerInt = new Interface('PlayerInt', ['generatePlayer', 'setPosition', 'setFinalPosition', 'run']);

function footballField(dom) {
  // 球场的标准长宽比为105m:68m，同时由于长宽两边各有2m的缓冲区，所以球场的完整长度为109m:72m
  // 根据dom的长宽，自动生成最大比例的球场
  let width = +dom.getAttribute('width');
  let height = +dom.getAttribute('height');
  // 长宽比例:保留3位小数
  let prop = (109 / 72).toFixed(3);
  if (Math.floor(width / prop) < height) {
    this.width = Math.floor(width);
    this.height = Math.floor(this.width / prop);
  } else {
    this.height = Math.floor(height);
    this.width = Math.floor(this.height * prop);
  }
  this.dom = dom;
  // 单位长度，保留3位小数
  this.unit = (this.width / 109).toFixed(3);
  this.startX = +(this.unit * 2).toFixed(3);
  this.startY = +(this.unit * 2).toFixed(3);
}
// 生成球场
footballField.prototype.generateField = function () {
  let msgHtml = `<rect x="0" y="0" width="${ this.width }" height="${ this.height }" fill="rgb(0, 128, 0)"/>`
  this.dom.innerHTML = msgHtml;
}
// 绘制足球场上的线
footballField.prototype.drawLine= function () {
  let lineHtml = `
    <rect x="${ this.startX }" y="${ this.startY }"
      width="${ Math.floor(this.unit * 105) }" height="${ Math.floor(this.unit * 68) }" stroke-width="${ (0.12 * this.unit).toFixed(3) }" stroke="rgb(255, 255, 255)" fill="rgba(0, 0, 0, 0)"/>

    <rect x="${ this.startX }" y="${ Math.floor(this.startY + 14 * this.unit) }"
      width="${ Math.floor(this.unit * 16.5) }" height="${ Math.floor(this.unit * 40.32) }" stroke-width="${ (0.12 * this.unit).toFixed(3) }" stroke="rgb(255, 255, 255)" fill="rgba(0, 0, 0, 0)"/>

    <rect x="${ Math.floor(this.startX + 88.5 * this.unit) }" y="${ Math.floor(this.startY + 14 * this.unit) }"
      width="${ Math.floor(this.unit * 16.5) }" height="${ Math.floor(this.unit * 40.32) }" stroke-width="${ (0.12 * this.unit).toFixed(3) }" stroke="rgb(255, 255, 255)" fill="rgba(0, 0, 0, 0)"/>

    <rect x="${ this.startX }" y="${ Math.floor(this.startY + 25 * this.unit) }"
      width="${ Math.floor(this.unit * 5.5) }" height="${ Math.floor(this.unit * 18.32) }" stroke-width="${ (0.12 * this.unit).toFixed(3) }" stroke="rgb(255, 255, 255)" fill="rgba(0, 0, 0, 0)"/>
    
    <rect x="${ Math.floor(this.startX + 99.5 * this.unit) }" y="${ Math.floor(this.startY + 25 * this.unit) }"
      width="${ Math.floor(this.unit * 5.5) }" height="${ Math.floor(this.unit * 18.32) }" stroke-width="${ (0.12 * this.unit).toFixed(3) }" stroke="rgb(255, 255, 255)" fill="rgba(0, 0, 0, 0)"/>

    <rect x="${ Math.floor(this.startX - 2 * this.unit) }" y="${ Math.floor(this.startY + 30.5 * this.unit) }"
      width="${ Math.floor(this.unit * 2) }" height="${ Math.floor(this.unit * 7.32) }" stroke-width="${ (0.12 * this.unit).toFixed(3) }" stroke="rgb(255, 255, 255)" fill="rgba(0, 0, 0, 0)"/>

    <rect x="${ Math.floor(this.startX + 105 * this.unit) }" y="${ Math.floor(this.startY + 30.5 * this.unit) }"
      width="${ Math.floor(this.unit * 2) }" height="${ Math.floor(this.unit * 7.32) }" stroke-width="${ (0.12 * this.unit).toFixed(3) }" stroke="rgb(255, 255, 255)" fill="rgba(0, 0, 0, 0)"/>
    
    <line x1="${ Math.floor(this.startX + 52.5 * this.unit) }" y1="${ this.startY }"
      x2="${ Math.floor(this.startX + 52.5 * this.unit) }" y2="${ Math.floor(this.startY + 68 * this.unit) }" stroke-width="${ (0.12 * this.unit).toFixed(3) }" stroke="rgb(255, 255, 255)"/>
    
    <circle cx="${ Math.floor(this.startX + 52.5 * this.unit) }" cy="${ Math.floor(this.startY + 34 * this.unit) }" r="${ Math.floor(9.15 * this.unit) }"
      stroke-width="${ (0.12 * this.unit).toFixed(3) }" stroke="rgb(255, 255, 255)" fill="rgba(0, 0, 0, 0)"/>

    <path d="M${ Math.floor(this.startX + 1 * this.unit) } ${ this.startY } A${ Math.floor(1 * this.unit) } ${ Math.floor(1 * this.unit) } 0 0 1 ${ this.startX } ${ Math.floor(this.startY + 1 * this.unit)} " 
      stroke-width="${ (0.12 * this.unit).toFixed(3) }" stroke="rgb(255, 255, 255)" fill="rgba(0, 0, 0, 0)" />

    <path d="M${ Math.floor(this.startX + 104 * this.unit) } ${ this.startY } A${ Math.floor(1 * this.unit) } ${ Math.floor(1 * this.unit) } 0 0 0 ${ Math.floor(this.startX + 105 * this.unit) } ${ Math.floor(this.startY + 1 * this.unit)} " 
      stroke-width="${ (0.12 * this.unit).toFixed(3) }" stroke="rgb(255, 255, 255)" fill="rgba(0, 0, 0, 0)" />

    <path d="M${ this.startX } ${ Math.floor(this.startY + 67 * this.unit) } A${ Math.floor(1 * this.unit) } ${ Math.floor(1 * this.unit) } 0 0 1 ${ Math.floor(this.startX + 1 * this.unit) } ${ Math.floor(this.startY + 68 * this.unit)} " 
      stroke-width="${ (0.12 * this.unit).toFixed(3) }" stroke="rgb(255, 255, 255)" fill="rgba(0, 0, 0, 0)" />

    <path d="M${ Math.floor(this.startX + 105 * this.unit) } ${ Math.floor(this.startY + 67 * this.unit) } A${ Math.floor(1 * this.unit) } ${ Math.floor(1 * this.unit) } 0 0 0 ${ Math.floor(this.startX + 104 * this.unit) } ${ Math.floor(this.startY + 68 * this.unit)} " 
    stroke-width="${ (0.12 * this.unit).toFixed(3) }" stroke="rgb(255, 255, 255)" fill="rgba(0, 0, 0, 0)" />
  `
  ;
  this.dom.innerHTML += lineHtml;
}

// 运动员类
function Player(VNum) {
  this.VNum  = VNum || 1 + Math.floor(98 * Math.random());
  this.VMax = Math.floor(3 + (this.VNum - 1) * ( 9 / 98 ));
  // this.dom = document.createElement('circle');
  this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
}
// 描绘运动员
Player.prototype.generatePlayer = function (svg) {
  // let playHtml = `<circle cx="${ Math.floor(globalStartX + this.startX * globalUnit) }" cy="${ Math.floor(globalStartY + this.startY * globalUnit) }" r="${ Math.floor(2 * this.unit) }"
  // stroke-width="${ (0.12 * this.unit).toFixed(3) }" stroke="rgb(255, 255, 255)" fill="rgba(0, 0, 0, 0)"/>`
  this.dom.setAttribute('cx', Math.floor(globalStartX + this.startX * globalUnit));
  this.dom.setAttribute('cy', Math.floor(globalStartY + this.startY * globalUnit));
  this.dom.setAttribute('r', Math.floor(2 * globalUnit));
  // this.dom.setAttribute('stroke-width', (0.12 * this.unit).toFixed(3));
  // this.dom.setAttribute('stroke', rgb(255, 255, 255));
  this.dom.setAttribute('fill', 'rgb(255, 255, 255)');
  // this.dom.style['-webkit-transition'] = 'all 2s cubic-bezier(0.75, 0, 0.41, 0.98)'
  svg.append(this.dom);
  // dom.innerHTML += playHtml;
}

/**
 * 设置开始位置
 */
Player.prototype.setPosition = function (startX, startY) {
  this.startX = startX;
  this.startY = startY;
}
/**
 * 设置结束的位置
 */
Player.prototype.setFinalPosition = function (endX, endY) {
  this.endX = endX;
  this.endY = endY;
}
/**
 * 运动员开始跑的函数
 */
Player.prototype.run = function () {
  // this.dom.setAttribute('cx', Math.floor(globalStartX + this.endX * globalUnit));
  // this.dom.setAttribute('cy', Math.floor(globalStartY + this.endY * globalUnit));
  this.dom.innerHTML = '';
  this.animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
  this.animate.setAttribute('attributeName', 'x');
  this.animate.setAttribute('from', '160');
  this.animate.setAttribute('to', '60');
  this.animate.setAttribute('begin', '0s');
  this.animate.setAttribute('dur', '3s');
  this.animate.setAttribute('repeatCount', 'indefinite');
  this.dom.append(this.animate);
  // <animate attributeName="x" from="160" to="60" begin="0s" dur="3s" repeatCount="indefinite" />
}

// 创建一个工厂对象
var factoryField = {
  getField(dom) {
    var field;
    field = new footballField(dom);
    Interface.ensureImplement(field, Field);
    return field;
  },
  getPlay(VNum) {
    var player;
    player = new Player(VNum);
    Interface.ensureImplement(player, PlayerInt);
    return player;
  }
}

// 创建一个产生场地的商店，
var ShopField = function() {}
ShopField.prototype.getField = function(dom) {
  var field = factoryField.getField(dom);
  return field;
}
ShopField.prototype.getPlay = function(VNum) {
  var player = factoryField.getPlay(VNum);
  return player;
}
var svg = document.querySelector('#svg');
var shopFiledObj = new ShopField();

var svgObj = shopFiledObj.getField(svg);
var globalUnit = svgObj.unit;
var globalStartX = svgObj.startX;
var globalStartY = svgObj.startY;
// 生成dom
svgObj.generateField();
svgObj.drawLine();

var player = shopFiledObj.getPlay(100);
player.setPosition(20, 20);
player.generatePlayer(svg);

var btn = document.querySelector('button');
btn.onclick = function () {
  player.setFinalPosition(80, 20);  
  player.run();
}