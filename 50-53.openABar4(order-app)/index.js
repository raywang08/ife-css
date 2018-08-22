  /**
 * 职员类
 * @param {*} id
 * @param {*} name
 * @param {*} wages
 */
function Staff (id, name, wages, picPath) {
  this.id = id;
  this.name = name;
  this.wages = wages;
  this.picPath = picPath;
}
Staff.prototype.work = function () {

}
/**
 * 服务员, 因为服务员是多个，所以不能是单例模式
 */
function Waiter (id, name, wages, picPath) {
  Staff.call(this, id, name, wages, picPath);
  // 通过eventArr管理服务员的事件集合
  // 通过positionFlag标志服务员的位置 0：厨师区， 1：用餐区
  this.positionFlag = 0;
  // 服务员的工作标志位，0：没有工作， 1：正在工作
  this.workFlag = 0;
  // Waiter.prototype = new Staff();
  // Waiter.prototype.constructor = Waiter;
}
/**
 * 厨师添加事件列表的方法
 * @param {*} eventName 
 * @param {*} item 
 */

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
    let index = +this.id;
    let dom = waiterDom.querySelectorAll('.waiter')[index];
    let domWord = dom.querySelector('.word');
    // 如果在用餐区，先到厨师那儿去
    if (this.positionFlag == 1) {
      domWord.innerText = '来端菜啦';
      dom.style.webkitTransform = `translateX(0)`;
      setTimeout(() => {
        // 这儿通知厨师将已经端走的菜删除
        decreaseFinishFood(foodArr);
        domWord.innerText = '菜来啦';
        dom.querySelector('.send-food').innerHTML=`${foodText}`;
        this.positionFlag = 0;
        var x = box.offsetWidth - 820 + 'px';
        dom.style.webkitTransform = `translateX(${x})`;
        setTimeout(() => {
          this.positionFlag = 1;
          resolve();
          dom.querySelector('.send-food').innerHTML = '';
          // 这儿通知正在座位上的顾客菜送到了
          this.informCustom(customEffective, foodArr);
        }, 1000)
      }, 1000)
    } else {
      domWord.innerText = '菜来啦';
      var x = box.offsetWidth - 820 + 'px';
      dom.style.webkitTransform = `translateX(${x})`;
      dom.querySelector('.send-food').innerHTML=`${foodText}`; 
      // 这儿通知厨师将已经端走的菜删除
      decreaseFinishFood(foodArr);
      setTimeout(() => {
        this.positionFlag = 1;          
        resolve();
        dom.querySelector('.send-food').innerText = '';
        // 这儿通知正在座位上的顾客菜送到了
        this.informCustom(customEffective, foodArr);
      }, 1000);
    }
  })
}
/**
 * 服务员将菜单送到厨师那儿去
 */
// Waiter.prototype.sendMenuToCook = function (menu) {
//   let index = +this.id;
//   let dom = waiterDom.querySelectorAll('.waiter')[index];
//   dom.style.webkitTransform = 'translateX(0)';
//   setTimeout(() => {
//     this.positionFlag = 0;      
//     this.informCook(menu)
//   }, 1000)
// }

/**
 * 服务员拿着菜单让顾客点菜
 * tableNum 通知的桌号
 * menu 菜单
 */
// Waiter.prototype.order = function (tableNum, menu) {
//   return new Promise((resolve, reject) => {
//     let index = +this.id;
//     var dom = waiterDom.querySelectorAll('.waiter')[index];
//     let domWord = dom.querySelector('.word');

//     // 如果服务员在厨师那儿，就移动到顾客那儿
//     if (this.positionFlag == 0) {
//       domWord.innerText = '点菜啦';
//       let x = box.offsetWidth - 820 + 'px';
//       dom.style.webkitTransform = `translateX(${x})`;
//       setTimeout(() => {
//         this.positionFlag = 1;
//         // 然后通知顾客开始点菜
//         customEffective.forEach(ele => {
//           if (ele.tableNum === tableNum) {
//             ele.order(menu).then(res => {
//               domWord.innerText = '菜点好啦';
//               this.sendMenuToCook(res);
//               setTimeout(() => {
//                 resolve();
//               }, 1000)
//             })
//           }
//         })
//       }, 1000)
//     } else {
//       // 直接通知顾客点菜，等顾客将菜点好后，将菜品送到厨师那儿
//       customEffective.forEach(ele => {
//         if (ele.tableNum === tableNum) {
//           domWord.innerText = '点菜啦';
//           ele.order(menu).then(res => {
//             domWord.innerText = '菜点好啦';
//             this.sendMenuToCook(res);
//             setTimeout(() => {
//               // 通知厨师处理菜单
//               resolve();
//             }, 1000)
//           })
//         }
//       })
//     }
//   })
// }

