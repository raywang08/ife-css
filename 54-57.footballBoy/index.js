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
  // 速度值
  this.VNum  = VNum || 1 + Math.floor(98 * Math.random());
  // 最大速度
  this.VMax = Math.floor(3 + (this.VNum - 1) * ( 9 / 98 ));

  // 为运动员添加dom属性，这个属性对应球员的dom
  this.dom = document.createElement('div');
  this.dom.style.width = 2 * globalUnit + 'px';
  this.dom.style.height = 2 * globalUnit + 'px';
  this.dom.style.background = '#fff';

  // 定义运动员的爆发力
  this.force = 1 + Math.floor(98 * Math.random());
  // 运动员到达最大速度的时间
  this.timeToFast = (-3 / 98 * this.force) + (395 / 98);
  // 定义运动员的体力
  this.strength = 1 + Math.floor(98 * Math.random());
  // 运动员保持最大速度的时间
  this.keepTime = (5 / 98 * this.strength) + (975 / 98);
}

// 描绘运动员
Player.prototype.generatePlayer = function (domwrapper) {
  this.dom.style.left = Math.floor(globalStartX + this.startX * globalUnit) + 'px';
  this.dom.style.top = Math.floor(globalStartY + this.startY * globalUnit) + 'px';
  domwrapper.append(this.dom);
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

  // 根据开始的位置与结束的位置计算距离
  var distance = Math.floor(Math.sqrt(Math.pow(this.endX - this.startX, 2) + Math.pow(this.endY - this.startY, 2)));
  // 计算运动时间，然后根据这个时间产生一个模拟的贝塞尔曲线运动方式，计算时，必须将运动员的速度提升假设为线性的，
  // 也就是加速度必须为一个定值
  // 将距离的计算分为三个部分，加速阶段；匀速阶段；减速阶段
  // 加速的加速度
  console.log('这儿是distance');
  console.log(distance);
  this.a = this.VMax / this.timeToFast;
  console.log('这儿是加速度');
  console.log(this.a);
  // 加速阶段
  var accelerateStage = 0.5 * this.a  * Math.pow(this.timeToFast, 2);
  console.log('这儿是加速阶段的距离');
  console.log(accelerateStage);
  // 匀速阶段
  var uniformState = this.VMax * this.keepTime;
  console.log('这儿是匀速阶段');
  console.log(uniformState);

  var time;
  if (distance > accelerateStage + uniformState) {
    console.log('1111111111');
    // 定义减速的加速度,根据公式 2as = Vt^2 - V0^2;
    var a = -Math.pow(this.VMax, 2) / (2 * (distance - accelerateStage - uniformState))
    time = this.timeToFast + this.keepTime + this.VMax / a;
  } else if (distance > accelerateStage) {
    console.log('2222222222');
    time = this.timeToFast + (distance - accelerateStage) / this.VMax;
  } else if (distance < accelerateStage) {
    console.log('3333333333');
    time = Math.sqrt(2 * distance / this.a);
  } else {
    console.log('4444444444');
  }
  console.log('这儿是time');
  console.log(time);
  this.dom.style.transition = `all ${time}s cubic-bezier(0.75, 0, 0.26, 0.98)`
}
/**
 * 运动员开始跑的函数
 */
Player.prototype.run = function () {
  this.dom.style.left = Math.floor(globalStartX + this.endX * globalUnit) + 'px';
  this.dom.style.top = Math.floor(globalStartY + this.endY * globalUnit) + 'px';
}

// 创建一个工厂对象
var factoryField = {
  getField(dom) {
    var field;
    field = new footballField(dom);
    Interface.ensureImplement(field, Field);
    return field;
  },
  getPlayer(VNum) {
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
ShopField.prototype.getPlayer = function(VNum) {
  var player = factoryField.getPlayer(VNum);
  return player;
}
var svg = document.querySelector('#svg');
var shopFiledObj = new ShopField();
// 创建一个球场的对象
var svgObj = shopFiledObj.getField(svg);

// 定义一个全局的单位量
var globalUnit = svgObj.unit;

// 定义一个全局变量保存场地的开始坐标
var globalStartX = svgObj.startX;
var globalStartY = svgObj.startY;

// 绘制草坪
svgObj.generateField();
// 绘制场地
svgObj.drawLine();

// 设置playerListWrapper的宽高与足球场地的宽高相同
var playerListWrapper = document.querySelector('.player-list');
playerListWrapper.style.width = svgObj.width + 'px';
playerListWrapper.style.height = svgObj.height + 'px';

var btn = document.querySelector('button');
var player = shopFiledObj.getPlayer(100);
var player1 = shopFiledObj.getPlayer(60);

// 球员设置位置，这是控制一个球员的基本动作，1. 首先是设置开始坐标，2. 渲染球员，3. 设置结束坐标, 4. 在合适的地方开始run
player.setPosition(30, 30);
player.generatePlayer(playerListWrapper);
player.setFinalPosition(100, 60);

player1.setPosition(20, 40);
player1.generatePlayer(playerListWrapper);
player1.setFinalPosition(70, 30);

btn.onclick = function () {
  player.run();
  player1.run();
}