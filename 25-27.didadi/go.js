function Go() {
  console.log("Go");
}

function GoSteps(n) {
  // 判断输入的值是否为空，为空便是默认为1
  if (arguments.length === 0 || n === true) {
    Go();
    return;
  }
  // 判断是否为假，为NaN，小于0，都输出为0次
  else if (!n || isNaN(n) || n < 0) {
    return;
  }
  else {
    var num = Math.floor(n);
    while(num > 0) {
      Go();
      num--;
    }
  }
}

GoSteps(10); // Go 10次
GoSteps(1); // Go 1次
GoSteps(); // Go 1次，认为缺少参数时，默认参数为1
GoSteps(0);  // 0次
GoSteps(-1);  // 0次
GoSteps(1.4);  // Go 1次
GoSteps(1.6);  // Go 1次
GoSteps(-1);  // 0次
GoSteps(true);  // Go 1次
GoSteps(false);  // 0次
GoSteps("Test");  // 0次
GoSteps(NaN);  // 0次
GoSteps(null);  // 0次