/**
 * 通知厨师处理菜单
 */
// Waiter.prototype.informCook = function (menu) {
//   // 厨师处理菜单
//   processingMenus(menu);
// }

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
    let index = +this.id;
    let dom = waiterDom.querySelectorAll('.waiter')[index];
    let domWord = dom.querySelector('.word');
    if(this.positionFlag == 0) {
      domWord.innerText = "收钱啦";
      var x = box.offsetWidth - 820 + 'px';
      dom.style.webkitTransform = `translateX(${x})`;
      setTimeout(() => {
        this.positionFlag == 1
        // 让对应桌上的顾客付款
        customEffective.every(ele => {
          if(ele.tableNum === tableNum) {
            ele.pay();
            return false
          }
          return true
        })
        resolve();        
        return;
      }, 1000)
    } else {
      domWord.innerText = "收钱啦";
      customEffective.every(ele => {
        if(ele.tableNum === tableNum) {
          ele.pay();
          return false
        }
        return true
      })
      resolve();
    }
  })
}
/**
 * 服务员工作，就是不停的执行eventArr里面的内容
 */
Waiter.prototype.work = function (eventItem) {
  // 增加一个属性作为标记
  this.workFlag = 1;
  if (eventItem.name === 'pay') {
    this.reseiveMoney(eventItem.item).then(() => {
      if (eventArr.length > 0) {
        this.work(eventArr.shift());
      } else {
        this.rest();
      }
    })
  } 
  // else if (eventItem.name === 'order') {
  //   this.order(eventItem.item, menuReally).then(() => {
  //     if (eventArr.length > 0) {
  //       this.work(eventArr.shift());
  //     } else {
  //       this.rest();
  //     }
  //   })
  // }
  else if (eventItem.name === 'cookInform') {
    // 将已完成的菜品端给顾客
    var arr = deepClone(cookFinishMenu);
    this.sendFoodToCustom(arr).then(() => {
      if (eventArr.length > 0) {
        this.work(eventArr.shift());
      } else {
        this.rest();
      }
    })
  } else {
  }
}

Waiter.prototype.rest = function () {
  let index = +this.id;
  let dom = waiterDom.querySelectorAll('.waiter')[index];
  let domWord = dom.querySelector('.word');
  domWord.innerText = '我休息啦';
  // 当服务员没有事件的时候，跑到用餐区进行等待
  if (this.positionFlag === 0) {
    var x = box.offsetWidth - 820 + 'px';
    dom.style.webkitTransform = `translateX(${x})`;
    setTimeout(() => {
      this.positionFlag = 1;      
      domWord.innerText = '好闲啦';
      this.workFlag = 0;      
    }, 1000);
  } else {
    domWord.innerText = '好闲啦';
    this.workFlag = 0;    
  }
}
/**
 * 厨师
 */
function Cook (id, name, wages, picPath) {
  Staff.call(this, id, name, wages, picPath);
  // Cook.prototype = new Staff();
  // Cook.prototype.constructor = Cook;

  // this.id = id;
  // this.name = name;
  // this.wages = wages;
  // this.picPath = picPath;

  // 定义厨师的菜单
  // 厨师的工作状态 0：空闲， 1：正在工作
  this.workFlag = 0;
  // this.finishFoods = [];
}
/**
 * 厨师工作
 */
