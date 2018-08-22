let arr = [{
  name: 'tf',
  age: '18'
}, {
  name: 'hm',
  age: '19'
}, {
  name: 'zw',
  age: '20'
}, {
  name: 'hl',
  age: '21'
}]

let obj = {
  name: 'hl',
  age: '21'
}
var index = arr.findIndex(value => {
  return value.age === obj.age;
})
console.log(index);