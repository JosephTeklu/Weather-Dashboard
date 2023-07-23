const APIKEY = "876d9178a7e43554c3043e96fc51d481";

// array holds the last 5 searched cities
let lastFiveSearched = {0:"", 1: "", 2: ""};

function search() {
  // check in local storage if there are any cities recently searched
  // if (localStorage.getItem("lastFiveSearched")) {
  //   lastFiveSearched = JSON.parse(localStorage.getItem("lastFiveSearched"))

  //   console.log(lastFiveSearched[0])

  // }

  // event listner if the search button has been clicked
  $("#search-button").click(function (e) {
    // grab the user's given searched city and make it all lowercase
    let searchedCity = $("#city-input").val().toLowerCase();

    // make api call to get latitude and longitude of searched city
    $.ajax({
      type: "GET",
      url: `https://api.openweathermap.org/geo/1.0/direct?q=${searchedCity}&limit=5&appid=${APIKEY}`,
    }).then(function(response){
      // if there is no response the given city name is unacceptable show error message and return
      if(!response.length){
        $(".error-message").css("display", "block");
        return;
      }
      // turn off the possible error message
      $(".error-mesage").css("display", "none");
      // remove the search for a city message
      $(".orignal-message").css("display", "none");

      // grab the longitude and latitude of searched city from api response
      let lat = String(Number(response[0]['lat']).toFixed(2));
      let lon = String(Number(response[0]['lon']).toFixed(2));

      // grab the weather for the current day and display the current day's weather at top of page
      $.ajax({
        type: 'GET',
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}`,
        data: {
          units: 'imperial'
        }
      }).then(function(response){
        // make the first letter of the city capital
        searchedCity = searchedCity[0].toUpperCase() + searchedCity.slice(1);

        // add in the searched city's name alongside the current day
        $(".currentWeatherCityName").text(`Today's weather in ${searchedCity}: ${dayjs().format("MMM D, YYYY")} `);
        // add in icon bsed on the current day by adding in the source for the image tag through the icon in the api response
        $("#icon").attr("src", `https://openweathermap.org/img/w/${response.weather[0].icon}.png`);
        // add in the current temperature
        $(".today-temperature").text(`Temperature: ${response.main.temp} °F`);
        // add in the current wind speed
        $(".today-wind").text(`Wind: ${response.wind.speed} mph`);
        // add in the current humidity
        $(".today-humidity").text(`Humidity: ${response.main.humidity} %`);

        // show the current weather's card
        $(".current-weather-card").css("display", "block");
      })

      // make api call to get 5 day wether forecast throught lat and log by using imperial metrics
      $.ajax({ 
        type: 'GET',
        url: `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKEY}`,
        data: {
          units: 'imperial'
        }
      }).then(function(response){
        console.log(response);
        // prev keeps count to skip over enough 3 hour objects in the json to grab the next day's data 
        let prev = 0;
        // find each weather card day and add in details
        for (let i=1; i < 6; i++) {
          // go to the current weather card and add in weather info based on the day and what card
          $(`#weather-date${i}`).text(dayjs().add(i, "day").format('M/DD/YYYY'));
          $(`.icon${i}`).attr("src", `https://openweathermap.org/img/w/${response.list[prev].weather[0].icon}.png`);
          $(`#temperature${i}`).text(`Temperature: ${response.list[prev].main.temp} °F`);
          $(`#wind${i}`).text(`Wind: ${response.list[prev].wind.speed} mph`);
          $(`#humidity${i}`).text(`Humidity: ${response.list[prev].main.humidity} %`);

          prev += 8;
        }

        $(".container").css("display", "flex");

        // add the searched city to local storage
        localStorage.setItem("lastFiveSearched", searchedCity);

      })
    })
  });
}

search();
