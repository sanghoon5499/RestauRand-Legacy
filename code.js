// key: AIzaSyBMCbfKMOQmplUNvOiHNBalzBiXXabRG2c

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBIwzALxUPNbatRBj3Xi1Uhp0fFzwWNBkE&libraries=places">
function initMap() {
    // Create the map.
    const waterloo = { lat: 43.46, lng: -80.52 };
    const map = new google.maps.Map(document.getElementById("map"), {
        center: waterloo,
        zoom: 16,
        mapId: "8d193001f940fde3",
    });
    // Create the places service.
    const service = new google.maps.places.PlacesService(map);
    let getNextPage;
    const moreButton = document.getElementById("more");

    moreButton.onclick = function () {
        moreButton.disabled = true;

        if (getNextPage) {
            getNextPage();
        }
    };

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
            addPlaces(results, map);

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
            moreButton.disabled = !pagination || !pagination.hasNextPage;

            if (pagination && pagination.hasNextPage) {
                getNextPage = () => {
                    // Note: nextPage will call the same handler function as the initial call
                    pagination.nextPage();
                    load++
                };
            }
        }
    );
}



function addPlaces(places, map) {
    const placesList = document.getElementById("places");

    for (const place of places) {
        if (place.geometry && place.geometry.location) {
        const image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25),
        };
        new google.maps.Marker({
            map,
            icon: image,
            title: place.name,
            position: place.geometry.location,
        });

        

        const li = document.createElement("li");
        li.textContent = place.name;

        var placesArr = [];
        // use place.name to add to array
        if (placesArr.length <= 59) {
            placesArr.push(place.name);
        }
        console.log(place.name)


        placesList.appendChild(li);
        li.addEventListener("click", () => {
            map.setCenter(place.geometry.location);
        });
        }
    }

    // choose a random index:
    var idx = Math.floor(Math.random() * placesArr.length);
    document.getElementById("info").innerHTML = placesArr[idx];
    //alert(placesArr[idx])
    

    // create a function for this later
    
}