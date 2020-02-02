var APIKey = "2a29d28596f5b969578c8d643d9842b5";
var city = "Apex";
// The URL we need to query the database

var queryUVI = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey;
var currentDay = moment().format('L'); 

init();

// We then created an AJAX call for temperature humidity and windspeed
function init(){
    fiveDayForecast();
    cityDetails();
    // searchHistory();
}

//When clicked on search for cities
function searchCity() {
    city = $("#searchText").val().trim();
    cityDetails();
}

//function to display city details
function cityDetails() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(data) {
        var imgCode = data.weather[0].icon;
        var iconurl = "https://openweathermap.org/img/wn/" + imgCode + ".png";
        var img = $("<img>").attr("src", iconurl);
        $(".cityDate").text(data.name + " (" + currentDay + ")");
        $(".cityDate").append(img);
        //var FahrenheitTemp = Number((response.main.temp - 273.15) * 1.80 +32);
        $(".temperature").html("Temperature: " + data.main.temp + '&#8451');
        $(".humidity").text("Humidity: " + data.main.humidity);
        $(".windSpeed").text("Wind Speed: " + data.wind.speed);
        queryUVI = queryUVI + "&lat=" + data.coord.lat + "&lon=" +data.coord.lon;
        console.log(queryUVI);
        UVIndex(queryUVI);
        
    });
}

//AJAX call for getting UV Index
function UVIndex(uviUrl) {
    return $.ajax({
        
        url: uviUrl,
        method: "GET"
        }).then(function(res) {
            console.log(res);
            $(".uvIndex").text("UV Index: " + res.value);
        });
}

//Display five day forecast
function fiveDayForecast() {
    for(var i = 0; i < 5; i++) {
        $(".date"+i).text(currentDay);
    }
}

function searchHistory(){

}