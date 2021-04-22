// https://www.w3schools.com/html/tryit.asp?filename=tryhtml5_geolocation
// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API 
//   - HTML geolocation to find the user's lat and long

// idea: have a list of messages to display when loading up the map
//   document.getElementById("loadingTxt").innerHTML = messages[random];
 

// Use this key for GitHub Pages deployment: AIzaSyBMCbfKMOQmplUNvOiHNBalzBiXXabRG2c


// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=[YOUR_KEY]&libraries=places">
function initMap() {
    document.getElementById("loading").style.display = "block";
    // var latitude = localStorage.getItem("lat");
    // var longitude = localStorage.getItem("lng");


    // Create the map.
    const waterloo = { lat: 43.46, lng: -80.52 };  // default values
    var map = new google.maps.Map(document.getElementById("map"), {
        center: waterloo,
        zoom: 17,
        mapId: "8d193001f940fde3",
    });
    // Create the places service.
    const service = new google.maps.places.PlacesService(map);
    let getNextPage;
    const moreButton = document.getElementById("more");
    
    // automate getNextPage
    for (let i = 0; i < 3; i++){
        moreButton.disabled = true;
        if (getNextPage) {
            getNextPage();
        }
    }
    

    obj = {
        "data": [],
    }
    let load = 0
    // Perform a nearby search.
    service.nearbySearch(
        { location: waterloo, radius: 1000, type: "restaurant" },
        (results, status, pagination) => {
            if (status !== "OK" || !results) {
                console.log(obj["data"])
                console.log("finished")
                return;
            }
            for (i in results) {
                let index = parseInt(i)
                if (load == 1) {
                    index += 20
                }
                else if (load == 2) {
                    index += 40
                }
                index.toString()
                //console.log(results[i])
                obj["data"][index] = results[i]
            }

            // obj["data"] += jsonify(results)
            addPlaces(results, map, load);

            /////////////////////////////////////////////////////////////////////////////////
            // If you want to be able to download the list of restaurants, enable this code
            /*
            if (load == 2) {
                const filename = 'data.json';
                const jsonStr = JSON.stringify(obj);
        
                let element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
                element.setAttribute('download', filename);
        
                element.style.display = 'none';
                document.body.appendChild(element);
        
                element.click();
        
                document.body.removeChild(element);
            }
            */
            moreButton.disabled = !pagination || !pagination.hasNextPage;

            if (load != 2) {
                pagination.nextPage();
                load++
            }

            else if (pagination && pagination.hasNextPage) {
                getNextPage = () => {
                    // Note: nextPage will call the same handler function as the initial call
                    pagination.nextPage();
                    load++
                };
            }
        }
    );
}


var placesArr = [];
function addPlaces(places, map, load) {
    const placesList = document.getElementById("places");

    for (const place of places) {
        if (place.geometry && place.geometry.location) {
        const image = {
            url: place.icon,
            size: new google.maps.Size(0, 0),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 14),
            scaledSize: new google.maps.Size(25, 25),
        };
        new google.maps.Marker({
            map,
            icon: image,
            title: place.name,
            position: place.geometry.location,
        });
        map.setMapTypeId('terrain');

        const li = document.createElement("li");
        li.textContent = place.name;
        
        // use place.name to add to array
        if (placesArr.length < 60) {
            placesArr.push(place.name);
        }
        console.log(place.name)


        placesList.appendChild(li);
        li.addEventListener("click", () => {
            map.setCenter(place.geometry.location);
        });
        }
    }



    // random variables
    var idx = Math.floor(Math.random() * placesArr.length);
    var price_level = obj["data"][idx]["price_level"];
    var address = obj["data"][idx]["vicinity"];
    var straddress = address.substring(0, address.indexOf(",")) // cuts of "...,Waterloo, ON" part of address


    // replace elements
    document.getElementById("rname").innerHTML = placesArr[idx];
    document.getElementById("address").innerHTML = straddress;



    // found a place; pan the map to that location:
    if (load == 2) {
        const geocoder = new google.maps.Geocoder();
        geocodeAddress(geocoder, map, address);
    }
    


    // debug
    console.log(obj["data"][idx]["price_level"])
    console.log(straddress);
    console.log(obj["data"]["geometry"]);
    console.log(obj["data"][0]);
    console.log(obj["data"]);
}



// converts location to longitude and latitude
function geocodeAddress(geocoder, resultsMap, fullAddress) {
    const address = fullAddress;
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK") {
        resultsMap.setCenter(results[0].geometry.location);
        new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location,
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }
  