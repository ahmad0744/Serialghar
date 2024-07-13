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

/* main page */
var bodycontainer = document.getElementById('bodycontainer');
bodycontainer.innerHTML = '';
var onlyname = data.title.split('Full')[0].trim();
var h1data = document.createElement('h1');
h1data.innerText = data.title;

var small = document.createElement('div');
small.className = 'small';
var spanadmin = document.createElement('span');
spanadmin.innerText = '👤 admin';

var spantag = document.createElement('span');
var atagcat = document.createElement('a');
atagcat.innerText = data.tag;
atagcat.href = `/tag/${data.tag.toLowerCase().replace(/\s/g, "-")}`;
spantag.appendChild(atagcat);

var spanview = document.createElement('span');
spanview.innerText = `👁 ${Number(data.views).toLocaleString('en-IN')} Views`;
small.appendChild(spanadmin);
small.appendChild(spantag);
small.appendChild(spanview);

var hrElement = document.createElement("hr");
var titleh2 = document.createElement("h2");
titleh2.innerText = onlyname;

var pred = document.createElement("p");
pred.className = 'red';
pred.innerText = '[720p HIGH-DEFINITION (HD) VIDEOS]';

var divlinklist = document.createElement("div");
for (let index = 0; index < data.downlink.length; index++) {
  const element = data.downlink[index];
  var pplayername1 = document.createElement('p');
  pplayername1.className = 'playername'
  if (element[0] == 'vkspeed') {
    pplayername1.innerText = 'Vkspeed Player Link';
  } else if (element[0] == 'okru') {
    pplayername1.innerText = 'Okru Player Link';
  } else if (element[0] == 'vkprime') {
    pplayername1.innerText = 'Vkprime Player Link';
  } else if (element[0] == 'multiupdownload') {
    pplayername1.innerText = 'Multiup Download Link';
  } else {
    pplayername1.innerText = `${element[0]} Player Link`;
  }
  divlinklist.appendChild(pplayername1);

  var directarray = ['https://descendentwringthou.com/dpyenfbcfy?key=34d817730d826dc4b2b226ab1253bf80',
    'https://chalaips.com/4/6448298',
    'https://descendentwringthou.com/dpyenfbcfy?key=34d817730d826dc4b2b226ab1253bf80',
    'https://doruffleton.com/4/6532807', 'https://potsaglu.net/4/6533596',
    'https://descendentwringthou.com/dpyenfbcfy?key=34d817730d826dc4b2b226ab1253bf80',
    'https://chalaips.com/4/6448298',
    'https://descendentwringthou.com/dpyenfbcfy?key=34d817730d826dc4b2b226ab1253bf80',
    'https://doruffleton.com/4/6532807', 'https://potsaglu.net/4/6533596',
    'https://descendentwringthou.com/dpyenfbcfy?key=34d817730d826dc4b2b226ab1253bf80',
    'https://chalaips.com/4/6448298',
    'https://descendentwringthou.com/dpyenfbcfy?key=34d817730d826dc4b2b226ab1253bf80',
    'https://doruffleton.com/4/6532807', 'https://potsaglu.net/4/6533596'];
  for (let j = 0; j < element[1].length; j++) {
    const elementlink = element[1][j];
    if (element[1].length > 1) {
      var h3link1 = document.createElement('h3');
      var alink1 = document.createElement('a');
      alink1.className = 'playerlink';
      alink1.innerHTML = `${data.title} Part ${j + 1}`;
      alink1.target = '_blank';
      alink1.setAttribute('onclick', `openplayer(this, '${element[0]}','${elementlink}')`)
      alink1.href = directarray[j];
      h3link1.appendChild(alink1);
      divlinklist.appendChild(h3link1);
    } else {
      var h3link1 = document.createElement('h3');
      var alink1 = document.createElement('a');
      alink1.className = 'playerlink';
      alink1.innerHTML = `${data.title} Full Episode`;
      alink1.target = '_blank';
      alink1.setAttribute('onclick', `openplayer(this, '${element[0]}','${elementlink}')`)
      alink1.href = directarray[index];
      h3link1.appendChild(alink1);
      divlinklist.appendChild(h3link1);
    }
  }
}
let isFirstClick = true;
var longurl = '#',mainurlezoic = '';
function openplayer(event, playername, linkcode) {
  if (isFirstClick) {
    isFirstClick = false;
  } else {
    if (playername == 'vkspeed') {
      mainurlezoic=longurl[0].replace('NEHALCHANGE',`%2F%23STARdownNUSAhttps://vkspeed.com/embed-${linkcode}.htmlSEC${longurl[1]}`);
      event.href = mainurlezoic;
    } else if (playername == 'okru') {
      mainurlezoic=longurl[0].replace('NEHALCHANGE',`%2F%23STARsplayNUSAhttps://ok.ru/videoembed/${linkcode}`);
      event.href = mainurlezoic;
    } else if (playername == 'vkprime') {
      mainurlezoic=longurl[0].replace('NEHALCHANGE',`%2F%23STARsplayNUSAhttps://vkprime.com/embed-${linkcode}.html`);
      event.href = mainurlezoic;
    } else if (playername == 'multiupdownload') {
      mainurlezoic=longurl[0].replace('NEHALCHANGE',`%2F%23STARdownNUSAhttps://multiup.org/${linkcode}SEC${longurl[1]}`);
      event.href = mainurlezoic;
    }
    isFirstClick = true;
  }
}

