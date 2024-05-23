const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
require('dotenv').config();
const routes = require('./routes');

const app = express();
port = process.env.PORT;

// Configuração do EJS para renderização de views
app.set('view engine', 'ejs');

// Configuração para servir arquivos estáticos
app.use(express.static('public'));

// Middleware para tratar dados do corpo da solicitação
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);

// Inicia o servidor na porta especificada
app.listen(port, () => {
  console.log(`Servidor escutando na porta ${port}`);
});

// Mantém o programa em execução para evitar que ele encerre imediatamente
process.on('SIGINT', () => {
  connection.end();
  process.exit();
});