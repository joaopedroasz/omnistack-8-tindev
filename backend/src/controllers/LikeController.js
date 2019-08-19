const Dev = require('../models/Dev')

module.exports = {
    async store(req, res) {
        // console.log(req.io, req.connectedUsers); // Tenho acesso a variáveis que estão no "server.js".

        const { user } = req.headers; // "req.headers.user" é usado para pegar o usuário que está logado.

        const { devId } = req.params; // "req.params.devId" é usado para pegar variáveis da URL.

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        if (!targetDev) { // Se não existir "targetDev"
            return res.status(400).json({ error: 'Dev not exists' });
        }

        if (targetDev.likes.includes(loggedDev._id)) { // Se no array de likes do targetDev, tiver o ID do loggedDev, é pq os dois trocaram likes e deu martch!
            const loggedSocket = req.connectedUsers[user];
            const targetSocket = req.connectedUsers[devId];

            if (loggedSocket) { // Se o usuário estiver usando a aplicação na hora do match, loggedSocket = true.
                req.io.to(loggedSocket).emit('match', targetDev); // Mandando uma mensagem para o loggedSocket do tipo 'math' com as informações no targetDev.
            }

            if (targetSocket) {
                req.io.to(targetSocket).emit('match', loggedDev); // Mandando uma mensagem de match para o targetSocket com as informações do loggedDev.
            }
        }

        loggedDev.likes.push(targetDev._id); // Adicionando o ID do dev que recebeu o like, no array de likes do dev que deu o like.

        await loggedDev.save();

        return res.json(loggedDev);
    }
};
