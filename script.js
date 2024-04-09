let searchButton = document.getElementById("submit");
let search = document.getElementById("search");
let countrycode;
// to get dropdown items
let dropdownItems = document.querySelectorAll(".dropdown-item");
let Values;

// Add a 'click' event listener to each item
dropdownItems.forEach((item) => {
  item.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default link
    Values = this.textContent; // get the text value of the clicked item
    document.getElementById("drop").textContent = Values; // set the dropdown button text to the clicked item
  });
});

if (Values == "USA") {
  countrycode = 1;
} else if (Values == "Madagascar") {
  countrycode = 261;
} else if (Values == "France") {
  countrycode = 33;
} else if (Values == "United Kingdom") {
  countrycode = 44;
} else {
  countrycode = 1;
}

async function findWeather() {
  const weatherData = document.getElementById("weather-data");
  const apiKey = `api-key-here`;
  weatherData.style.display = "block";
  let searchInput = document.getElementById("search").value;

  if (searchInput == "") {
    weatherData.innerHTML = `
      <div>
      <h2>Empty Input!</h2>
      <p>Please try again with a valid <u>city name</u>.</p>
      </div>
      `;
    return;
  }

  async function getLonAndLat() {
    const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(
      " ",
      "%20"
    )},${countrycode}&limit=1&appid=${apiKey}`;

    const response = await fetch(geoURL);
    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return;
    }
    const data = await response.json();
    if (data.length == 0) {
      console.log("Something went wrong here.");
      weatherData.innerHTML = `
      <div>
      <h2>Invalid Input: "${searchInput}"</h2>
      <p>Please try again with a valid <u>city name</u>.</p>
      </div>
      `;
      return;
    } else {
      return data[0];
    }
  }

  async function getWeatherData(lon, lat) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const response = await fetch(weatherURL);
    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return;
    }
    const data = await response.json();
    weatherData.style.display = "flex";
    weatherData.innerHTML = `
    <Img src="https://openweathermap.org/img/wn/${
      data.weather[0].icon
    }.png" alt="${data.weather[0].description}" width="100" />
    <div>
    <h2>${data.name}</h2>
    <p><strong>Temperature:</strong> ${Math.round(
      data.main.temp - 273.15
    )}°C</p>
    <p><strong>Description:</strong> ${data.weather[0].description}</p>
    </div>
    `;
  }
  document.getElementById("search").value = "";
  const geocodeData = await getLonAndLat();
  getWeatherData(geocodeData.lon, geocodeData.lat);
}

searchButton.addEventListener("click", findWeather);
search.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    findWeather();
  }
});
