  /**
 * 职员类
 * @param {*} id
 * @param {*} name
 * @param {*} wages
 */
function Staff (id, name, wages) {
  this.id = id;
  this.name = name;
  this.wages = wages;
}
Staff.prototype.work = function () {

}
/**
 * 服务员
 */
var getWaiter = (function () {
  var instance = null;
  function Waiter (id, name, wages) {
    Staff.call(this, id, name, wages);
    // 通过order记录菜单
    this.order = [];
    Waiter.prototype = new Staff();
    Waiter.prototype.constructor = Waiter;
  }
  Waiter.prototype.work = function () {
    var arr = Array.from(arguments);
    // 如果参数是数组,则记录客人点菜
    if (Array.isArray(arr[0])) {
      // arr[0].slice().forEach(ele => {
      //   this.order.push(Object.assign({}, ele));
      // });
      this.order = arr[0].slice();
    } else {
      var index = this.order.findIndex(function (value) {
        return value.name === arguments[0].name;
      })
      this.order.splice(index, 1);
      return arguments[0];
    }
  }
  return {
    getInstance: function (id, name, wages) {
      if (!instance) {
        instance = new Waiter(id, name, wages);
      }
      return instance;
    }
  }
})()

// 顾客吃菜过程中发生的事情
function customEatProcess(res, Customer) {
  // 顾客吃菜，将当前菜的状态修改为正在吃，通过Customer.orderFoods.length查找dom
  // let foodsLength = Customer.orderFoods.length;
  // let childrenLength = customFoodUl.children.length;

  // 取第一个包含'data-mark'属性的li标签
  var customFoodUlChild_1 = customFoodUl.querySelector('li[data-mark]');
  var customFoodUlChildState = customFoodUlChild_1.querySelector('.state');
  var customFoodUlChildTime = customFoodUlChild_1.querySelector('time');
  // 为已经上菜的li修改状态          
  customFoodUlChildState.innerText = '正在吃';
  // 同时显示还剩多少秒吃完
  let num = 3;
  let timer = setInterval(() => {
    num--;
    // var customFoodUlChild_1 = customFoodUl.querySelector('li[data-mark]');
    // var customFoodUlChildState = customFoodUlChild_1.querySelector('.state');
    // var customFoodUlChildTime = customFoodUlChild_1.querySelector('time');

    customFoodUlChildTime.innerText = `还有${num}秒钟吃完`;
    if (num === 0) {
      // 这儿再次获取一次
      // var customFoodUlChild_1 = customFoodUl.querySelector('li[data-mark]');
      // var customFoodUlChildState = customFoodUlChild_1.querySelector('.state');
      // var customFoodUlChildTime = customFoodUlChild_1.querySelector('time');

      // 将'已吃完的li标签'的标记属性去掉
      customFoodUlChild_1.removeAttribute('data-mark');
      clearInterval(timer); 
      
      // 吃完后将状态修改为'已吃完',同时将时间部分的显示置为空
      customFoodUlChildState.innerText = '已吃完';
      customFoodUlChildState.style.color = '#666';
      customFoodUlChildTime.innerText = '';
      // 顾客将一道菜吃完以后，它的orderFoods的长度就会少一个
      Customer.eat(res);
      if (Customer.orderFoods.length === 0) {
        resolveTemp(priceTemp);
        return
      }
      // 取出下一个具有标记属性的标签，如果有的话，那么说明还有饭没有开始吃，
      // 那么就继续执行customEatProcess整个过程
      var customFoodUlChild_2 = customFoodUl.querySelector('li[data-mark]');
      if (customFoodUlChild_2) {
        var customFoodUlChildName = customFoodUlChild_2.querySelector('.name').innerText;        
        let nextFood = {};
        // 遍历参考菜单menuRefer，找到正在吃的那个菜
        menuRefer.forEach(ele => {
          if (ele.name === customFoodUlChildName) {
            nextFood = Object.assign({}, ele);
          }
        })
        customEatProcess(nextFood, Customer)
      }
    }
  }, 1000);
}

/**
 * 厨师做完一个菜的整个流程
 * @param {*} item 菜品
 * @param {*} cooker 厨师
 * @param {*} waiter 服务员
 * @param {*} Customer 顾客
 */
