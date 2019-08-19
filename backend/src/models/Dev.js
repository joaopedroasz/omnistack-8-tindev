// Arquivo de abstração de uma tabela no Banco de Dados.
const { Schema, model } = require('mongoose');

// Representação da tabela:
const DevSchema = new Schema({
    // Dados da tabela:
    name: {
        type: String,
        required: true
    },

    user: { // Usuário no Github.
        type: String,
        required: true
    },
    
    bio: String,

    avatar: {
        type: String,
        required: true
    },
    // Esquema de likes e dislikes.
    likes: [{
        type: Schema.Types.ObjectId, // O ID do usuário que foi dado like será armazenado.
        ref: 'Dev' // Referenciando o Model "Dev".
    }],

    dislikes: [{
        type: Schema.Types.ObjectId, // O ID do usuário que foi dado deslike será armazenado.
        ref: 'Dev' // Referenciando o Model "Dev".
    }]
}, {
    timestamps: true // Vai adicionar dois campus automáticos em cada usuário cadastrado: "createdAt", "updatedAt"
});

module.exports = model('Dev', DevSchema);
