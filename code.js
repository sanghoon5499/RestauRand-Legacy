// https://www.w3schools.com/html/tryit.asp?filename=tryhtml5_geolocation
// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API 
//   - HTML geolocation to find the user's lat and long

// idea: have a list of messages to display when loading up the map
//   document.getElementById("loadingTxt").innerHTML = messages[random];

// fix: red marker may be offset from the google maps marker

// QOL: some restaurants may have multiple entries due to multiple locations
//  can fix by removing duplicate entries and simply include the closest restaurant


// Use this key for GitHub Pages deployment: AIzaSyBMCbfKMOQmplUNvOiHNBalzBiXXabRG2c
// Local: AIzaSyBIwzALxUPNbatRBj3Xi1Uhp0fFzwWNBkE


function randomLatLng(min, max) {
    return (Math.random() * (max - min) + min).toFixed(4);
}

var placeNameArr = [];
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=[YOUR_KEY]&libraries=places">
function initMap() {
    document.getElementById("loading").style.display = "block";



    //////////////////////////////////////////////////////////////////////
    // Loading messages - add to the list as you see fit

    var messages = ["Did you know? Waterloo has at least five restaurants.", "Richard get back to work", "What are you craving?", "'boba' - Richard",
        "Did you know? Kitchener does in fact, have kitchens.", "Did you know? Cambridge doesn't have a bridge named Cam.",
        "Get ready for the pick!", "Burgers? Chinese food? Pizza?", "Did you know? Waterloo has plenty of water.",
        "Mmmmmmmmmmmm", "Don't drive under influence"];
    var messageIdx = Math.floor(Math.random() * messages.length);
    document.getElementById("loadingTxt").innerHTML = messages[messageIdx];

    //////////////////////////////////////////////////////////////////////


    //////////////////////////////////////////////////////////////////////
    // Setting latitude, longitude

    // user selected to find a restaurant near them:
    var latitude = localStorage.getItem("userLat");
    var longitude = localStorage.getItem("userLng");

    // user wanted to hae full random:
    if (localStorage.getItem("userLat") == 0) {
        latitude = randomLatLng(43.44, 43.47);
        longitude = randomLatLng(-80.58, -80.46);
    }

    // Create the map.
    //  - convert lat, long to int:
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);

    console.log(latitude);
    console.log(longitude);

    //////////////////////////////////////////////////////////////////////



    //////////////////////////////////////////////////////////////////////
    // Create map
    const waterloo = { lat: latitude, lng: longitude }; // lat: 43.46, lng: -80.52  <-- default values

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
    for (let i = 0; i < 3; i++) {
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
                console.log(obj["data"]);
                console.log("finished");
                return;
            }

            for (i in results) {
                let index = parseInt(i);
                if (load == 1) {
                    index += 20
                }
                else if (load == 2) {
                    index += 40
                }
                index.toString()
                //console.log(results[i]);
                //console.log(results.length);
                obj["data"][index] = results[i]
                console.log(index);
                console.log(obj["data"][index]);
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

            else if (load == 2) {
                console.log("yes");
                pickRandomRestaurant(map, obj);
            }
        }
    );

}


//////////////////////////////////////////////////////////////////////
// Add place to name array and add notable locations to map

function addPlaces(places, map, load) {
    const placesList = document.getElementById("places");
    console.log(places.length + 1000000);
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
            //console.log(place.name);
            map.setMapTypeId('terrain');

            const li = document.createElement("li");
            li.textContent = place.name;

            // use place.name to add to array
            if (placeNameArr.length < 60) {
                placeNameArr.push(place.name);
                //for (j in place.types) {
                console.log(place.business_status); // add index if loop
                //}//
            }
            //console.log(place.name);


            placesList.appendChild(li);
            li.addEventListener("click", () => {
                map.setCenter(place.geometry.location);
            });
        }
    }
}

//////////////////////////////////////////////////////////////////////
// Pick a random restaurant

function pickRandomRestaurant(map, obj) {
    // random variables
    var idx = Math.floor(Math.random() * placeNameArr.length);
    console.log(idx);
    var price_level = obj["data"][idx]["price_level"];
    var address = obj["data"][idx]["vicinity"];
    var straddress = address.substring(0, address.indexOf(", Waterloo")) // cuts of "..., Waterloo, ON" part of address


    // replace elements
    document.getElementById("rname").innerHTML = placeNameArr[idx];
    document.getElementById("address").innerHTML = straddress;



    // found a place; pan the map to that location and put a marker on it:
    const geocoder = new google.maps.Geocoder();
    geocodeAddress(geocoder, map, address);

    // debug
    console.log(obj["data"][idx]["price_level"]);
    console.log(straddress);
    console.log(obj["data"]["geometry"]);
    console.log(obj["data"][0]);
    console.log(obj["data"]);
}

// pans the map, and sets a red marker
function geocodeAddress(geocoder, resultsMap, fullAddress) {
    const address = fullAddress;
    geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK") {
            resultsMap.setCenter(results[0].geometry.location);
            console.log("this one");
            // red marker
            new google.maps.Marker({
                map: resultsMap,
                //title: results[0].name,
                position: results[0].geometry.location,
            });
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}


var filter1 = 1, filter2 = 1, filter3 = 1, filter4 = 1;
// two options:
// 1. go through the array and filter out all entries, then random select (prob more efficient)
//
// 2. keep randomly iterating through the array until an entry is valid
