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
    // 通过eventArr管理服务员的事件集合
    this.eventArr = [];
    // 通过positionFlag标志服务员的位置 0：厨师区， 1：用餐区
    this.positionFlag = 0;
    // 服务员的工作标志位，0：没有工作， 1：正在工作
    this.workFlag = 0;
    Waiter.prototype = new Staff();
    Waiter.prototype.constructor = Waiter;
  }
  /**
   * 厨师添加事件列表的方法
   * @param {*} eventName 
   * @param {*} item 
   */
  Waiter.prototype.addEvent = function (eventName, item) {
    if (typeof item === 'object') {
      var item = Object.assign({}, item);
    }
    let obj = {
      name: eventName,
      item: item
    }
    this.eventArr.push(obj);
    // 如果只有一个，并且工作状态处于空闲的
    if (this.eventArr.length === 1 && this.workFlag === 0) {
      this.work();
    }
  }

  /**
   * 服务员将food送到顾客那儿
   * @param {*} food 
   */
  Waiter.prototype.sendFoodToCustom = function(foodArr) {
    return new Promise((resolve, reject) => {
      var foodText = '';
      foodArr.forEach(ele => {
        foodText += `<div>${ele.name}</div>`;
      })
      // 如果在用餐区，先到厨师那儿去
      if (this.positionFlag == 1) {
        waiterWord.innerText = '来端菜啦';
        waiterDom.style.webkitTransform = `translateX(0)`;
        setTimeout(() => {
          // 这儿通知厨师将已经端走的菜删除
          cookA.decreaseFinishFood(foodArr);
          waiterWord.innerText = '菜来啦';
          document.querySelector('.send-food').innerHTML=`${foodText}`;
          this.positionFlag = 0;
          var x = box.offsetWidth - 590 + 'px';
          waiterDom.style.webkitTransform = `translateX(${x})`;
          setTimeout(() => {
            this.positionFlag = 1;
            resolve();
            document.querySelector('.send-food').innerHTML = '';
            // 这儿通知正在座位上的顾客菜送到了
            this.informCustom(customEffective, foodArr);
          }, 1000)
        }, 1000)
      } else {
        waiterWord.innerText = '菜来啦';
        var x = box.offsetWidth - 590 + 'px';
        waiterDom.style.webkitTransform = `translateX(${x})`;
        document.querySelector('.send-food').innerHTML=`${foodText}`; 
        // 这儿通知厨师将已经端走的菜删除
        cookA.decreaseFinishFood(foodArr);
        setTimeout(() => {
          this.positionFlag = 1;          
          resolve();
          document.querySelector('.send-food').innerText = '';
          // 这儿通知正在座位上的顾客菜送到了
          this.informCustom(customEffective, foodArr);
        }, 1000);
      }
    })
  }
  /**
   * 服务员将菜单送到厨师那儿去
   */
  Waiter.prototype.sendMenuToCook = function (menu) {
    waiterDom.style.webkitTransform = 'translateX(0)';
    setTimeout(() => {
      this.positionFlag = 0;      
      this.informCook(cookA, menu)
    }, 1000)
  }

  /**
   * 服务员拿着菜单让顾客点菜
   * tableNum 通知的桌号
   * menu 菜单
   */
  Waiter.prototype.order = function (tableNum, menu) {
    return new Promise((resolve, reject) => {
      // 如果服务员在厨师那儿，就移动到顾客那儿
      if (this.positionFlag == 0) {
        waiterWord.innerText = '点菜啦';
        let x = box.offsetWidth - 590 + 'px';
        waiterDom.style.webkitTransform = `translateX(${x})`;
        setTimeout(() => {
          this.positionFlag = 1;
          // 然后通知顾客开始点菜
          customEffective.forEach(ele => {
            if (ele.tableNum === tableNum) {
              ele.order(menu).then(res => {
                // waiterDom.style.webkitTransform = 'translateX(0)';
                // this.positionFlag = 0;
                waiterWord.innerText = '菜点好啦';
                this.sendMenuToCook(res);
                setTimeout(() => {
                  // this.informCook(cookA, res);
                  resolve();
                }, 1000)
              })
            }
          })
        }, 1000)
      } else {
        // 直接通知顾客点菜，等顾客将菜点好后，将菜品送到厨师那儿
        customEffective.forEach(ele => {
          if (ele.tableNum === tableNum) {
            ele.order(menu).then(res => {
              // waiterDom.style.webkitTransform = 'translateX(0)';
              // this.positionFlag = 0;
              waiterWord.innerText = '菜点好啦';
              this.sendMenuToCook(res);
              setTimeout(() => {
                // 通知厨师处理菜单
                this.informCook(cookA, res)
                resolve();
              }, 1000)
            })
          }
        })
      }
    })
  }

  /**
   * 通知厨师处理菜单
   */
  Waiter.prototype.informCook = function (cook, menu) {
    // 厨师处理菜单
    cook.processingMenus(menu);
  }

  /**
   * 通知正在用餐的顾客，菜品到了
   */
  Waiter.prototype.informCustom = function (customs, foodArr) {

    let foodArrTemp = [];
    // 将菜品按照不同的饭桌进行分类
    foodArr.forEach(ele => {
      let arr = ele.tableNum.split('&');
      arr.forEach(item => {
        if(!foodArrTemp[+item]) {
          foodArrTemp[+item] = [];
        }
        // 在这儿将ele.tableNum进行修改(1&2 --->1或者2)
        let obj  = Object.assign({}, ele);
        obj.tableNum = item;
        foodArrTemp[+item].push(obj);
      })
    })
    console.log('这儿是通知顾客的食物');
    foodArrTemp.forEach(ele => {
      console.log(ele);
    })

    console.log('这儿是通知的顾客');
    customs.forEach(ele => {
      console.log(ele);
    })
    // 遍历每桌顾客，每个顾客分别接受菜品,foodArrTemp的index为桌号
    foodArrTemp.forEach((ele, index) => {
      customs.forEach(item => {
        if (index == item.tableNum) {
          item.reseiveFood(ele);
        }
      })
    })
  }

  /**
   * 服务员收钱
   */
  Waiter.prototype.reseiveMoney = function(tableNum) {
    return new Promise((resolve, reject) => {
      if(this.positionFlag == 0) {
        waiterWord.innerText = "收钱啦";
        var x = box.offsetWidth - 590 + 'px';
        waiterDom.style.webkitTransform = `translateX(${x})`;
        setTimeout(() => {
          resolve();
          this.positionFlag == 1
          // 让对应桌上的顾客付款
          customEffective.forEach(ele => {
            if(ele.tableNum === tableNum) {
              ele.pay();
            }
          })
          return;
        }, 1000)
      } else {
        waiterWord.innerText = "收钱啦";
        customEffective.forEach(ele => {
          if(ele.tableNum === tableNum) {
            ele.pay();
          }
        })
        resolve();
      }
    })
  }
  /**
   * 服务员工作，就是不停的执行eventArr里面的内容
   */
  Waiter.prototype.work = function () {
    if (this.eventArr.length > 0) {
      this.workFlag = 1;
      if (this.eventArr[0].name === 'pay') {
        this.reseiveMoney(this.eventArr[0].item).then(() => {
          this.eventArr.shift();
          this.work();
        })
      } else if (this.eventArr[0].name === 'order') {
        this.order(this.eventArr[0].item, menuReally).then(() => {
          this.eventArr.shift();
          this.work();
        })
      } else if (this.eventArr[0].name === 'cookInform') {
        var itemArr = [];
        this.eventArr.every(ele => {
          if (ele.name !== 'cookInform') {
            return false;
          }
          itemArr.push(Object.assign(ele.item));
          return true;
        })

        let arr = deepClone(itemArr);
        this.eventArr.splice(0, itemArr.length);
        this.sendFoodToCustom(arr).then(() => {
          this.work();
        })
      } else {
      }
    } else {
      this.workFlag = 0;
      waiterWord.innerText = '我休息啦';
      // 当服务员没有事件的时候，跑到用餐区进行等待
      var x = box.offsetWidth - 590 + 'px';
      waiterDom.style.webkitTransform = `translateX(${x})`;
      this.positionFlag = 1;
      setTimeout(() => {
        waiterWord.innerText = '好闲啦';
      }, 1000);
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

/**
 * 厨师
 */
var getCook = (function () {
  var instance = null;
  function Cook (id, name, wages) {
    Staff.call(this, id, name, wages);
    Cook.prototype = new Staff();
    Cook.prototype.constructor = Cook;
    // 定义厨师的菜单
    this.menu = [];
    // 厨师的工作状态 0：空闲， 1：正在工作
    this.workFlag = 0;
    this.finishFoods = [];
  }
  /**
   * 厨师工作
   */
  Cook.prototype.work = function () {
    // 通过厨师的菜单做菜
    if (this.menu.length > 0) {
      // 将工作状态置为1
      this.workFlag = 1;      
      // 将厨师菜单上面的第一个字号变大，加粗，表示正在烹饪
      // var menuFirst = document.querySelector('.cook ul li');
      // menuFirst.style.fontSize = '14px';
      // menuFirst.style.fontWeight = '700';
      // menuFirst.style.color = 'red';

      var item = this.menu[0];
      var num = +item.time / 1000;
      // 操作厨师的烹饪状态
      cookFoodState.innerHTML =  `正在做${item.name}，还差${num}秒钟做完`;

      var cookTimer = setInterval(() => {
        num--;
        cookFoodState.innerHTML =  `正在做${item.name}，还差${num}秒钟做完`;        
        if (num === 0) {
          clearInterval(cookTimer);
        }
      }, 1000)
      setTimeout(() => {
        // 通知服务员
        this.inform(waiterA, Object.assign({}, this.menu[0]))
        // 烹饪完毕以后，厨师的菜单的第一个减去
        this.menu.shift();
        // 重新渲染厨师菜单
        this.renderCoodMenu();
        // 重新执行厨师工作
        this.work();
      }, item.time)
    } else {
      cookFoodState.innerText =  '空闲中';
      this.workFlag = 0;
    }
  }
  /**
   * 厨师处理菜单，对菜单进行去重处理，将相同菜品的tableNum用标记符号&相加，等服务员用该菜品通知顾客时
   * 再根据这个tableNum找到对应的桌号
   * @param {*} menu 新点的菜单
   */
  Cook.prototype.processingMenus = function (menu) {
    let mark = true;
    for (let i = 0, len = menu.length; i < len; i++) {
      mark = true;
      for (let j = 0, len1 = this.menu.length; j < len1; j++) {
        if (this.menu[j].id == menu[i].id) {
          this.menu[j].tableNum = (this.menu[j].tableNum + '&' + menu[i].tableNum);
          mark = false;
          break;
        }
      }
      if (mark) {
        this.menu.push(Object.assign({}, menu[i]));
      }
    }
    console.log('这儿是去重后的厨师菜单');
    this.menu.forEach(ele => {
      console.log(ele);
    })
    this.renderCoodMenu();
    setTimeout(() => {
      if (this.workFlag === 0) {
        this.work();
      }
    }, 20)    
    // 对菜单进行渲染
  }
  /**
   * 对厨师菜单进行渲染
   */
  Cook.prototype.renderCoodMenu = function () {
    let listHtml = '';
    this.menu.forEach(ele => {
      listHtml += `<li>${ele.name}</li>`
    })
    cookFoodUl.innerHTML = listHtml;
  }

  /**
   * 厨师通知服务员端菜
   * @param {*} waiter 被通知的服务员
   */
  Cook.prototype.inform = function (waiter, ele) {
    this.finishFoods.push(Object.assign(ele));
    waiter.addEvent('cookInform', Object.assign(ele));
    this.renderFinishCook();
  }

  Cook.prototype.renderFinishCook = function () {
    var finishHtml = '';
    this.finishFoods.forEach(item => {
      finishHtml += `<li>${item.name}</li>`;
    })
    cookFinishCookDom.innerHTML = finishHtml;
  }
  /**
   * 厨师将将arr里面的菜从已完成中的菜剔除
   */
  Cook.prototype.decreaseFinishFood = function (arr) {
    for (var i = 0; i < this.finishFoods.length; i++) {
      for(var j = 0; j < arr.length; j++) {
        if (this.finishFoods[i].id === arr[j].id) {
          this.finishFoods.splice(i, 1);
          i--;
          break;
        }
      }
    }
    this.renderFinishCook();
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
 *顾客
 */
function Customer (obj) {
  // 通过orderFoods记录顾客所点菜品
  this.orderFoods = [];
  // 存放已经做好的菜
  this.completeFood = [];
  this.name = obj.name;
  this.picPath = obj.picPath;
  // 记录顾客所在桌号
  this.tableNum = 0;
  // 顾客应付的款
  this.money = 0
}
/**
 * 顾客吃食物，吃的是completeFood里面的内容，顾客每吃一个菜要花3个单位的时间
 * @param {*} food 每次只吃一份
 */
Customer.prototype.eat = function () {
  if (this.completeFood.length > 0) {
    let food = Object.assign({}, this.completeFood[0]);
    let customTable = document.querySelectorAll('.table')[this.tableNum];
    let customFoodList = customTable.querySelectorAll('li');
    let curtomFoodState = null;
    let curtomFoodTime = null;

    // console.log('这儿是food.id');
    // console.log(food.id);
    customFoodList.forEach(ele => {
      // console.log('这儿是dataser.id');
      // console.log(ele.dataset.id)
      if (ele.dataset.id == food.id) {
        curtomFoodState = ele.querySelector('.state');
        curtomFoodTime = ele.querySelector('time');
      }
    })

    // console.log('这儿是curtomFoodState');
    // console.log(curtomFoodState);

    // console.log('这儿是curtomFoodTime');
    // console.log(curtomFoodTime);
    let culcuNum = 3;
    curtomFoodState.style.display = "inline-block";
    curtomFoodTime.style.display = "inline-block";

    curtomFoodState.innerText = '正在吃'
    curtomFoodTime.innerText = `还有${culcuNum}吃完`;

    var customEatTimer = setInterval(() => {
      culcuNum--;
      // 修改正在吃的菜的状态
      curtomFoodTime.innerText = `还有${culcuNum}吃完`;
      if (culcuNum === 0) {
        curtomFoodState.innerText = '已吃完';
        curtomFoodState.parentNode.style.color = '#999';
        curtomFoodTime.style.display = "none";
        clearInterval(customEatTimer);

        // 将顾客的菜单列表减少一个
        let index = this.orderFoods.findIndex(function(value) {
          return value.id == food.id;
        })
        this.orderFoods.splice(index, 1);
        // 将顾客已完成的菜减少一个
        // index = this.completeFood.findIndex(function(value) {
        //   return value.id == food.id;
        // })
        // this.completeFood.splice(index, 1);
        this.completeFood.shift();

        // 此时说明已经吃完了
        if (this.orderFoods.length === 0) {
          // 通知服务员来收钱
          this.informWaiterToPay(this.tableNum);
        }
        // 吃完后再吃下一道菜
        this.eat();
      }
    }, 1000)
  }
}
/**
 * 随机点多个菜，顾客点菜要花3个单位时间
 * @param {*} menu 为菜单模板，是一个数组
 */
Customer.prototype.order = function (menu) {
  return new Promise((resolve, reject) => {
    var customTable = document.querySelectorAll('.table')[this.tableNum];
    var orderState = customTable.querySelector('.order-state');
    let culcuNum = 3;
    // 修改状态
    var customOrderTimer = setInterval(() => {
      culcuNum--;
      orderState.innerText = `点菜中，还有${culcuNum}秒钟点好`;
      if(culcuNum === 0) {
        clearInterval(customOrderTimer);
        orderState.innerText = `点菜中已完成`;
      }
    }, 1000);
  
    setTimeout(() => {
      var length = menu.length;
      var arrTemp = deepClone(menu);
      var randomIndex = 0;
      var temp = {};
      // 将菜单打乱
      for (var i = 0; i < arrTemp.length; i++) {
        randomIndex = Math.floor(Math.random() * (length - 1));
        temp = Object.assign({}, arrTemp[randomIndex]);
        arrTemp[randomIndex] = Object.assign({}, arrTemp[length - randomIndex -1]);
        arrTemp[length - randomIndex -1] = temp;
      }
      randomIndex = Math.floor(Math.random() * length);
      // 保证至少点一个菜
      if (randomIndex === 0 ) {
        randomIndex = 1;
      }
      this.orderFoods = arrTemp.slice(0, randomIndex);
      // 为菜品加上tableNum,送菜的时候才知道是哪桌点的菜
      this.orderFoods.forEach(ele => {
        ele.tableNum = this.tableNum + '';
        // 将所有菜品的价格之和放到顾客的price属性里面
        this.money += (+ele.price);
      })
      // 将菜单列表进行渲染
      renderCustomList(this.tableNum, arrTemp.slice(0, randomIndex));
      resolve(arrTemp.slice(0, randomIndex));
    }, 3000)
  })
}
/**
 * 渲染顾客菜单列表
 * @param {*} num
 * @param {*} menu
 */
function renderCustomList (num, menu) {
  var renderTable = document.querySelectorAll('.table')[num];
  var rederUl = renderTable.querySelector('ul');
  var listHtml = '';
  menu.forEach((ele, index) => {
    listHtml += `<li data-id="${ele.id}" data-mark="waiting"><span class="name">${ele.name}</span><span class="state">未上菜</span><time style="display:none"></time></li>`
  })
  rederUl.innerHTML = listHtml;
}

/**
 * 顾客付款
 */
Customer.prototype.pay = function () {
  // 将顾客所在的座位置为空
  tableArr.forEach((ele) => {
    if (ele.num == this.tableNum) {
      ele.isFree = true;
    }
  })

  // 修改餐厅的金额
  restaurantCash.innerText = +restaurantCash.innerText + (+this.money);

  // 将顾客的菜单列表清空
  let customTable = document.querySelectorAll('.table')[this.tableNum];
  let customFoodUl = customTable.querySelector('ul');
  customFoodUl.innerHTML = '';
  let index = customEffective.findIndex((value) => {
    return value.tableNum === this.tableNum;
  })
  customEffective.splice(index, 1);

  if (queues.length > 0) {
    // 让顾客列表的第一个进入餐厅
    var obj = queues.shift();
    obj.come();
    // **************************************************
    // customEffective.push(Object.assign(obj));
    // 重新渲染排队列表
    renderCustom(queues, CastomDom);
  } else {
    // 将图片设置为无人
    var customPic = customTable.querySelector('img');
    var customName = customTable.querySelector('.name');
    var customOrderState = customTable.querySelector('.order-state');
    customPic.setAttribute('src', './images/noPerson.jpg');
    customName.innerText = '无人';
    customOrderState.innerText = '空闲中';
  }
}
// 通知服务员来收钱
Customer.prototype.informWaiterToPay = function (tableNum) {
  waiterA.addEvent('pay', tableNum);
}
/**
 * 顾客来到
 */
Customer.prototype.come = function () {
  // 为顾客分配桌号
  tableArr.every(ele => {
    if(ele.isFree === true) {
      this.tableNum = ele.num;
      ele.isFree = false;
      return false;
    }
    return true;
  })
  if(customEffective.length < 3) {
    customEffective.push(this);
  }
  console.log(customEffective);
  // 替换对应的桌号上面的图片和名字
  var customTable = document.querySelectorAll('.table')[this.tableNum];
  var customImg = customTable.querySelector('img');
  var customName = customTable.querySelector('.name');
  customImg.setAttribute('src', this.picPath);
  customName.innerText = this.name;
  // 然后通知服务员来点菜
  waiterA.addEvent('order', this.tableNum);
  // 通知让服务员开始工作
  if (waiterA.workFlag === 0) {
    waiterA.work();
  }
}
/**
 * 顾客接受食物
 */
Customer.prototype.reseiveFood = function (foodArr) {
  // console.log('这儿是接收到的foodArr');
  // console.log(foodArr);
  var foodArrTemp = deepClone(foodArr);
  // 将顾客对应dom的对应菜品状态进行修改
  var customTable = document.querySelectorAll('.table')[this.tableNum];
  var foodList = customTable.querySelectorAll('ul li[data-mark]');
  foodList.forEach(ele => {
    var foodItemId = ele.dataset.id;
    foodArrTemp.every(item => {
      if (foodItemId == item.id) {
        // 将菜品的状态修改成'已上菜'
        var itemState = ele.querySelector('.state');
        itemState.innerText = '已上菜';
        // 同时将标记的菜单去除标记
        ele.removeAttribute('data-mark');
        // 将菜品放到已完成的菜品里面
        this.completeFood.push(Object.assign({}, item));
        // 如果菜品只有一道，那么顾客已经将前面的菜吃完了，或者这是第一道菜
        if (this.completeFood.length === 1) {
          this.eat();
        }
        return false;
      }
      return true;
    })
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

/**
 * 
 * @param {*} n 时间单位
 * @param {*} m 产生的顾客数 ，1-5
 * @param {*} cusTemp 用来产生顾客的模板
 * @param {*} queues 将产生的顾客存放的数组，保证queues只有10个数
 */
function produceCustomersRamdom (n, m, cusTemp, queues) {
  var time = n * 1000;
  var cusTemp = deepClone(cusTemp);
  setInterval(() => {
    // 将cusTemp打乱后，取出前m个顾客，放到queues里面
    for (var i = 0; i < cusTemp.length; i++) {
      var randomNum = Math.floor((Math.random() * (cusTemp.length - 1)));
      var temp = cusTemp[randomNum] ;
      cusTemp[randomNum] = cusTemp[cusTemp.length - 1 -randomNum];
      cusTemp[cusTemp.length - 1 - randomNum] = temp;
    }
    // var queuesTemp = deepClone(queues);
    // queuesTemp = queuesTemp.concat(cusTemp.slice(0, m));
    // // 对customers进行裁剪，保证其只有10个
    queues.push(...cusTemp.slice(0, m));

    queues.splice(10);
    // 将这10个游客进行渲染
    renderCustom(queues, CastomDom);
  }, time);
}

/**
 * 将arr循环产生dom放到排队列表里面
 * @param {*} arr 
 */
function renderCustom(arr, dom) {
  let customersHtml = '';
  var lineUpState = document.querySelector('.custom-list .state');
  lineUpState.innerText = `还有${arr.length}位等待用餐`
  arr.forEach(ele => {
    customersHtml += `<li>${ele.name}</li>`;
  });
  dom.innerHTML = customersHtml;
}

// 一个服务员
var waiterA = getWaiter.getInstance('12345', 'tony', '2000');
// 一个厨师
var cookA = getCook.getInstance('11111', 'tom', '10000');

// 餐厅的现金
var restaurantCash = document.querySelector('.restaurant-cash span');
// 获取所有的餐桌
var tableList = document.querySelectorAll('.custom-wrapper .table');
// 排队顾客标签
var CastomDom = document.querySelector('.custom-list ul');
// 厨师的烹饪状态cook
var cookFoodState = document.querySelector('.cook .food .state');
// 厨师的菜单列表
var cookFoodUl = document.querySelector('.cook .list ul');
// 服务员
var waiterDom = document.querySelector('.waiter-wrapper');
// 服务员说的话
var waiterWord = document.querySelector('.waiter-wrapper .word');
// 提示牌右边的所有部分
var box = document.querySelector('.box');
// 厨师已经完成的菜品
var cookFinishCookDom = document.querySelector('.finish-foods ul');

// 正在餐桌上的顾客
var customEffective = [];
// 定义现在桌子的情况
var tableArr = [
  {
    num: 0,
    isFree: true
  },
  {
    num: 1,
    isFree: true
  },
  {
    num: 2,
    isFree: true
  }
];
// 定义全局变量作为菜单的参考
var menuRefer = [];
// 定义全局变量实现一个菜单
var menuReally = [
  {id: '0', name: '番茄炒蛋' , price: '8', time: '1000'},
  {id: '1', name: '辣子鸡', price: '28', time: '2000'},
  {id: '2', name: '地三鲜', price: '24', time: '3000'},
  {id: '3', name: '大盘鸡' , price: '35', time: '1000'},
  {id: '4', name: '糖醋鱼', price: '26', time: '2000'},
  {id: '5', name: '杂酱面', price: '8', time: '3000'}
]
// 定义一个顾客排队的列表
// var queues = deepClone(customers).slice(0, 3);
var queues = [];

var testArr = deepClone(customers).slice(0, 3);

// 每5秒随机产生3个顾客，然后进行渲染
// produceCustomersRamdom(5, 3, customers, queues);

testArr.forEach(ele => {
  ele.come();
})

window.onresize = function () {
  var box = document.querySelector('.box');

  if (waiterA.positionFlag == 1) {
    var x = box.offsetWidth - 590 + 'px';
    waiterDom.style.webkitTransform = `translateX(${x})`;
  }
}