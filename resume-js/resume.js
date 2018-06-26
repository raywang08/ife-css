window.onload = function() {
  let wordBtn = document.getElementById("word");
  let hobbitBtn = document.getElementById("hobbit");
  let hide = document.getElementById("hide");
  let wrodContent = document.getElementsByClassName("wrod-content")[0];
  let hobbitContent = document.getElementsByClassName("hobbit-content")[0];

  console.log(wordBtn)
  console.log(hobbitBtn)
  console.log(wrodContent)
  console.log(hobbitContent)
  hide.onclick = function () {
    console.log('被点击了')
    wrodContent.style.transform = "translate3d(200px, 0, 0)";
    wrodContent.style.opacity = 0;
    hobbitContent.style.transform = "translate3d(200px, 0, 0)";
    hobbitContent.style.opacity = 0;
  }
  wordBtn.onclick = function() {
    console.log('被点击了')
    wrodContent.style.transform = "translate3d(0, 0, 0)";
    wrodContent.style.opacity = 1;
    hobbitContent.style.transform = "translate3d(200px, 0, 0)";
    hobbitContent.style.opacity = 0;
  };
  hobbitBtn.onclick = function() {
    console.log('被点击了')
    wrodContent.style.transform = "translate3d(200px, 0, 0)";
    wrodContent.style.opacity = 0;
    hobbitContent.style.transform = "translate3d(0, 0, 0)";
    hobbitContent.style.opacity = 1;
  };
};
