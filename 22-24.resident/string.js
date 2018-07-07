  // 去掉字符串中的半角和全角空格
  function diyTrim(str) {
    var result = "";
    // do something
    result = str.trim();
    return result
  }
  console.log(diyTrim(' a f b    ')); // ->a f b
  console.log(diyTrim('    ffdaf    ')); // ->ffdaf
  console.log(diyTrim('1    ')); // ->1
  console.log(diyTrim('　　f')); // ->f
  console.log(diyTrim('  　  a f b 　　 ')); // ->a f b
  console.log(diyTrim(' ')); // ->
  console.log(diyTrim('　')); // ->
  console.log(diyTrim('')); // ->

  /*
  去掉字符串str中，连续重复的地方
  */
  function removeRepetition(str) {
      var result = "";
      var arr = str.split('');
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === arr[i + 1]) {
          arr.splice(i+1, 1);
          i--;
        }
      }
      result = arr.join('');
      return result;
  }
  console.log(removeRepetition("aaa")); // ->a
  console.log(removeRepetition("abbba")); // ->aba
  console.log(removeRepetition("aabbaabb")); // ->abab
  console.log(removeRepetition("")); // ->
  console.log(removeRepetition("abc")); // ->abc

  function removeRepetition1(str) {
      var result = "";
      // do something
      var strTemp = '';
      for (var i = 0; i < str.length; i++) {
        if (i === 0) {
          strTemp = str[i];
        }
        if ((str[i] !== str[i+1]) && str[i+1] && str[i]) {
          strTemp += str[i+1];
        }
      }
      result = strTemp;
      return result;
  }
  console.log(removeRepetition1("aaa")); // ->a
  console.log(removeRepetition1("abbba")); // ->aba
  console.log(removeRepetition1("aabbaabb")); // ->abab
  console.log(removeRepetition1("")); // ->
  console.log(removeRepetition1("abc")); // ->abc
  