
var scheduleLinks = {
  group: null,
  pool: null,
  basketball: null
};

function init() {
  fetchYMCA();
}

function fetchYMCA() {

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://www.cambridgeymca.org/our-y/hours-schedules/", true);

  xhr.onload = function () {

    var html = xhr.responseText;

    document.getElementById("status").textContent = "Parsing YMCA schedules...";

    // STEP 1: extract ALL anchor tags with PDFs
    var linkRegex = /<a[^>]+href="(https?:\/\/[^"]+\.pdf[^"]*)"/g;

    var titleRegex = /<h5[^>]*>(.*?)<\/h5>/g;

    var links = [];
    var titles = [];

    var match;

    while ((match = linkRegex.exec(html)) !== null) {
      links.push(match[1]);
    }

    while ((match = titleRegex.exec(html)) !== null) {
      titles.push(match[1].toLowerCase());
    }

    console.log("Links:", links);
    console.log("Titles:", titles);

    // STEP 2: smart matching based on title keywords
    for (var i = 0; i < titles.length; i++) {

      var t = titles[i];
      var link = links[i];

      if (!link) continue;

      if (t.includes("group")) {
        scheduleLinks.group = link;
      }

      else if (t.includes("pool")) {
        scheduleLinks.pool = link;
      }

      else if (t.includes("basket")) {
        scheduleLinks.basketball = link;
      }
    }

    document.getElementById("status").textContent =
      "Schedules loaded ✔";
  };

  xhr.onerror = function () {
    document.getElementById("status").textContent =
      "Failed to load YMCA page";
  };

  xhr.send();
}

function openSchedule(type) {

  var url = scheduleLinks[type];

  if (!url) {
    document.getElementById("status").textContent =
      "Not found: " + type;
    return;
  }

  document.getElementById("status").textContent =
    "Opening " + type + "...";

  window.location.href = url;
}
