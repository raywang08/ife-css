var tree = {
  "id": 0,
  "name": "root",
  "left": {
      "id": 1,
      "name": "Simon",
      "left": {
          "id": 3,
          "name": "Carl",
          "left": {
              "id": 7,
              "name": "Lee",
              "left": {
                  "id": 11,
                  "name": "Fate"
              }
          },
          "right": {
              "id": 8,
              "name": "Annie",
              "left": {
                  "id": 12,
                  "name": "Saber"
              }
          }
      },
      "right": {
          "id": 4,
          "name": "Tony",
          "left": {
              "id": 9,
              "name": "Candy"
          }
      }
  },
  "right": {
      "id": 2,
      "name": "right",
      "left": {
          "id": 5,
          "name": "Carl",
      },
      "right": {
          "id": 6,
          "name": "Carl",
          "right": {
              "id": 10,
              "name": "Kai"
          }        
      }
  }
}

// 假设id和name均不会重复，根据输入name找到对应的id
function findIdByName (name) {
  inOrderId(tree, name);
}
var idValue = '';
function inOrderId (order, name) {
  if (order.name == name) {
    idValue = order.id;
    return;
  }
  if (order.left) {
    inOrderId(order.left, name);
  }
  if (order.right) {
    inOrderId(order.right, name);
  }
}
findIdByName('Kai'); // 验证
console.log(idValue);

// 假设id和name均不会重复，根据输入id找到对应的name
function findNameById(id) {
  inOrderName(tree, id);
}
var nameValue = '';
function inOrderName (order, id) {
  if (order.id == id) {
    nameValue = order.name;
    return;
  }
  if (order.left) {
    inOrderName(order.left, id);
  }
  if (order.right) {
    inOrderName(order.right, id);
  }
}
findNameById(5); // 验证
console.log(nameValue);

// 把这个对象中所有的名字以“前序遍历”的方式全部输出到console中
function getListWithDLR() {
  DLRArr.length = 0;
  DLR(tree)
}
var DLRArr = [];
function DLR(obj) {
  if (obj.name) {
    DLRArr.push(obj.name);
  }
  if (obj.left) {
    DLR(obj.left);
  }
  if (obj.right) {
    DLR(obj.right);
  }
}
getListWithDLR();
console.log(DLRArr); // 打印

// 把这个对象中所有的名字以“中序遍历”的方式全部输出到console中
function getListWithLDR() {
  LDRArr.length = 0;
  LDR(tree);
}
var LDRArr = [];
function LDR(obj) {
  if (obj.left) {
    LDR(obj.left);
  }
  if (obj.name) {
    LDRArr.push(obj.name);
  }
  if (obj.right) {
    LDR(obj.right);
  }
}

getListWithLDR();
console.log(LDRArr); // 打印
// 把这个对象中所有的名字以“后序遍历”的方式全部输出到console中
function getListWithLRD() {
  LRDArr.length = 0;
  LRD(tree);
}
var LRDArr = [];
function LRD(obj) {
  if (obj.left) {
    LRD(obj.left);
  }
  if (obj.right) {
    LRD(obj.right);
  }
  if (obj.name) {
    LRDArr.push(obj.name);
  }
}
getListWithLRD();
console.log(LRDArr);