'use strict'

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

const app = express();
const port = 3000;

// let result = '';
// while (result.length < 30) {
//   const randomChar = String.fromCodePoint(Math.floor(Math.random() * (0x10FFFF - 0x20 + 1)) + 0x20);
//   result += randomChar;
// }
// const secret = result;

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
  secret: "@54bcl5]4Q++r7p=i2H]2ffw*71X~ZNnHXxptrGW",
  // secret: secret,
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false
}));

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mytripmemories"
});

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: true }));

//serving public file
app.use(express.static(__dirname));

// cookie parser middleware
app.use(cookieParser());

// a variable to save a session
var session;

app.post('/registro', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const chat_id = req.body.chat_id;

  // Verificar si el chat_id existe en la base de datos
  const checkQuery = "SELECT * FROM users WHERE chat_id = ?";
  const checkValues = [chat_id];

  con.query(checkQuery, checkValues, function (err, rows) {
    if (err) {
      console.log("Error en la verificación del chat_id:", err);
      res.sendStatus(500); // Enviar código de error al cliente
    } else {
      if (rows.length > 0) {
        // El chat_id existe, hacer un UPDATE en la base de datos
        const updateQuery = "UPDATE users SET username = ?, password = ? WHERE chat_id = ?";
        const updateValues = [username, password, chat_id];

        con.query(updateQuery, updateValues, function (err, result) {
          if (err) {
            console.log("Error en la actualización del usuario:", err);
            res.sendStatus(500);
          } else {
            console.log("Usuario actualizado: " + result.affectedRows);
            res.sendStatus(200); // Enviar código de éxito al cliente
          }
        });
      } else {
        // Verificar si el usuario existe en la base de datos
        const checkUserQuery = "SELECT * FROM users WHERE username = ?";
        const checkUserValues = [username];

        con.query(checkUserQuery, checkUserValues, function (err, rows) {
          if (err) {
            console.log("Error en la verificación del usuario:", err);
            res.sendStatus(500);
          } else {
            if (rows.length > 0) {
              console.log("El usuario ya existe");
              res.sendStatus(409); // Enviar código de conflicto al cliente (el usuario ya existe)
            } else {
              // El chat_id no existe y el usuario no existe, hacer un INSERT en la base de datos
              const insertQuery = "INSERT INTO users (username, password, chat_id) VALUES (?, ?, ?)";
              const insertValues = [username, password, chat_id];

              con.query(insertQuery, insertValues, function (err, result) {
                if (err) {
                  console.log("Error en la inserción del usuario:", err);
                  res.sendStatus(500);
                } else {
                  console.log("Usuario agregado: " + result.affectedRows);
                  res.sendStatus(200);
                }
              });
            }
          }
        });
      }
    }
  });
});

app.post('/login', (req, res) => {
  console.log(req.body)
  const username = req.body.username;
  const password = req.body.password;
  console.log(username + " y " + password);

  // Verificar las credenciales en la base de datos
  const checkQuery = "SELECT * FROM users WHERE username = ? AND password = ?";
  const values = [username, password];

  con.query(checkQuery, values, function (err, rows) {
    console.log(rows)
    if (err) {
      console.log("Error en la consulta:", err);
      res.sendStatus(500);
    } else {
      if (rows.length > 0) {
        console.log("Inicio de sesión exitoso: " + req.session.id);
        session = req.session;
        session.userid = req.body.username;
        console.log(session.userid);
        session.save();
        res.sendStatus(200);

      } else {
        console.log("Credenciales inválidas");
        res.sendStatus(401);
      }
    }
  });
});

app.get('/logout', (req, res) => {
  console.log("Cerrando sesion: " + req.session)
  console.log(req.session.userid)
  req.session.destroy((err) => {
    if (err) {
      console.log("Ha habido un error al intentar destruir la sesion: ", err);
      res.sendStatus(500);
    } else {
      res.redirect('/index.html'); // Redirect the user to the login page
    }
  });
});

app.get('/viajes', (req, res) => {
  const username = req.session.userid; // Obtener el ID del usuario de la sesión
  console.log("Session ID: " + req.session.id)
  console.log("User ID: " + req.session.userid)

  // Realizar la consulta a la base de datos para obtener los viajes del usuario
  const query = "SELECT DISTINCT trips.trip_name FROM users " +
    "INNER JOIN principal ON users.user_id = principal.user_id " +
    "INNER JOIN trips ON principal.trip_id = trips.trip_id " +
    "WHERE users.username = ?";
  const values = [username];

  con.query(query, values, function (err, rows) {
    if (err) {
      console.log("Error en la consulta de viajes:", err);
      res.sendStatus(500);
    } else {
      console.log(rows)
      res.json(rows); // Enviar los resultados como respuesta JSON al cliente
    }
  });
});

// Mapa
app.post('/mapa', (req, res) => {
  const username = req.session.userid; // Obtener el ID del usuario de la sesión
  const trip_name = req.body.trip_name;
  console.log("Session ID: " + req.session.id)
  console.log("User ID: " + req.session.userid)
  console.log("Viaje seleccionado: " + trip_name)

  // Realizar la consulta a la base de datos para obtener los viajes del usuario
  const query = "SELECT images.image_url, images.latitude, images.longitude, images.image_name FROM images " +
    "INNER JOIN principal ON principal.image_id = images.image_id " +
    "INNER JOIN trips ON principal.trip_id = trips.trip_id " +
    "INNER JOIN users ON principal.user_id = users.user_id " +
    "WHERE users.username = ? AND trips.trip_name = ?";
    console.log("Consulta: " + query)
  const values = [username, trip_name];

  con.query(query, values, function (err, rows) {
    if (err) {
      console.log("Error en la consulta de viajes:", err);
      res.sendStatus(500);
    } else {
      console.log(rows)
      res.setHeader('Content-Type', 'application/json'); // Set the response content type to JSON
      res.send(JSON.stringify(rows)); // Send the results as a JSON string
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