function cookFood (item, cooker, waiter, Customer, price) {
  return new Promise(function (resolve, reject) {
    // 将样式显示
    cookStateTime.style.display = 'inline-block';
    // 首先计算将菜做完所需要的时间
    let num = Math.floor(item.time / 1000);
    // 通过定时器显示还有多久将菜做完
    cookState.innerText = `正在做${item.name}`;    
    var cookTimer = setInterval(() => {
      num--;
      cookStateTime.innerText = `还差${num}秒钟做完`;
      // 说明这个菜已经做完了
      if (num <= 0) {

        // 将菜单列表里面对应的dom变成灰色
        var cookFoodList = document.querySelectorAll('.cook li');
        if (cookFoodList) {
          cookFoodList.forEach((ele, index) => {
            if (ele.innerText === item.name) {
              cookFoodList[index].style.color = "#999";
              // 此时说明已经是最后一个菜了，将厨师的菜单列表清空
              if (index === (cookFoodList.length - 1)) {
                // 将状态置为空闲
                cookState.innerText = '空闲'
                // 将时间显示隐藏
                cookStateTime.style.display = 'none';
                cookFoodUl.innerHTML = '';
              }
              return false;            
            }
          })
        }
        // 关闭定时器
        clearInterval(cookTimer);
      }
    }, 1000)

    setTimeout(() => {
      // 厨师做好一个菜
      cooker.handleFood(item);
      // 马上又做另外一个
      resolve();
      var pWaiter = Promise.resolve(item);
      // 服务员上菜的过程需要0.5s的时间，同时通过动画，让服务员跑到顾客那儿
      waiterDom.style.webkitTransform = 'translateX(0)';
      
      setTimeout(() => {
        // 服务员上菜后马上又跑到厨师那儿
        var x = -(box.offsetWidth - 500) + 'px';
        waiterDom.style.webkitTransform = `translateX(${x})`;
        
        pWaiter.then(res => {
          var food = waiter.work(res);
          menuRefer.forEach((ele, index) => {
            if (ele.name === res.name) {
              var customFoodUlChild = customFoodUl.children[index];
              // 将对应的菜的状态修改为已上菜
              customFoodUlChild.querySelector('.state').innerText = '已上菜';
              // 将对应的菜设置标记属性
              customFoodUlChild.setAttribute('data-mark', 'success');
              
              console.log('这儿是li[data-mark]这个标签的长度');
              console.log(customFoodUl.querySelectorAll('li[data-mark]').length);
              // 如果标记的data-mark的个数只有一个，说明上的菜已经吃完了,或者是第一次上菜，那么就调用一次顾客吃菜的过程
              if (customFoodUl.querySelectorAll('li[data-mark]').length === 1) {
                let nextFood = {};

                var customFoodUlChildName = customFoodUlChild.querySelector('.name').innerText;
                // 遍历参考菜单menuRefer，找到正在吃的那个菜
                menuRefer.forEach(ele => {
                  if (ele.name === customFoodUlChildName) {
                    nextFood = Object.assign({}, ele);
                  }
                })
                customEatProcess(nextFood, Customer);
              }
            }
          });
        })
      }, 500)
    }, +item.time)
  })
}

async function fn (menu, cooker, waiter, Customer) {
  var price = 0;
  for (var i = 0; i < menu.length; i++) {
    price += (+menu[i].price);
    if (i === (menu.length - 1)) {
      priceTemp = price;
    }
    await cookFood(menu[i], cooker, waiter, Customer)
  }
}
/**
 * 厨师类
 * @param {*} id
 * @param {*} name
 * @param {*} wages
 */
