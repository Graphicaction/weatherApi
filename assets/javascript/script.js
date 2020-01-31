var APIKey = "2a29d28596f5b969578c8d643d9842b5";
var city = "Austin";
// The URL we need to query the database
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + APIKey;
var queryUVI = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey;
var currentDay = moment().format("MMM Do YY"); 

// We then created an AJAX call for temperature humidity and windspeed
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
    var imgCode = response.weather[0].icon;
    var iconurl = "https://openweathermap.org/img/wn/" + imgCode + ".png";
    var img = $("<img>").attr("src", iconurl);
    $(".cityDate").text(response.name + " (" + currentDay + ")");
    $(".cityDate").append(img);
    //var FahrenheitTemp = Number((response.main.temp - 273.15) * 1.80 +32);
    $(".temperature").html("Temperature: " + response.main.temp + '&#8451');
    $(".humidity").text("Humidity: " + response.main.humidity);
    $(".windSpeed").text("Wind Speed: " + response.wind.speed);
    queryUVI = queryUVI + "&lat=" + response.coord.lat + "&lon=" +response.coord.lon;
    UVIndex(queryUVI);
});
// "http://api.openweathermap.org/data/2.5/uvi?appid=2a29d28596f5b969578c8d643d9842b5&lat=19.01&lon=72.85"
//AJAX call for getting UV Index
function UVIndex(uviUrl) {
    $.ajax({
        url: uviUrl,
        method: "GET"
        }).then(function(res) {
            console.log(res);
            $(".uvIndex").text("UV Index: " + res.value);
        });
}
    
    