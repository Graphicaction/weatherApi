var APIKey = "2a29d28596f5b969578c8d643d9842b5";
var city = "Apex";
var cities = [];
var cityNotExist = false;
var isCelsius = true;
// The URL we need to query the database

var currentDay = moment().format('L'); 

init();

// function when the page is loaded
function init(){
    clear();
    cityDetails();
}

//When clicked on search for cities
function searchCity() {
    city = $("#searchText").val().trim();
    if($.isNumeric(city) == false){
        //call Ajax call function for city details, five day forecast and add city in the list
        cityDetails();
    } else {
        $('#noCityModal').modal('show');
    }
}

//function to display city details
function cityDetails() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + APIKey;
    var queryUVI = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(data) {
        //Getting image code and setting the image's src to its url
        var imgCode = data.weather[0].icon;
        var iconurl = "https://openweathermap.org/img/wn/" + imgCode + ".png";
        var img = $("<img>").attr("src", iconurl);
        $(".cityDate").text(data.name + " (" + currentDay + ")");
        $(".cityDate").append(img);
        if(!isCelsius) {
            var fahrenheitTemp = Math.floor(data.main.temp * 1.80 +32);
            $(".temperature").html("Temperature: " + fahrenheitTemp + '&#8457');
        }else {
            $(".temperature").html("Temperature: " + data.main.temp + '&#8451');
        }
        $(".humidity").text("Humidity: " + data.main.humidity);
        $(".windSpeed").text("Wind Speed: " + data.wind.speed);
        queryUVI = queryUVI + "&lat=" + data.coord.lat + "&lon=" +data.coord.lon;
       //call function to display UVindex, fivedayforecast and display city searched in the list
        UVIndex(queryUVI);
        fiveDayForecast();
        renderCity();
    },function(error){
        //For invalid input show the error message
       $('#noCityModal').modal('show');
    });
}

//AJAX call for getting UV Index
function UVIndex(uviUrl) {
    return $.ajax({
        url: uviUrl,
        method: "GET"
        }).then(function(res) {
            var uvValue = Math.floor(res.value);
            var uvScale = '';
            if(uvValue >= 1 && uvValue <= 2){
                uvScale = 'low';
            } else if (uvValue >= 3 && uvValue <= 5){
                uvScale = 'moderate';
            } else if(uvValue >= 6 && uvValue <= 7){
                uvScale = 'high';
            } else if(uvValue >= 8 && uvValue <= 10){
                uvScale = 'very high';
            } else if(uvValue >= 11){
                uvScale = 'extreme';
            }
            switch (uvScale) { 
                case 'low': 
                    $(".uvIndex").text(res.value).css("background-color", '#33FFC1').css('color', 'black');
                    break;
                case 'moderate': 
                    $(".uvIndex").text(res.value).css("background-color", '#FFE033').css('color', 'black');
                    break;
                case 'high': 
                    $(".uvIndex").text(res.value).css("background-color", '#FFB533').css('color', 'black');
                    break;		
                case 'very high': 
                    $(".uvIndex").text(res.value).css("background-color",'#FF3C33').css('color', 'white');
                    break;
                case 'extreme':
                    $(".uvIndex").text(res.value).css("background-color",'#A50CB3').css('color', 'white');
            }
    });
}
//Display five day forecast
function fiveDayForecast() {
    $("#fiveDayForecast").empty();
    return $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=2a29d28596f5b969578c8d643d9842b5",
        method: "GET"
        }).then(function(res) {
            for(var i=0; i < res.list.length; i++) {
                //Spliting the date into two parts one for date and one for time
                var dateTime = (res.list[i].dt_txt).split(" ");
                //Displaying the weather for 5 days at 12 noon
                if(dateTime[1] ==="12:00:00") {
                    //Getting image code and setting the image's src to its url
                    var iconImg = res.list[i].weather[0].icon;
                    var iconurl = "https://openweathermap.org/img/wn/" + iconImg + ".png";
                    var imgIcon = $("<img>").attr("src", iconurl);
                    //creating card and setting its content
                    var cardDiv = $("<div>").attr("class","card text-white bg-primary m-1");
                    var cardHeader = $("<h5>").attr("class","card-header").text(moment(dateTime[0]).format('L'));
                    var cardBodyDiv =$("<div>").attr("class","card-body text-center");
                    //Checking if the temperature should be in Fahrenheit or Celsius
                    if(!isCelsius) {
                        var fahrenheitTemp = Math.floor(res.list[i].main.temp * 1.80 +32);
                        var temp = $("<h5>").attr("class", "card-text").html(fahrenheitTemp + '&#8457');
                    }else {
                        var temp = $("<h5>").attr("class", "card-text").html(res.list[i].main.temp + '&#8451');
                    }
                    var humidity = $("<p>").attr("class", "card-text").text("Humidity: " + res.list[i].main.humidity);
                    cardBodyDiv.append(imgIcon, temp, humidity);
                    //Adding the cardheader and CardBody into Card
                    cardDiv.append(cardHeader, cardBodyDiv);
                    //Adding the Card in the Row
                    $("#fiveDayForecast").append(cardDiv);   
                }
            }
    });
}
//When clicked on Fahrenheit button
function tempFahrenheit() {
    isCelsius = false;
    //Disabling 'F' button and enabling 'C' button
    cBtn.disabled = false;
    fBtn.disabled = true;
    cityDetails();
}
//When clicked on Celsius button
function tempCelsius() {
    isCelsius = true;
    //Disabling 'C' button and enabling 'F' button
    cBtn.disabled = true;
    fBtn.disabled = false;
    cityDetails();
}
//Updating cities array depending on city is already in the list or not
function renderCity() {
    var cityInList = false;
    for(let i = 0; i< cities.length; i++){
        if(city.toUpperCase() == cities[i].toUpperCase()) {
            //If Ajax call returns city exits change  cityInList 'true'
            cityInList = true;
            break;
        }
    }
    //If city does not exits in the list put it in the list and push it into cities array
    if(cityInList === false) {
        cities.push(city);
        displayCities();
    }
}
//making and displaying list
function displayCities() {
    city = city.charAt(0).toUpperCase() + city.slice(1);
    //setting anchor tag with classes and onClick calling a function with id as a parameter
    var li = $("<a>").attr("class", "border px-5 p-3 mb-1 text-center").attr('href', '#').attr('onClick', 'openClickedCity(id)').attr('id', city).css('display','block').text(city);
    $("#cityList").append(li);
}
//function when a city is clicked on search history
function openClickedCity(id){
    city = id;
    cityDetails();
}
//function to display the search history and store into local storage
function searchHistory(){
    clear();
}
//Function to clear the city list
function clear() {
    cities = [];
}