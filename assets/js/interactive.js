


const htown_map = L.map('map-id').setView([29.749907, -95.358421], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(htown_map);

const stateAbbreviationToName = {

    "AL": "Alabama",
    "AK": "Alaska",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "FL": "Florida",
    "GA": "Georgia",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PA": "Pennsylvania",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
  };

const uniqueStates = [];

fetch('https://leedthanh.github.io/api/all_nursing_homes.geojson')
    .then(response => response.json())
    .then(data => {
        data.features.forEach(feature => {
            const state = feature.properties["Provider State"];
            if (!uniqueStates.includes(state)) {
                uniqueStates.push(state);
            }
        });
        

        // Create state filter ID and do a loop for unique states
        const stateFilter = document.getElementById('state-filter');
        uniqueStates.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = stateAbbreviationToName[state] || state; // Use the mapping or original abbreviation
            stateFilter.appendChild(option);
        });

        let stateSelected = ""; // Variable to store the selected state
        let ratingSelected = ""; // Variable to store the selected rating
        let filtersSelected = false; // Variable to track whether both filters are selected

        // Function to update map based on states and rating
        function updateMap(selectedState, selectRating) {
            htown_map.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    htown_map.removeLayer(layer);
                }
            });

            // Getting state name and rating, make sure it matches selected state and rating
            fetch('https://leedthanh.github.io/api/all_nursing_homes.geojson')
                .then(response => response.json())
                .then(data => {
                    L.geoJSON(data, {
                        filter: function (feature) {
                            const providerState = feature.properties["Provider State"];
                            const overallRating = parseFloat(feature.properties["Overall Rating"]);
                            // Checking both state and rating filters
                            const stateMatch = selectedState === "" || providerState === selectedState || stateAbbreviationToName[providerState] === selectedState;
                            const rateMatch = selectRating === "" || overallRating === parseFloat(selectRating);

                            return stateMatch && rateMatch;
                        },
                        onEachFeature: function (feature, layer) {
                            const popupContent = `
                                <b>Provider Name:</b> ${feature.properties["Provider Name"]}<br>
                                <b>Phone Number:</b> ${feature.properties["Provider Phone Number"]}<br>
                                <b>Rating:</b> ${feature.properties["Overall Rating"]}<br>
                                <b>Location:</b> ${feature.properties["Location"]}
                            `; // Last step: get bindPopup for location, rating, and provider name
                            layer.bindPopup(popupContent);
                        }
                    }).addTo(htown_map);
                });
        }

        
        // Add state filter event listener
        stateFilter.addEventListener('change', function () {
            stateSelected = this.value; // Getting selected state from user
            if (filtersSelected) {
                updateMap(stateSelected, ratingSelected);
            }
        });

        // Add rating filter event listener
        const ratingFilter = document.getElementById('rating-filter');
        ratingFilter.addEventListener('change', function () {
            ratingSelected = this.value; // Get the selected rating
            if (filtersSelected) {
                updateMap(stateSelected, ratingSelected);
            }
        });

        // Set the filtersSelected flag to true when both filters are selected
        //// no more lagging when added this event lister to only populate markers when both selected
        // The maps will run smoother if we add this event listerner.
        // when user load the page markers will not populate untill both states and rating selected
        // this allows users on phones and tablet devices to easiliy navigate the site
        // 
        stateFilter.addEventListener('change', function () {
            stateSelected = this.value; // Getting selected state from user
            if (ratingSelected !== "") {
                filtersSelected = true;
            }
        });

        ratingFilter.addEventListener('change', function () {
            ratingSelected = this.value; // Get the selected rating
            if (stateSelected !== "") {
                filtersSelected = true;
            }
        });

        // Initial check for both filters being selected
        stateFilter.addEventListener('change', function () {
            if (ratingSelected !== "" && this.value !== "") {
                filtersSelected = true;
                updateMap(this.value, ratingSelected);
            }
        });

        ratingFilter.addEventListener('change', function () {
            if (stateSelected !== "" && this.value !== "") {
                filtersSelected = true;
                updateMap(stateSelected, this.value);
            }
        });
    });

    //SEARCH FUNCTION
    
    function searchCity(city) {
        // Clear existing markers
        htown_map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                htown_map.removeLayer(layer);
            }
        });
    
        // Fetch data and filter by city
        fetch('https://leedthanh.github.io/api/all_nursing_homes.geojson')
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    filter: function (feature) {
                        const location = feature.properties["Location"];
                        return location.toLowerCase().includes(city.toLowerCase());
                    },
                    onEachFeature: function (feature, layer) {
                        const popupContent = `
                            <b>Provider Name:</b> ${feature.properties["Provider Name"]}<br>
                            <b>Phone Number:</b> ${feature.properties["Provider Phone Number"]}<br>
                            <b>Rating:</b> ${feature.properties["Overall Rating"]}<br>
                            <b>Location:</b> ${feature.properties["Location"]}
                        `;
                        layer.bindPopup(popupContent);
                    }
                }).addTo(htown_map);
            });
    }
    
    // Add event listener to the search button
    const locationSearchButton = document.getElementById('location-search-button');
    const locationSearchInput = document.getElementById('location-search-input');
    
    locationSearchButton.addEventListener('click', function () {
        const cityToSearch = locationSearchInput.value;
        if (cityToSearch.trim() !== "") {
            searchCity(cityToSearch);
        }
    });