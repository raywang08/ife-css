// 使用ES6的实现类的定义

/**
 * 餐厅类
 */
class Restaurant {
  constructor (obj) {
    this.money = obj.money;
    this.seats = obj.seats;
    this.staff = obj.staff;
  }
  hire (worker) {
    this.staff.push(worker);
  }
  fire (worker) {
    var index = this.staff.findIndex((val) => {
      val === worker;
    })
    this.staff.splice(index, 1);
  }
}

/**
 * 职员类
 * @param {*} id
 * @param {*} name
 * @param {*} wages
 */

class Staff {
  constructor (id, name, wages) {
    this.id = id;
    this.name = name;
    this.wages = wages;
  }
  work () {

  }
}

/**
 * 服务员类
 * @param {*} id
 * @param {*} name
 * @param {*} wages
 */
class Waiter extends Staff {
  constructor(id, name, wages) {
    super(id, name. wages);
    this.order = []
  }
  work () {
    var arr = Array.from(arguments);
    // 如果参数是数组
    if (Array.isArray(arr[0])) {
      arr[0].forEach(ele => {
        this.order.push(ele);
      });
    } else {
      if (arr.length > 0) {
        arr.forEach ((ele, index) => {
          // 如果ele在order里面，那么就将这个菜从点的菜单中剔除
          if (ele.indexOf(this.order) > -1) {
            this.order.splice(index, 1);
          }
        })
      }
    }
  }
}

/**
 * 厨师类
 * @param {*} id
 * @param {*} name
 * @param {*} wages
 */
class Cook extends Staff {
  constructor (id, name, wages) {
    super(id, name, wages);
  }
  work () {

  }
}

/**
 *顾客类
 */
class Customer {
  order () {

  }
  eat () {

  }
}

/**
 * 菜品类
 * @param {*} name
 * @param {*} cost
 * @param {*} price
 */
class Goods {
  constructor (name, cost, price) {
    this.name = name;
    this.cost = cost;
    this.price = price;
  }
}


var ifeRestaurant = new Restaurant({
  cash: 1000000,
  seats: 20,
  staff: []
});

var newCook = new Cook("Tony", 10000);
ifeRestaurant.hire(newCook);
console.log(ifeRestaurant.staff);

ifeRestaurant.fire(newCook);
console.log(ifeRestaurant.staff);