Cook.prototype.work = function () {
  // 通过厨师的id获取到厨师所在的dom
  let index = +this.id;
  var cookFood = cookDom.querySelectorAll('li')[index];
  var cookFoodState = cookFood.querySelector('.state');
  if (cookMenu.length > 0) {
    // 将厨师的烹饪菜单第一个减去
    var item = cookMenu.shift();
    // 将工作状态置为1
    this.workFlag = 1;      
    var num = +item.time / 1000;
    // 操作厨师的烹饪状态
    cookFoodState.innerHTML =  `正在做${item.name}，还差${num}秒钟做完`;
    let cookTimer = setInterval(() => {
      num--;
      cookFoodState.innerHTML =  `正在做${item.name}，还差${num}秒钟做完`;        
      if (num === 0) {
        clearInterval(cookTimer);
        // 添加到厨师的已完成列表
        cookFinishMenu.push(Object.assign(item));
        // 添加服务员的事件列表
        addEvent('cookInform');
        // 渲染已完成列表
        renderFinishCook();
        // 重新渲染厨师菜单
        renderFoodMenu();
        // 重新执行厨师工作
        this.work();
      }
    }, 1000)
    // if (+this.id == 0) {
    // } else if (+this.id == 1) {
    //   let cookTimer1 = setInterval(() => {
    //     num--;
    //     cookFoodState.innerHTML =  `正在做${item.name}，还差${num}秒钟做完`;        
    //     if (num === 0) {
    //       clearInterval(cookTimer1);
    //       // 添加到厨师的已完成列表
    //       cookFinishMenu.push(Object.assign(item));
    //       // 添加服务员的事件列表
    //       addEvent('cookInform');
    //       // 渲染已完成列表
    //       renderFinishCook();
    //       // 重新渲染厨师菜单
    //       renderFoodMenu();
    //       // 重新执行厨师工作
    //       this.work();
    //     }
    //   }, 1000)
    // } else {
    //   let cookTimer2 = setInterval(() => {
    //     num--;
    //     cookFoodState.innerHTML =  `正在做${item.name}，还差${num}秒钟做完`;        
    //     if (num === 0) {
    //       clearInterval(cookTimer2);
    //       // 添加到厨师的已完成列表
    //       cookFinishMenu.push(Object.assign(item));
    //       // 添加服务员的事件列表
    //       addEvent('cookInform');
    //       // 渲染已完成列表
    //       renderFinishCook();
    //       // 重新渲染厨师菜单
    //       renderFoodMenu();
    //       // 重新执行厨师工作
    //       this.work();
    //     }
    //   }, 1000)
    // }

  } else {
    cookFoodState.innerText =  '空闲中';
    this.workFlag = 0;
  }
}

/**
 * 厨师通知服务员端菜
 * @param {*} waiter 被通知的服务员
 */
// Cook.prototype.inform = function (waiter, ele) {
//   // this.finishFoods.push(Object.assign(ele));
//   cookFinishMenu.pusn(Object.assign(ele));
//   waiter.addEvent('cookInform', Object.assign(ele));
//   renderFinishCook();
// }

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
  if (this.completeFood.length > 0 && this.orderFoods.length > 0) {
    let food = Object.assign({}, this.completeFood[0]);
    let customTable = document.querySelectorAll('.table')[this.tableNum];
    let customFoodList = customTable.querySelectorAll('li');
    let curtomFoodState = null;
    let curtomFoodTime = null;

    customFoodList.forEach(ele => {
      if (ele.dataset.id == food.id) {
        curtomFoodState = ele.querySelector('.state');
        curtomFoodTime = ele.querySelector('time');
      }
    })
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
        this.completeFood.shift();

        // 此时说明已经吃完了
        if (this.orderFoods.length === 0) {
          // 通知服务员来收钱
          // this.informWaiterToPay(this.tableNum);
          addEvent('pay', this.tableNum);
          return;
        }
        // 吃完后再吃下一道菜
        this.eat();
      }
    }, 1000)
  } else {
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
        this.orderFoods = deepClone(arrTemp).slice(0, randomIndex);
        // 为菜品加上tableNum,送菜的时候才知道是哪桌点的菜
        this.orderFoods.forEach(ele => {
          ele.tableNum = this.tableNum + '';
          // 将所有菜品的价格之和放到顾客的price属性里面
          this.money += (+ele.price);
        })
        arrTemp.forEach(ele => {
          ele.tableNum = this.tableNum + '';
        })
        // 将菜单列表进行渲染
        renderCustomList(this.tableNum, deepClone(arrTemp).slice(0, randomIndex));
        resolve(deepClone(arrTemp).slice(0, randomIndex));
      }
    }, 1000);
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
  tableArr.forEach((ele) => {
    if (ele.num == this.tableNum) {
      ele.isFree = true;
    }
  })

  // 修改餐厅的金额
  restaurantCash.innerText = +restaurantCash.innerText + (+this.money);

  // 将顾客的菜单列表清空
  let customTable = document.querySelectorAll('.table')[+this.tableNum];
  let customFoodUl = customTable.querySelector('ul');

  customFoodUl.innerHTML = '';
  let index = customEffective.findIndex((value) => {
    return value.tableNum === this.tableNum;
  })
  customEffective.splice(index, 1);
  if (queues.length > 0) {
    // 让顾客列表的第一个进入餐厅
    var obj = queues.shift();
    // come里面已经包含了将其放入customEffective中
    obj.come();
    // **************************************************
    // 重新渲染排队列表
    renderCustom(queues, CastomDom);
  } else {
    // let customTable = document.querySelectorAll('.table')[+this.tableNum];
    // 将图片设置为无人
    var customPic = customTable.querySelector('img');
    var customName = customTable.querySelector('.name');
    var customOrderState = customTable.querySelector('.order-state');
    customPic.setAttribute('src', './images/noPerson.jpg');
    customName.innerText = '无人';
    customOrderState.innerText = '空闲中';
  }
}

