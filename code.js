// key: AIzaSyBMCbfKMOQmplUNvOiHNBalzBiXXabRG2c

function initMap() {
// Create the map.
const waterloo = { lat: 43.46, lng: -80.52 };
const map = new google.maps.Map(document.getElementById("map"), {
    center: waterloo,
    zoom: 17,
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


// Perform a nearby search.
service.nearbySearch(
    { location: waterloo, radius: 1000, type: "restaurant" },
    (results, status, pagination) => {
    if (status !== "OK" || !results) return;
    addPlaces(results, map);
    moreButton.disabled = !pagination || !pagination.hasNextPage;

    if (pagination && pagination.hasNextPage) {
        getNextPage = () => {
        // Note: nextPage will call the same handler function as the initial call
        pagination.nextPage();
        };
    }
    }
);
}

var placesArr = [];

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

        // use place.name to add to array
        placesArr.push(place.name);
        console.log(place.name)


        placesList.appendChild(li);
        li.addEventListener("click", () => {
            map.setCenter(place.geometry.location);
        });
        }
    }

    // choose a random index:
    var idx = Math.floor(Math.random() * placesArr.length);
    alert(placesArr[idx])
    
}
