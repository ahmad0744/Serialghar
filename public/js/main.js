var triggerser = true;
function searchcontrol() {
  if (triggerser) {
    document.querySelector('.mainheader').style.height = '100px';
    document.getElementById('ser2').style.width = '100%';
    triggerser = false;
    document.getElementById('mainheader').classList.remove("overflowda");
    document.getElementById('ser2').classList.remove("overflowda");
  } else {
    document.querySelector('.mainheader').style.height = '56px';
    document.getElementById('ser2').style.width = '0%';
    triggerser = true;
    document.getElementById('mainheader').classList.add("overflowda");
    document.getElementById('ser2').classList.add("overflowda");
  }
}


function toggleBtnClickm(clickedm) {
  var msidebar = document.querySelector(".mobile_sidebar");
  if (clickedm) {
    msidebar.classList.remove("mvSideBar");
  } else {
    msidebar.classList.add("mvSideBar");
  }
}
function getVisible() {
  var width = window.innerWidth;
  if (width >= 590) {
    document.querySelector('.mainheader').style.height = '56px';
    document.getElementById('ser2').style.width = '0%';
    document.getElementById('mainheader').classList.add("overflowda");
    document.getElementById('ser2').classList.add("overflowda");
    document.getElementById('myInput1').value = '';
    document.getElementById('myInput2').value = '';
    triggerser = true;
  }
}
window.addEventListener('resize', getVisible);


window.addEventListener('scroll', function () {
  var scrollingDiv = document.getElementById('scrollingdiv');
  var fixedside = document.getElementById('fixedside');
  var scdivbottom = document.getElementById('scdivbottom');

  var scrollingDivBottom = scrollingDiv.getBoundingClientRect().bottom;

  if (scrollingDivBottom <= 0) {
    fixedside.classList.add('fixed');
    scdivbottom.style.marginTop = '300px';
  } else {
    fixedside.classList.remove('fixed');
    scdivbottom.style.marginTop = '10px';
  }
});

document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    // Hide the progress bar when the page is fully loaded
    document.getElementById("progress-bar").style.display = "none";
  }
};
(function () {
  function updateProgressBar(progress) {
    document.getElementById("progress-bar-fill").style.width = progress + "%";
  }
  var httpRequest = new XMLHttpRequest();
  httpRequest.open("GET", window.location.href, true);
  // Progress event listener
  httpRequest.addEventListener("progress", function (event) {
    if (event.lengthComputable) {
      var progress = (event.loaded / event.total) * 100;
      updateProgressBar(progress);
    }
  });
  // Load event listener
  httpRequest.addEventListener("load", function () {
    updateProgressBar(100);
  });

  httpRequest.send();
})();