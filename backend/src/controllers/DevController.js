const axios = require('axios'); // Através do "axios", podemos utilizar outras API's.

const Dev = require('../models/Dev')

module.exports = {
    async index(req, res) {
        const { user } = req.headers;

        const loggedDev = await Dev.findById(user);

        // Pegando todos os usuários aplicando uma filtragem:
        const users = await Dev.find({
            $and: [ // Comparar todas as condições juntas (não ser o mesmo usuário E não estár na lista dos likes E não estar na lista dos dislikes).
                { _id: { $ne: user } }, // Comparação: Pegar todos os usuários menos o usuário que está logado.
                { _id: { $nin: loggedDev.likes } }, // Comparação: Pegar todos os usuários menos os que estejam na lista dos liskes.
                { _id: { $nin: loggedDev.dislikes } } // Comparação: Pegar todos os usuários menos os que estejam na lista dos dislikes.
            ]
        });

        return res.json(users);
    },

    async store(req, res) {
        const { username } = req.body; // Buscando uma informação dentro da requisição.

        const userExists = await Dev.findOne({ user: username });

        if (userExists) {
            return res.json(userExists);
        }

        const response = await axios.get(`https://api.github.com/users/${username}`); // Buscando usuário na API de usuários do GitHub.

        const { name, bio, avatar_url: avatar } = response.data;

        // Salvando informações no banco de dados:
        const dev = await Dev.create({
            name,
            user: username,
            bio,
            avatar
        });

        return res.json(dev);
    }
};
