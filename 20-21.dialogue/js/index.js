
/* 当点击按钮 submit-btn 时，在console中输出 name 中的内容
在输入过程中，如果按回车键，则同样执行上一条的需求
在输入过程中，如果按 ESC 键，则把输入框中的内容清空 */
var submitBtn = document.querySelector('#submit-btn');
var input = document.querySelector('#name');
submitBtn.onclick = function () {
  console.log(input.value);
}
document.onkeyup = function (e) {
  if (e.keyCode == 13) {
    console.log(input.value);
  }
  if (e.keyCode == 27) {
    input.value = '';
  }
}

/* 点击不同的radio出现不同的下拉框 */
var school = document.querySelector('#school');
var company = document.querySelector('#company');
var schoolSelect = document.querySelector('#school-select');
var companySelect = document.querySelector('#company-select');

school.onclick = function () {
  schoolSelect.style.display = "block";
  companySelect.style.display = "none";
}
company.onclick = function () {
  schoolSelect.style.display = "none";
  companySelect.style.display = "block";
}

/* 点击不同的色块，将色块的颜色显示出来，并且文字的颜色与色块的颜色相同 */
var palette = document.querySelector('.palette');
var colorPicker = document.querySelector('.color-picker');
palette.onclick = function (e) {
  colorPicker.innerText = e.target.style.backgroundColor;
  colorPicker.style.color = e.target.style.backgroundColor;
}

/* 通过按钮实现淡入淡出 */
var fadeObj = document.querySelector('#fade-obj');
var fadeBtn = document.querySelector('#fade-btn');
var flag = 1;
var fadeTimer = null;

fadeBtn.onclick = function () {
  if (flag === 1) {
    fadeBtn.disabled = true;
    var num = 10;
    fadeTimer = setInterval(function () {
      fadeObj.style.opacity = 0.1 * num;
      num--;
      if (num < 0) {
        flag = 0;
        fadeBtn.disabled = false;
        clearInterval(fadeTimer);
        return;          
      }
    }, 100);
  } else {
    fadeBtn.disabled = true;
    var num = 0;
    fadeTimer = setInterval(function () {
      fadeObj.style.opacity = 0.1 * num;
      num++;
      if (num > 10) {
        flag = 1;
        fadeBtn.disabled = false;
        clearInterval(fadeTimer);
        return;    
      }
    }, 100);
  }
}

/* 人头动画 */
var photo = document.querySelector('.photo');
var photoNum = 0;
var photoFlag = 0;
photo.style.background = "url(./image/boy.jpg)";

var photoTimer = setInterval(function() {
  if (photoFlag === 0) {
    photo.style.background = "url('./image/boy.jpg') no-repeat 0 " + "-" + photoNum * 480 + 'px';
    photoNum++;
    if (photoNum === 16) {
      photoFlag = 1;
    }
  } else  {
    photo.style.background = "url(./image/boy.jpg) no-repeat 0 " + "-" +photoNum * 480 + 'px';
    photoNum--;
    if (photoNum === 0) {
      photoFlag = 0;
    }
  }
}, 100)