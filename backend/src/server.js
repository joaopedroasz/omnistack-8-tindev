const express = require('express'); // Biblioteca que vai ajudar na parte de "route" e server da aplicação. Quando é chamada, o servidor inicia.
const mongoose = require('mongoose'); // Importando biblioteca para utilizar o banco de dados. Nessa biblioteca se utiliza JS para fazer tudo no BD.
const cors = require('cors');

const routes = require('./routes'); // Importando rotas. (Arquivo local)

const httpServer = express(); // Iniciando o servidor. Geralmente é chamado de "app".
const server = require('http').Server(httpServer); // Fazendo isso, nossa aplicação vai aceitar conexões HTTP e WebSocket.
const socketIo = require('socket.io')(server); // Lib que permite que usemos protocolo WebSocket no projeto, invés de só HTTP. WebSocket é mais rápido e vai ser usado para enviar mensagens para o front-end e mobile em tempo real.
// O require do socket.io (require('socket.io')) retorna uma função, que nesse caso está sendo usada para dizer ao servidor ouvir conexões HTTP e WebSocket. 

// Guardando ID do socket e do usuário conectado.
const connectedUsers = {};

socketIo.on('connection', socket => { // Sempre que algum usuário fazer alguma conexão WebSocket, vai entrar ai:
    const { user } = socket.handshake.query; // Pegando o ID do usuário que o frontend mandou.

    connectedUsers[user] = socket.id; // Preenchendo o objeto "connectedUsers".
});

mongoose.connect('mongodb+srv://...', {
    useNewUrlParser: true
});

// Fazendo um middleware para mandar informações para os arquivos controllers. | O parametro "next" é chamado depois que a função é executada, para dar prosseguimento ao progama.
httpServer.use((req, res, next) => {
    req.io = socketIo;
    req.connectedUsers = connectedUsers;

    return next();
});

httpServer.use(cors()); // Biblioteca que permite com que nosso backend possa ser acessado por outras aplicações, como ReactJS e React Native, no front-end e mobile.
httpServer.use(express.json()); // Com essa linha, o express vai entender requisições com JSON.
httpServer.use(routes); // Adicionando funcionalidades de outro arquivo no servidor.

server.listen(3333); // Iniciando a porta do servidor. (localhost:3333)
