var count = 0;
setInterval(function () {
  if (count < 5) {
    count++;
     document.querySelector("#img1").style.opacity = 1;
     document.querySelector("#img2").style.opacity = 0;
  } else {
      count = 1;
      document.querySelector("#img1").style.opacity = 0;
      document.querySelector("#img2").style.opacity = 1;
    }
}, 1000);
