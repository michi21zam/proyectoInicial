const express = require('express'); // permitir crear un servidor web   
const app = express();
const path = require('path'); // donde estan los archivos estatisicos (html, css, js)
const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'estructura', 'home.html'));
});
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);

});