var getCook = (function () {
  var instance = null;
  function Cook (id, name, wages) {
    Staff.call(this, id, name, wages);
    Cook.prototype = new Staff();
    Cook.prototype.constructor = Cook;
  }
  /**
   * 厨师工作
   * @param {*} cooks 菜品
   * @param {*} waiter 送菜的服务员
   * @param {*} Customer 顾客
   */
  Cook.prototype.work = function (menu1, waiter, Customer) {
    // 通过menu将菜单列表显示到厨师的烹饪菜单上面
    var cookMenuHtml = '';
    menu1.forEach(res => {
      cookMenuHtml += `<li>${res.name}</li>`
    })
    cookFoodUl.innerHTML = cookMenuHtml;
    var _this = this;
    return new Promise(function(resolve, reject) {
    resolveTemp = resolve;      
      fn(menu1.slice(), _this, waiter, Customer);
    })
  }

  Cook.prototype.handleFood = function (item) {
    console.log('菜品：' + item.name + '完成了');
  }
  return {
    getInstance: function (id, name, wages) {
      if (!instance) {
        instance = new Cook(id, name, wages);
      }
      return instance;
    }
  }
})();

/**
 *顾客类
 */
function Customer (obj) {
  // 通过orderFoods记录顾客所点菜品
  this.orderFoods = [];
  this.name = obj.name;
  this.picPath = obj.picPath;
}
/**
 * 顾客吃食物
 * @param {*} food 每次只吃一份
 */
Customer.prototype.eat = function (food) {
  var index = this.orderFoods.findIndex(function(value) {
    return value.name = food.name;
  })
  // 将菜单上的内容减少一个
  this.orderFoods.splice(index, 1);
}
/**
 * 随机点多个菜
 * @param {*} menu 为菜单，是一个数组
 */
Customer.prototype.order = function (menu) {
  // 将menu打乱
  var length = menu.length;
  var arrTemp = menu.slice();
  var randomIndex = 0;
  var temp = {};
  for (var i = 0; i < arrTemp.length; i++) {
    randomIndex = Math.floor(Math.random() * (length - 1));
    temp = Object.assign({}, arrTemp[randomIndex]);
    arrTemp[randomIndex] = Object.assign({}, arrTemp[length - randomIndex -1]);
    arrTemp[length - randomIndex -1] = temp;
  }
  randomIndex = Math.floor(Math.random() * length);
  // 保证至少点一个菜
  if (randomIndex === 0 ){
    randomIndex = 1;
  }
  this.orderFoods = arrTemp.slice(0, randomIndex);
  return this.orderFoods.slice();
}

Customer.prototype.pay = function (money) {
  console.log('顾客应付: ' + money + '元');
}

function process (menu, cook, customer, waiter, resolveProcess) {
  domInit(); // 对dom进行初始化

  // 在这儿替换掉顾客的信息
  customPic.setAttribute('src', customer.picPath);
  customName.innerText = customer.name;

  // 每进来一次就将customers的第一个删除
  customers.shift();
  var custLength = customers.length
  // 更新顾客列表的信息
  customListState.innerText = `还有${custLength}位等待用餐`;
  var strHtml = '';
  for (var i = 0; i < custLength; i++) {
    strHtml += '<li>' + customers[i].name + '</li>'
  }
  customUl.innerHTML = strHtml;
  // 在顾客点菜的时候将厨师状态的时间隐藏
  cookState.innerText = '空闲';
  cookStateTime.style.display = 'none';

  // 顾客点菜，通过Promise的方式
  var orderPromise = new Promise(function(resolve, reject) {
    // 在这儿修改顾客的状态
    customState.innerText = '点菜中';
    var mark = 3;
    var timer1 = setInterval(() => {
      mark--;
      customStateTime.innerText = `还有${mark}秒钟点好`;
      if (mark === 0) {
        clearInterval(timer1);
        customState.innerText = '点菜完毕';
        customStateTime.style.display = "none";
      }
    }, 1000)
    setTimeout(() => {
      var foods = customer.order(menu);
      // 将客户点的菜单赋给参考菜单
      menuRefer = foods.slice();
      var strHtml = '';
      // 将点的菜显示到列表中
      for (var i = 0, len = foods.length; i < len; i++) {
        strHtml += `<li><span class="name">${foods[i].name}</span>&nbsp;&nbsp;&nbsp;<span class="state">还未吃</span><time></time></li>`
      }
      customFoodUl.innerHTML = strHtml;
      resolve(foods);
    }, 3000);
  })
  orderPromise.then(res => {
    // 服务员记菜，记录的菜保存到waiterA.order里面
    waiter.work(res.slice());

    var x = -(box.offsetWidth - 500) + 'px';
    // 服务员将菜记录完毕以后就要花0.5个单位时间到达厨师那儿
    waiterDom.style.webkitTransform = `translateX(${x})`;

    setTimeout(() => {
      // 厨师开始烹饪，每烹饪一个菜就叫服务员上菜，同时开始做下一个菜
      cook.work(waiter.order, waiter, customer).then((res) => {
        
        // 服务员跑到顾客这儿来结账
        waiterDom.style.webkitTransform = 'translateX(0)';
        setTimeout(() => {
          // 顾客付账
          customer.pay(res);
          // 更新餐厅的现金
          restaurantCash.innerText = +restaurantCash.innerText + res;
          // 如果是最后一个顾客，那么在该图片处显示无人的图片, 同时清空列表     
          if (customers.length === 0) {
            customPic.setAttribute('src', './images/noPerson.png');
            customName.innerText = '无人';
            customFoodUl.innerHTML = '';
          }
          // 完成该await;
          resolveProcess();
        }, 500)
      })
    }, 500)
  })
}
// 放顾客的数组
var customers = [];
var cusArr = [
  {
    name: '张三',
    picPath: './images/custom.jpg'
  }, {
    name: '李四',
    picPath: './images/custom1.jpg'
  }, {
    name: '王二',
    picPath: './images/custom2.jpg'
  }, {
    name: '麻子',
    picPath: './images/custom3.jpg'
  }, {
    name: '周助',
    picPath: './images/custom5.jpg'
  }]

  // var cusArr = [
  //   {
  //     name: '张三',
  //     picPath: './images/custom.jpg'
  //   }]

