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
    this.order = [];
    Waiter.prototype = new Staff();
    Waiter.prototype.constructor = Waiter;
  }
  Waiter.prototype.work = function () {
    var arr = Array.from(arguments);
    // 如果参数是数组,则记录客人点菜
    if (Array.isArray(arr[0])) {
      console.log('服务员记录菜单');
      arr[0].forEach(ele => {
        this.order.push(ele);
      });
    } else {
      console.log('服务员送菜');
      // 这是服务员送的菜品
      var deliverFoods = arr.slice();
      // 将菜单上面的内容去掉
      if (arr.length > 0) {
        arr.forEach ((ele, index) => {
          // 如果ele在order里面，那么就将这个菜从点的菜单中剔除
          if (ele.indexOf(this.order) > -1) {
            this.order.splice(index, 1);
          }
        })
      }
      return deliverFoods;
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
  Cook.prototype.work = function (cooks) {
    console.log('厨师=烹饪食物');
    var arr = [];
    Array.prototype.push.apply(arr, cooks);
    return arr;
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
function Customer () {
  this.orderFoods = []
}
Customer.prototype.order = function (...foods) {
  console.log('点的菜是' + foods);
  this.orderFoods.push(...foods);
}
Customer.prototype.eat = function (...foods) {
  console.log('顾客品尝食物')
  for (var i = 0; i < foods.length; i++) {
    foods.splice(i, 1);
    i--;
  }
  return foods;
}

// 一个服务员
var waiterA = getWaiter.getInstance('12345', 'tony', '2000');
// 一个顾客
var customerA = new Customer();
// 一个厨师
var cookA = getCook.getInstance('11111', 'tom', '5000');

// 顾客点菜
customerA.order('rice', 'apple', 'banana');

// 服务员记录客人菜品
waiterA.work(customerA.orderFoods);
// 厨师开始烹饪
var finishCooks = cookA.work(waiterA.order)
// 服务员上菜
var deliverCooks = waiterA.work.apply(null, finishCooks);
// 顾客吃菜
if (customerA.eat(deliverCooks)) {
  console.log('顾客饭吃完了');
}

var customers = [];
// 实现一个顾客队列
for (var i = 0; i < 10; i++) {
  customers.push(new Customer());
}

// 实现一个菜单
function Menu() {
  this.firstFood = {
    name: 'rice',
    price: '1'
  },
  this.secondFood = {
    name: 'apple',
    price: '20'
  }
}

// 在菜单上面点菜
Menu.prototype.order = function (customer, name) {
  customer.orderFoods.push(this[name]);
}