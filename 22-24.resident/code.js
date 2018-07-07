// 对象转换为数组
var scoreObject = {
  "Tony": {
      "Math": 95,
      "English": 79,
      "Music": 68
  }, 
  "Simon": {
      "Math": 100,
      "English": 95,
      "Music": 98
  }, 
  "Annie": {
      "Math": 54,
      "English": 65,
      "Music": 88
  }
}

function objToArr (obj) {
  var arr = [];
  var i = 0;
  for (var key in obj) {
    var arrTemp = [];
    arrTemp.push(key);
    for (var key1 in obj[key]) {
      arrTemp.push(obj[key][key1]);
    }
    arr.push(arrTemp);
  }
  return arr;
}

var scoreArray = objToArr(scoreObject);
console.log(scoreArray);

// 数组转换为对象
var menuArr = [
  [1, "Area1", -1],
  [2, "Area2", -1],
  [3, "Area1-1", 1],
  [4, "Area1-2", 1],
  [5, "Area2-1", 2],
  [6, "Area2-2", 2],
  [7, "Area1-2-3", 4],
  [8, "Area2-2-1", 6],
];

function arrToObj(arr) {
  // 首先遍历将第一级的内容放进去
  var obj = {}
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][2] === -1) {
      var obj1 = {
        name: arr[i][1],
      }
      var attr = arr[i][0];
      obj[attr] = obj1;
      arr.splice(i, 1);
      i--;
    } else {
      break;
    }
  }
  function tree (obj) {
    if (arr.length > 0) {
      for (var key in obj) {
        console.log('这儿是key: ' + key);
        for (var j = 0; j < arr.length; j ++) {
          console.log('这儿是遍历的数组')
          console.log(arr[j]);
          if (arr[j][2] == key) {
            console.log('这儿是相等了');
            console.log(arr[j]);
            // 如果找到子集
            if (!obj[key].subMenu) {
              // 如果没有subMenu属性，就设置这个属性为{}
              obj[key].subMenu = {};
            }
            var attr1 = arr[j][0];
            var obj2 = {
              name: arr[j][1]
            }
            obj[key].subMenu[attr1] = obj2;
            arr.splice(j, 1);
            j--;
          }
        }
        tree(obj[key].subMenu);        
      }
    }
  }
  tree(obj)
  return obj;
}

var objTemp = arrToObj(menuArr);
console.log(objTemp);