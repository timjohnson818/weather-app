//API-Key: 9a5680c3ad651c3eb20dc93cf901d874
// API key for OpenWeatherMap
const apiKey = "9a5680c3ad651c3eb20dc93cf901d874";

// Function to get the weather forecast for a city
function getWeather(city) {
    $.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`, function (data) {
        // Get the weather forecast for the next five days
        let forecast = data.list.filter(function (item) {
            return item.dt_txt.includes("12:00:00");
        });

        // Build the HTML table for the weather forecast
        let table = "<table class='table table-bordered table-striped'>";
        table += "<thead><tr><th>Date</th><th>Temperature (F)</th><th>Humidity (%)</th><th>Description</th></tr></thead>";
        table += "<tbody>";

        for (let i = 0; i < forecast.length; i++) {
            let date = new Date(forecast[i].dt_txt);
            let temp = forecast[i].main.temp.toFixed(0);
            let humidity = forecast[i].main.humidity;
            let description = forecast[i].weather[0].description;
            let icon = `https://openweathermap.org/img/w/${forecast[i].weather[0].icon}.png`;

            table += `<tr><td>${date.toLocaleDateString()}</td><td>${temp}&deg;F</td><td>${humidity}%</td><td>${description}<img src='${icon}'></td></tr>`;
        }

        table += "</tbody></table>";

        // Add the weather forecast table to the page
        $("#weatherTable").html(table);

        // Add the city to the list of previous cities in local storage
        let previousCities = JSON.parse(localStorage.getItem("previousCities")) || [];
        if (!previousCities.includes(city)) {
            previousCities.unshift(city);
            localStorage.setItem("previousCities", JSON.stringify(previousCities));
        }

        // Update the list of previous cities on the page
        updatePreviousCities(previousCities);
    });
}

// Function to update the list of previous cities on the page
function updatePreviousCities(previousCities) {
    $("#previousCities").empty();
    for (let i = 0; i < previousCities.length; i++) {
        let cityLink = $("<a>").attr("href", "#").addClass("list-group-item list-group-item-action").text(previousCities[i]);
        $("#previousCities").append(cityLink);

        // When a previous city is clicked, search for its weather again
        cityLink.click(function () {
            $("#city").val(previousCities[i]);
            $("#cityForm").submit();
        });
    }
}

// When the form is submitted, get the weather for the city
$("#cityForm").submit(function (event) {
    event.preventDefault();
    let city = $("#city").val();
    getWeather(city);
});

// On page load, update the list of previous cities
let previousCities = JSON.parse(localStorage.getItem("previousCities")) || [];
updatePreviousCities(previousCities);