import "./styles.css";
import "./reset.css";

async function getWeather(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=4HXY9KK92A5DTWSNXRHWRMTHR&contentType=json`,
      { mode: "cors" }
    );
    const weatherData = await response.json();
    console.log(weatherData);
    return weatherData;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

const basicWeatherTypes = {
  sunny: ["Clear", "Sky Unchanged"],
  cloudy: [
    "Partially cloudy",
    "Overcast",
    "Sky Coverage Increasing",
    "Sky Coverage Decreasing",
    "Smoke Or Haze",
    "Mist",
  ],
  rainy: [
    "Drizzle",
    "Heavy Drizzle",
    "Light Drizzle",
    "Heavy Drizzle/Rain",
    "Light Drizzle/Rain",
    "Rain",
    "Heavy Rain",
    "Light Rain",
    "Rain Showers",
    "Precipitation In Vicinity",
  ],
  stormy: [
    "Thunderstorm",
    "Thunderstorm Without Precipitation",
    "Lightning Without Thunder",
    "Funnel Cloud/Tornado",
    "Squalls",
    "Duststorm",
  ],
  snowy: [
    "Snow",
    "Heavy Snow",
    "Light Snow",
    "Blowing Or Drifting Snow",
    "Snow Showers",
    "Heavy Rain And Snow",
    "Light Rain And Snow",
    "Snow And Rain Showers",
    "Freezing Drizzle/Freezing Rain",
    "Heavy Freezing Drizzle/Freezing Rain",
    "Light Freezing Drizzle/Freezing Rain",
    "Heavy Freezing Rain",
    "Light Freezing Rain",
    "Ice",
    "Hail Showers",
    "Hail",
    "Diamond Dust",
  ],
  foggy: ["Fog", "Freezing Fog"],
};

function getBasicWeatherType(apiWeatherType) {
  console.log(`Attempting to find basic weather type for: "${apiWeatherType}"`);

  // Convert apiWeatherType to lowercase for case-insensitive matching

  for (const [basicType, types] of Object.entries(basicWeatherTypes)) {
    console.log(`Checking against ${basicType}: ${types.join(", ")}`);

    if (types.some((type) => apiWeatherType.includes(type))) {
      console.log(`Found basic weather type: ${basicType}`);
      return basicType;
    }
  }

  console.log(`No match found. Defaulting to 'cloudy' as basic weather type.`);
  return "cloudy";
}

function createDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC", // Ensure the date is formatted in UTC
  });

  console.log(
    `Original date string: ${dateString}, Formatted date: ${formattedDate}`
  );
  return formattedDate;
}

const domHandler = (function () {
  function renderAddress(address) {
    const dateElement = document.querySelector(".main-info p:first-child");
    dateElement.textContent = address;
  }

  function renderDate(dateString) {
    const dateElement = document.querySelector(".main-info p:last-child");
    const formattedDate = createDate(dateString);
    dateElement.textContent = formattedDate;
    console.log(`Rendering date: ${formattedDate}`);
  }

  function renderCurrentTemperatures(temp, tempmax, tempmin, weather) {
    const currentWeather = document.querySelector(".weather-info p");
    currentWeather.textContent = `${temp}°`;

    const minmax = document.querySelector(".values-range");
    minmax.textContent = `${tempmax}°F/${tempmin}°F`;

    const weatherElement = document.querySelector(".sub-info p:last-child");
    weatherElement.textContent = weather;

    const weatherSvg = document.querySelector(".weather img");
    const basicWeatherType = getBasicWeatherType(weather.split(",")[0]);
    const svgPath = require(`./assets/${basicWeatherType}.svg`);

    // Force browser to reload image by adding a timestamp
    weatherSvg.src = `${svgPath}?t=${new Date().getTime()}`;
    console.log(`Weather SVG path: ${weatherSvg.src}`);
  }

  function renderWeatherDetails(weatherDetails) {
    const detailsElements = document.querySelectorAll(
      ".today-details > div > p"
    );
    detailsElements.forEach((element, index) => {
      switch (index) {
        case 0:
          element.textContent = `${weatherDetails.feelsLike}°`;
          break;
        case 1:
          element.textContent = `${weatherDetails.precipprob}%`;
          break;
        case 2:
          element.textContent = `${weatherDetails.windspeed} mph`;
          break;
        case 3:
          element.textContent = `${weatherDetails.humidity}%`;
          break;
        case 4:
          element.textContent = weatherDetails.uvindex;
          break;
      }
    });
  }

  function renderFutureForecasts(futureForecasts) {
    const daysElements = document.querySelectorAll(".day");

    daysElements.forEach((element, index) => {
      const today = futureForecasts[index];
      // Get only the name of the date
      const date = createDate(today.datetime).split(",")[0];
      element.querySelector("p:first-child").textContent = date;

      const weather = today.conditions;
      const futureConditionElement = element.querySelector("p:nth-child(3)");
      futureConditionElement.textContent = weather;

      // Splitting the weather string to get the first part of the weather description
      const firstPartOfWeather = weather.split(",")[0];
      const basicWeatherType = getBasicWeatherType(firstPartOfWeather);
      const svgPath = require(`./assets/${basicWeatherType}.svg`);
      const weatherImg = element.querySelector("img");
      weatherImg.src = `${svgPath}?t=${new Date().getTime()}`;

      const highsLowsElement = element.querySelector(".values-range");
      const highsLows = `${today.tempmax}° / ${today.tempmin}°`;
      highsLowsElement.textContent = highsLows;

      console.log(`
        Day: ${date},
        Weather: ${weather},
        Basic Weather Type: ${basicWeatherType},
        SVG: ${weatherImg.src},
        Highs/Lows: ${highsLows}
      `);
    });
  }

  const init = function (weatherData) {
    renderAddress(weatherData.resolvedAddress);
    const weatherToday = weatherData.days[0];
    renderDate(weatherToday.datetime);
    renderCurrentTemperatures(
      weatherToday.temp,
      weatherToday.tempmax,
      weatherToday.tempmin,
      weatherToday.conditions
    );
    renderWeatherDetails({
      feelsLike: weatherToday.feelslike,
      precipprob: weatherToday.precipprob,
      windspeed: weatherToday.windspeed,
      humidity: weatherToday.humidity,
      uvindex: weatherToday.uvindex,
    });
    renderFutureForecasts([
      weatherData.days[1],
      weatherData.days[2],
      weatherData.days[3],
      weatherData.days[4],
      weatherData.days[5],
    ]);
  };

  return { init };
})();

document.addEventListener("DOMContentLoaded", async () => {
  const location = "Boston";
  domHandler.init(await getWeather(location));
});

const submit = document.querySelector("#submit");
const input = document.querySelector("header input");

submit.addEventListener("click", async () => {
  const location = input.value;
  console.log(`Location chosen: ${location}`);
  input.value = "";
  const weatherData = await getWeather(location);
  if (weatherData) {
    domHandler.init(weatherData);
  } else {
    alert(
      "Failed to fetch weather data. Invalid location or server issue. Please try again."
    );
  }
});

// Prevents form submission on enter key press
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    submit.click();
  }
});
