// App.js
import React, { useState } from "react";
import "./App.css";

const fechaActual = new Date();
const fechaSiguiente = new Date();
fechaSiguiente.setDate(fechaActual.getDate() + 2);

const fechaFormateada = fechaSiguiente.toLocaleDateString();

const API_WEATHER = `http://api.weatherapi.com/v1/forecast.json?key=3b6614e1cce64b2f86503754241401&lang=es&q=`;

export default function App() {
  const [city, setCity] = useState("");
  const [error, setError] = useState({
    error: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temperature: 0,
    condition: "",
    conditionText: "",
    icon: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError({ error: false, message: "" });
    setLoading(true);
  
    try {
      if (!city.trim()) throw { message: "El campo ciudad es obligatorio" };
  
      // Obtener la información actual
      const currentRes = await fetch(API_WEATHER + city);
      const currentData = await currentRes.json();
  
      if (currentData.error) {
        throw { message: currentData.error.message };
      }
  
      // Obtener la previsión semanal
      const forecastRes = await fetch(API_WEATHER + city + "&days=7");
      const forecastData = await forecastRes.json();
  
      if (forecastData.error) {
        throw { message: forecastData.error.message };
      }
  
      console.log(currentData, forecastData);
  
      setWeather({
        city: currentData.location.name,
        country: currentData.location.country,
        temperature: currentData.current.temp_c,
        condition: currentData.current.condition.code,
        conditionText: currentData.current.condition.text,
        icon: currentData.current.condition.icon,
        forecast: forecastData.forecast.forecastday.slice(1), // Guarda la previsión semanal
      });
    } catch (error) {
      console.error(error);
      setError({ error: true, message: error.message });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container">
      <h1>Weather App</h1>
      <form className="form" autoComplete="off" onSubmit={onSubmit}>
        <input
          id="city"
          type="text"
          placeholder="Ciudad"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={error.error ? "error" : ""}
        />
        <button type="submit" disabled={loading}>
          Buscar
        </button>
      </form>

      {weather.city && (
        <div className="weather-info">
          <h2>
            {weather.city}, {weather.country}
          </h2>
          <img src={weather.icon} alt={weather.conditionText} />
          <h3>{weather.temperature} °C</h3>
          <h4>{weather.conditionText}</h4>
          <div className="forecast">
            {weather.forecast &&
            weather.forecast.map((day, index) => (
            <div key={index} className="forecast-item">
                <img src={day.day.condition.icon} alt="" />
                <p>{new Date(day.date).toLocaleDateString()}</p>
            
        </div>
    ))}
</div>
        </div>
      )}

      <p className="attribution">
        Powered by:{" "}
        <a href="https://www.weatherapi.com/" title="Weather API">
          WeatherAPI.com
        </a>
      </p>
    </div>
  );
}



/*import { LoadingButton } from "@mui/lab";
import { Box, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import Grid from "@mui/material/Grid";

const fechaActual = new Date();
const fechaSiguiente = new Date();
    fechaSiguiente.setDate(fechaActual.getDate() + 1);

const fechaFormateada = fechaSiguiente.toLocaleDateString();

const API_WEATHER = `http://api.weatherapi.com/v1/current.json?key=3b6614e1cce64b2f86503754241401&lang=es&q=`;

export default function App() {
  const [city, setCity] = useState("");
  const [error, setError] = useState({
    error: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temperature: 0,
    condition: "",
    conditionText: "",
    icon: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError({ error: false, message: "" });
    setLoading(true);

    try {
      if (!city.trim()) throw { message: "El campo ciudad es obligatorio" };

      const res = await fetch(API_WEATHER + city);
      const data = await res.json();

      if (data.error) {
        throw { message: data.error.message };
      }

      console.log(data);

      setWeather({
        city: data.location.name,
        country: data.location.country,
        temperature: data.current.temp_c,
        condition: data.current.condition.code,
        conditionText: data.current.condition.text,
        icon: data.current.condition.icon,
      });
    } catch (error) {
      console.log(error);
      setError({ error: true, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{ mt: 2 }}
    >
      <Typography
        variant="h3"
        component="h1"
        align="center"
        gutterBottom
      >
        Weather App
      </Typography>
      <Box
        sx={{ display: "grid", gap: 2 }}
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextField
          id="city"
          label="Ciudad"
          variant="outlined"
          size="small"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={error.error}
          helperText={error.message}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          loading={loading}
          loadingIndicator="Buscando..."
        >
          Buscar
        </LoadingButton>
      </Box>

      {weather.city && (
        <Box
          sx={{
            mt: 2,
            display: "grid",
            gap: 2,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            component="h2"
          >
            {weather.city}, {weather.country}
          </Typography>
          <Box
            component="img"
            alt={weather.conditionText}
            src={weather.icon}
            sx={{ margin: "0 auto" }}
          />
          <Typography
            variant="h5"
            component="h3"
          >
            {weather.temperature} °C
          </Typography>
          <Typography
            variant="h6"
            component="h4"
          >
            {weather.conditionText}
          </Typography>
           <Grid
        container
        spacing={2}
      >
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <img src={weather.icon} alt="" />
          <p>{fechaFormateada}</p>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <img src={weather.icon} alt="" />
          <p>{fechaFormateada}</p>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <img src={weather.icon} alt="" />
          <p>{fechaFormateada}</p>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <img src={weather.icon} alt="" />
          <p>{fechaFormateada}</p>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <img src={weather.icon} alt="" />
          <p>{fechaFormateada}</p>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <img src={weather.icon} alt="" />
          <p>{fechaFormateada}</p>
        </Grid>
      </Grid>
        </Box>
      )}

      <Typography
        textAlign="center"
        sx={{ mt: 2, fontSize: "10px" }}
      >
        Powered by:{" "}
        <a
          href="https://www.weatherapi.com/"
          title="Weather API"
        >
          WeatherAPI.com
        </a>
      </Typography>
     
    </Container>
  );
}
/*import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

const fechaActual = new Date();
const fechaSiguiente = new Date();
    fechaSiguiente.setDate(fechaActual.getDate() + 1);

const fechaFormateada = fechaSiguiente.toLocaleDateString();

export default function App() {
  return (
    <Container>
      <Grid
        container
        spacing={2}
      >
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <img src="../public/vite.svg" alt="" />
          <p>{fechaFormateada}</p>
        </Grid>
       
      </Grid>
    </Container>
  );
}*/