/**
 * 
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

  // 替换对应的桌号上面的图片和名字
  let customTable = document.querySelectorAll('.table')[this.tableNum];
  let customImg = customTable.querySelector('img');
  let customName = customTable.querySelector('.name');
  let showCustom = customTable.querySelector('.showCustom');
  showCustom.innerText = '客人来了';
  setTimeout(() => {
    showCustom.innerText = '';
  }, 3000)

  customImg.setAttribute('src', this.picPath);
  customName.innerText = this.name;
  // 通过app直接点餐，点餐完毕后去重
  this.order(menuReally).then(res => {
    processingMenus(res);
  })
}
/**
 * 顾客接受食物
 */
Customer.prototype.reseiveFood = function (foodArr) {
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
 * 将arr循环产生dom放到排队列表里面，渲染排队列表
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

/**
 * 渲染厨师列表
 * @param {*} cooks
 * @param {*} dom
 * @param {*} classify 两种情况 'add'说明是增加； 'delete'说明是删除
 */
function renderCooks(cook, dom, classify) {
  var index = +cook.id;
  var cookItem = dom.querySelectorAll('li')[index];

  if (classify === 'add') {
    let cookHtml = '';
    cookHtml += `
        <img src="${cook.picPath}">
        <div class="cook-msg">
          <span class="id">No.${cook.id}</span>
          <span class="name">${cook.name}</span>
        </div>
        <div class="food">
          <h3>状态</h3>
          <div class="state">
          空闲中
          </div>
        </div>`
    cookItem.innerHTML = cookHtml;
  }
  else {
    cookItem.innerText = '';
  }
}
/**
 * 渲染服务员列表
 * @param {*} waiters
 * @param {*} dom
 */
function renderWaiters(waiter, dom, classify) {
  var index = +waiter.id;
  var cookItem = dom.querySelectorAll('li')[index];
  if (classify === 'add') {
    let waiterHtml = '';
      waiterHtml +=
      `<span class="word">空闲中</span>
        <img src="${waiter.picPath}">
        <div class="waiter-msg">
          <span class="id">No.${waiter.id}</span>
          <span class="name">${waiter.name}</span>
        </div>
        <div class="send-food">
        </div>`
    cookItem.innerHTML = waiterHtml;
  } else {
    cookItem.innerHTML = '';
  }
}
/**
 * 渲染已完成的菜品
 */
function renderFinishCook() {
  var finishHtml = '';
  cookFinishMenu.forEach(item => {
    finishHtml += `<li>${item.name}</li>`;
  })
  cookFinishCookDom.innerHTML = finishHtml;
}
/**
 * 渲染厨师的菜单
 */
function renderFoodMenu() {
  // cookFoodUl
  let listHtml = '';
  cookMenu.forEach(ele => {
    listHtml += `<li>${ele.name}</li>`
  })
  cookFoodUl.innerHTML = listHtml;
}

/**
 * 对厨师的菜单进行去重处理
 * @param {*} menu
 */
function processingMenus (menu) {
  let mark = true;
  for (let i = 0, len = menu.length; i < len; i++) {
    mark = true;
    for (let j = 0, len1 = cookMenu.length; j < len1; j++) {
      if (cookMenu[j].id == menu[i].id) {
        cookMenu[j].tableNum = (cookMenu[j].tableNum + '&' + menu[i].tableNum);
        mark = false;
        break;
      }
    }
    if (mark) {
      cookMenu.push(Object.assign({}, menu[i]));
    }
  }
  renderFoodMenu();
  // 由于此刻厨师可能都已经处于空闲状态，所以让空闲的厨师开始工作
  setTimeout(() => {
    cookWork();
  }, 20)    
  // 对菜单进行渲染
}

/**
 * 删除已完成菜单中被端走的菜
 * @param {*} arr
 */
function decreaseFinishFood (arr) {
  for (var i = 0; i < cookFinishMenu.length; i++) {
    for(var j = 0; j < arr.length; j++) {
      if (cookFinishMenu[i].id === arr[j].id) {
        cookFinishMenu.splice(i, 1);
        i--;
        break;
      }
    }
  }
  renderFinishCook();
}

/**
 * 将厨师的工作模式单独抽取一个函数（让空闲的厨师工作）
 */
function cookWork() {
  if (cookMenu.length > 0) {
    cookWorkers.every((ele, index) => {
      if (cookMenu.length === 0) {
        return false;
      }
      if (ele.workFlag === 0) {
        ele.work();
      }
      return true;
    })
    // cookWork();
  }
}

/**
 * 添加服务员的工作事件
 * @param {*} eventName 事件名
 * @param {*} item 事件参数
 */
function addEvent(eventName, item) {
  // 如果新加入的事件是cookInform，并且事件的最后一个也是cookInform，那么就将这两个之间合并;
  if (eventName === 'cookInform') {
    let length = eventArr.length;
    if (length > 0 && eventArr[length - 1].name === 'cookInform') {
      return;
    }
  }
  if (typeof item === 'object') {
    var item = Object.assign({}, item);
  }
  let obj = {
    name: eventName,
    item: item
  }
  eventArr.push(obj);
  // 如果只有事件产生，并且有服务员是空闲的，就让这个空闲的服务员工作
  if (eventArr.length > 0) {
    waiterWorkers.forEach(ele => {
      if (ele.workFlag == 0 && eventArr.length > 0) {
        ele.work(eventArr.shift());
      }
    })
  }
}

// 餐厅的现金
var restaurantCash = document.querySelector('.restaurant-cash span');
// 获取所有的餐桌
var tableList = document.querySelectorAll('.custom-wrapper .table');
// 排队顾客标签
var CastomDom = document.querySelector('.custom-list ul');
// 厨师的烹饪状态cook
var cookFoodState = document.querySelector('.cook .food .state');
// 厨师的菜单列表
var cookFoodUl = document.querySelector('.food-lists ul');
// 服务员
var waiterDom = document.querySelector('.waiter-wrapper');
// 厨师
var cookDom = document.querySelector('.cook-wrapper');
// 服务员说的话
// var waiterWord = document.querySelector('.waiter-wrapper .word');
// 提示牌右边的所有部分
var box = document.querySelector('.box');
// 厨师已经完成的菜品
var cookFinishCookDom = document.querySelector('.finish-foods ul');
// 所有的按钮
var btns = document.querySelector('.btns');


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

// 定义一个全局的厨师烹饪菜单
var cookMenu = [];
// 定义一个全局的已完成的厨师烹饪菜单
var cookFinishMenu = [];

// 放顾客模板的数组
var customers = [];
// 放厨师模板的数组
var cooks = [];
// 放服务员的数组
var waiters = [];
// 放服务员事件的数组
var eventArr = [];

// 生成顾客模板、厨师模板、服务员模板的数组
function workers () {
  var cusArr = [
    { name: '张三', picPath: './images/custom.jpg' },
    { name: '李四', picPath: './images/custom1.jpg' }, 
    { name: '王二', picPath: './images/custom2.jpg' }, 
    { name: '麻子', picPath: './images/custom3.jpg' }, 
    { name: '周助', picPath: './images/custom5.jpg' }
  ]
  var cookArr = [['000', '李大厨', '10000', './images/cook.jpg'], ['001', '张大厨', '10000', './images/cook2.jpg'], ['002', '黄大厨', '10000', './images/cook3.jpg']];
  var waiterArr = [['000', '张女士', '4000', './images/waiter.jpg'], ['001', '黄女士', '5000', './images/waiter2.jpg'], ['002', '李女士', '6000', './images/waiter3.jpg']];

  // 实现一个顾客队列
  for (let i = 0, len = cusArr.length; i < len; i++) {
    customers.push(new Customer(cusArr[i]));
  }
  for (let j = 0, len = cookArr.length; j < len; j++) {
    cooks.push(new Cook(...cookArr[j]));
  }
  for (let k = 0, len = waiterArr.length; k < len; k++) {
    waiters.push(new Waiter(...waiterArr[k]));
  }
}
workers();

// 定义一个顾客排队的列表
var queues = [];
// 定义一个正在工作的厨师工作组
var cookWorkers = deepClone(cooks).slice(0, 1);
// 定义一个正在工作的服务员组
var waiterWorkers = deepClone(waiters).slice(0, 1);

// 这儿是第一次渲染的顾客
var firstArr = deepClone(customers).slice(0, 3);

// 每5秒随机产生3个顾客，然后进行渲染
produceCustomersRamdom(5, 3, customers, queues);

// 渲染第一个工作的厨师
renderCooks(cookWorkers[0], cookDom, 'add');
// 渲染第一个服务员
renderWaiters(waiterWorkers[0], waiterDom, 'add');

setTimeout(() => {
  firstArr.forEach(ele => {
    ele.come();
  })
}, 20)

window.onresize = function () {
  var box = document.querySelector('.box');
  waiterWorkers.forEach((ele, index) => {
    if (ele.positionFlag == 1) {
      var x = box.offsetWidth - 820 + 'px';
      let dom = waiterDom.querySelectorAll('.waiter')[index];
      dom.style.webkitTransform = `translateX(${x})`;
    }
  })
}

btns.onclick = function (event) {
  event = event || window.event;
  switch(event.target.className){
    case 'add-cook':
      if (cookWorkers.length < 3) {
        let length = cookWorkers.length;
        cookWorkers.push(deepClone(cooks)[length])
        renderCooks(deepClone(cooks)[length], cookDom, 'add');
      }
      break;
    case 'dec-cook':
      if (cookWorkers.length > 1) {   
        let length = cookWorkers.length;
        var decCook = cookWorkers.pop();
        renderCooks(decCook, cookDom, 'delete');
      }
      break;
    case 'add-waiter':
      if (waiterWorkers.length < 3) {
        let length = waiterWorkers.length;
        waiterWorkers.push(deepClone(waiters)[length]);
        renderWaiters(deepClone(waiters)[length], waiterDom, 'add');        
        // 如果还有事件没有执行,那么就让新加入的服务员执行
        // let index = eventArr.findIndex(value => {
        //   return !value.mark;
        // })
        // if (index) {
          
        //   waiterWorkers[waiterWorkers.length - 1].work(eventArr[index]);
        // }
        if (eventArr.length > 0) {
          waiterWorkers[waiterWorkers.length - 1].work(eventArr.shift());
        } else {
          waiterWorkers[waiterWorkers.length - 1].rest();
        }
        // waiterWorkers = waiters.slice(0, length + 1);
      }
      break;
    case 'dec-waiter':
      if (waiterWorkers.length > 1) {
        let length = waiterWorkers.length;
        let decWaiter = waiterWorkers.pop();
        renderWaiters(decWaiter, waiterDom, 'delete');
      }
      break; 
    default:
      break;
  }
}