var pdesc = document.createElement("p");
pdesc.className = 'desc';
pdesc.innerHTML = `Watch ${onlyname} Video Full Episode fun Serialghar,
<strong>${data.cat}</strong> Drama ${onlyname.split(' ').slice(0, -3).join(' ')} Today Episode On Youtube,
Desi Tv Serial <strong>${onlyname.split(' ').slice(0, -3).join(' ')}</strong> Episode – ${onlyname.split(' ').slice(-3).join(' ')} Download in HD.Watch
${onlyname.split(' ').slice(0, -3).join(' ')} Online.`;

var powner = document.createElement("p");
powner.className = 'owner';
powner.innerHTML = `<strong>Telecast Date:</strong> ${onlyname.split(' ').slice(-3).join(' ')}<br>
<strong>Owner</strong>: ${data.cat}<br>
<strong>Video Sourc</strong>e: Vk Speed/ Dailymotion`;

bodycontainer.appendChild(h1data);
bodycontainer.appendChild(small);
bodycontainer.appendChild(hrElement);
bodycontainer.appendChild(titleh2);
bodycontainer.appendChild(pred);
bodycontainer.appendChild(divlinklist);
bodycontainer.appendChild(pdesc);
bodycontainer.appendChild(powner);

document.title = data.title;
var metaTag = document.querySelector('meta[name="description"]');
metaTag.setAttribute('content', `Watch ${onlyname} Video Full Episode fun Serialghar,
${data.cat} Drama ${onlyname.split(' ').slice(0, -3).join(' ')} Today Episode On Youtube,
Desi Tv Serial ${onlyname.split(' ').slice(0, -3).join(' ')} Episode – ${onlyname.split(' ').slice(-3).join(' ')} Download in HD.Watch
${onlyname.split(' ').slice(0, -3).join(' ')} Online.`);

var metakeyword = document.querySelector('meta[name="keywords"]');
metakeyword.setAttribute('content', data.title);
var metaogtitle = document.querySelector('meta[property="og:title"]');
metaogtitle.setAttribute('content', data.title);

var metaogdesc = document.querySelector('meta[property="og:description"]');
metaogdesc.setAttribute('content', `Watch ${onlyname} Video Full Episode fun Serialghar,
${data.cat} Drama ${onlyname.split(' ').slice(0, -3).join(' ')} Today Episode On Youtube,
Desi Tv Serial ${onlyname.split(' ').slice(0, -3).join(' ')} Episode – ${onlyname.split(' ').slice(-3).join(' ')} Download in HD.Watch
${onlyname.split(' ').slice(0, -3).join(' ')} Online.`);

var metaogurl = document.querySelector('meta[property="og:url"]');
metaogurl.setAttribute('content', `https://serialghar.fun/${data.url}`);
var canonicalLink = document.querySelector('link[rel="canonical"]');
canonicalLink.href = `https://serialghar.fun/${data.url}`;

var metapubtime = document.querySelector('meta[property="article:published_time"]');
metapubtime.setAttribute('content', data.createdAt);
var metamodtime = document.querySelector('meta[property="article:modified_time"]');
metamodtime.setAttribute('content', data.updatedAt);
var metatwtitle = document.querySelector('meta[name="twitter:title"]');
metatwtitle.setAttribute('content', data.title);

var metatwdes = document.querySelector('meta[name="twitter:description"]');
metatwdes.setAttribute('content', `Watch ${onlyname} Video Full Episode fun Serialghar,
${data.cat} Drama ${onlyname.split(' ').slice(0, -3).join(' ')} Today Episode On Youtube,
Desi Tv Serial ${onlyname.split(' ').slice(0, -3).join(' ')} Episode – ${onlyname.split(' ').slice(-3).join(' ')} Download in HD.Watch
${onlyname.split(' ').slice(0, -3).join(' ')} Online.`);


var metatwimg = document.querySelector('meta[name="twitter:image"]');
metatwimg.setAttribute('content', data.image);
var metaogimg = document.querySelector('meta[property="og:image"]');
metaogimg.setAttribute('content', data.image);

/* related content */
window.onload = function () {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/relatedblog");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.relatdata != null && response.relatdata != undefined) {
        if (response.uniqueurl != null && response.uniqueurl != undefined) {
          longurl = response.uniqueurl;
        }
        document.getElementById('relateddiv').innerHTML = '';
        for (var i = 0; i < response.relatdata.length; i++) {
          var atag = document.createElement('a');
          atag.title = response.relatdata[i].title;
          atag.href = response.relatdata[i].url;

          var img = document.createElement('img');
          img.src = response.relatdata[i].image;
          img.alt = response.relatdata[i].title;
          img.loading = 'lazy';

          var h2tag = document.createElement('h2');
          h2tag.innerHTML = response.relatdata[i].title;

          atag.appendChild(img);
          atag.appendChild(h2tag);
          document.getElementById('relateddiv').append(atag);
        }
      }
      return;
    } else {
      return;
    }
  };
  xhr.onerror = () => {
    return;
  };
  if (data.downlink.length < 3) {
    xhr.send(JSON.stringify({ tagdata: data.tag, arturl: data.url, uptade: 'yesupdate' }));
  } else {
    xhr.send(JSON.stringify({ tagdata: data.tag, arturl: data.url, uptade: 'noupdate' }));
  }
};