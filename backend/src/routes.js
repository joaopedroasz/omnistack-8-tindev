// Rotas da aplicação:
const { Router } = require('express'); // Importando Router do express.

const DevController = require('./controllers/DevController'); //Importando funções do arquivo DevController.
const LikeController = require('./controllers/LikeController');
const DislikeController = require('./controllers/DislikeController');

const routes = Router(); // Importando função de rotas do express.

routes.get('/devs', DevController.index); // Listagem de usuários.
routes.post('/devs', DevController.store); // Chamando a função "store" do arquivo DevController, quando a url "/devs" for digitada.

routes.post('/devs/:devId/likes', LikeController.store);
routes.post('/devs/:devId/dislikes', DislikeController.store);

module.exports = routes; // Exportando rotas, para que a aplicação saiba as rotas que existem
