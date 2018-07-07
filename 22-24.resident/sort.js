var arr = [43, 54, 4, -4, 84, 100, 58, 27, 140];

// 从小到大
arr.sort(function(a, b) {
  return a > b
})
console.log(arr);

// 从大到小
arr.sort(function(a, b) {
  return a < b
})
console.log(arr);

// 从a到z
var arr1 = ['apple', 'dog', 'cat', 'car', 'zoo', 'orange', 'airplane'];
arr1.sort(function(a, b) {
  return a > b;
})
console.log(arr1);

// 按照第二个元素从大到小
var arr2 = [[10, 14], [16, 60], [7, 44], [26, 35], [22, 63]];
arr2.sort(function(a, b) {
  return a[1] < b[1];
})
console.log(arr2);

// 按元素的value值从小到大进行排序
var arr3 = [
  {
      id: 1,
      name: 'candy',
      value: 40
  }, {
      id: 2,
      name: 'Simon',
      value: 50
  }, {
      id: 3,
      name: 'Tony',
      value: 45
  }, {
      id: 4,
      name: 'Annie',
      value: 60
  }
];
arr3.sort (function (a, b) {
  return a.value > b.value;
})
console.log(arr3);