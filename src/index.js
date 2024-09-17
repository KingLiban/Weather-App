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
  Sunny: ["Clear", "Sky Unchanged"],
  Cloudy: [
    "Partially cloudy",
    "Overcast",
    "Sky Coverage Increasing",
    "Sky Coverage Decreasing",
    "Smoke Or Haze",
    "Mist",
  ],
  Rainy: [
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
  Stormy: [
    "Thunderstorm",
    "Thunderstorm Without Precipitation",
    "Lightning Without Thunder",
    "Funnel Cloud/Tornado",
    "Squalls",
    "Duststorm",
  ],
  Snowy: [
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
  Foggy: ["Fog", "Freezing Fog"],
};