// 实现一个顾客队列
for (var i = 0, len = cusArr.length; i < len; i++) {
  customers.push(new Customer(cusArr[i]));
}

// 实现一个菜单
var menu = [
  {name: 'apple' , price: '5', time: '1000'},
  {name: 'rice', price: '1', time: '2000'},
  {name: 'meat', price: '11', time: '3000'},
  {name: 'orange' , price: '5', time: '1000'},
  {name: 'milk', price: '1', time: '2000'},
  {name: 'duice', price: '11', time: '3000'}
]

function processSingle (costomer) {
  return new Promise(function(resolve, reject) {
    process(menu, cookA, costomer, waiterA, resolve);
  })
}

async function processAll (customArr) {
  for(var i = 0; i < customArr.length; i++) {
    await processSingle(customArr[i])
  }
}

function domInit () {
  customStateTime.style.display = 'inline-block';
  customFoodUl.innerHTML = '';
  // 每次有新客户，都让顾服务员到客户那儿去
  waiterDom.style.webkitTransform = 'translateX(0)';
  // 重置参考菜单
  menuRefer.length = 0;
}
// 一个服务员
var waiterA = getWaiter.getInstance('12345', 'tony', '2000');
// 一个厨师
var cookA = getCook.getInstance('11111', 'tom', '5000');
// 定义一个全局变量作为菜单的参考
var menuRefer = [];
// 餐厅的现金
var restaurantCash = document.querySelector('.restaurant-cash span');
// 顾客图片
var customPic = document.querySelector('.custom img');
// 顾客姓名
var customName = document.querySelector('.custom-msg .name');
// 提示还有多少位等待用餐
var customListState = document.querySelector('.custom-list .state');
// 顾客列表
var customUl = document.querySelector('.custom-list ul');
// 顾客点菜的状态
var customState = document.querySelector('.custom .state .ordering');
// 顾客状态的时间
var customStateTime = document.querySelector('.custom .state .time');
// 顾客点菜的列表
var customFoodUl = document.querySelector('.custom .list ul');
// 服务员
var waiterDom = document.querySelector('.waiter');
// 厨师做菜的状态
var cookState = document.querySelector('.cook .cooking');
// 厨师做菜的时间
var cookStateTime = document.querySelector('.cook .time');
// 厨师的菜单列表
var cookFoodUl = document.querySelector('.cook ul');
// 提示牌右边的所有部分
var box = document.querySelector('.box');
var resolveTemp = '';
var priceTemp = '';
processAll(customers.slice());