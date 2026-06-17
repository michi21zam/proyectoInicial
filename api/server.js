const express = require("express");
const cors = require("cors");
const Rutas_Usuarios = require('./fuente/rutas/rutaUsuarios');
const Rutas_Facturas = require('./fuente/rutas/rutaFacturas');



const app = express();
const port = process.env.PORT || 3000;

// Configuración de CORS
app.use(cors({ origin: '*' }));

// Middleware para parsear JSON
app.use(express.json());

// Ruta de prueba
app.get('/end_point', (req, res) => {
    res.json({ mensaje: 'Servidor iniciado' });
});

// Rutas de la API
app.use('/api/Usuarios', Rutas_Usuarios);
app.use('/api/Facturas', Rutas_Facturas);



// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto localhost:${port}`);
});