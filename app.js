// puma_data is defined in data.js

let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 34.0522, lng: -118.2437 },
    zoom: 10,
  });

  console.log(puma_data.length);

  for (let i = 0; i < puma_data.length; i++) {
    let curr = puma_data[i];

    let polygon = new google.maps.Polygon({
      paths: curr.coordinates[0],
      strokeWeight: 1,
      name: curr.name,
      puma_id: curr.puma,
    });

    polygon.setMap(map);

    //attach event listeners to this polygon
    google.maps.event.addListener(polygon, "mouseover", function (e) {
      injectTooltip(e, polygon.name);
    });

    google.maps.event.addListener(polygon, "mousemove", function (e) {
      moveTooltip(e);
    });

    google.maps.event.addListener(polygon, "mouseout", function (e) {
      deleteTooltip(e);
    });
  }

  console.log("done");
}

//create a global variable that will point to the tooltip in the DOM
var tipObj = null;

//offset along x and y in px
var offset = {
  x: 20,
  y: 20,
};

/********************************************************************
 * injectTooltip(e,data)
 * inject the custom tooltip into the DOM
 ********************************************************************/
var coordPropName = null;

function injectTooltip(event, data) {
  if (!tipObj && event) {
    //create the tooltip object
    tipObj = document.createElement("div");
    tipObj.setAttribute("class", "tooltip");
    tipObj.innerHTML = data;

    //fix for the version issue
    eventPropNames = Object.keys(event);
    if (!coordPropName) {
      //discover the name of the prop with MouseEvent
      for (var i in eventPropNames) {
        var name = eventPropNames[i];
        if (event[name] instanceof MouseEvent) {
          coordPropName = name;
          console.log("--> mouse event in", coordPropName);
          break;
        }
      }
    }

    if (coordPropName) {
      //position it
      tipObj.style.position = "fixed";
      tipObj.style.top = event[coordPropName].clientY + offset.y + "px";
      tipObj.style.left = event[coordPropName].clientX + offset.x + "px";

      //add it to the body
      document.body.appendChild(tipObj);
    }
  }
}

/********************************************************************
 * moveTooltip(e)
 * update the position of the tooltip based on the event data
 ********************************************************************/
function moveTooltip(event) {
  if (tipObj && event && coordPropName) {
    //position it
    tipObj.style.top = event[coordPropName].clientY + offset.y + "px";
    tipObj.style.left = event[coordPropName].clientX + offset.x + "px";
  }
}

/********************************************************************
 * deleteTooltip(e)
 * delete the tooltip if it exists in the DOM
 ********************************************************************/
function deleteTooltip(event) {
  if (tipObj) {
    //delete the tooltip if it exists in the DOM
    document.body.removeChild(tipObj);
    tipObj = null;
  }
}
