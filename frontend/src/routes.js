import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Login from './pages/Login';
import Main from './pages/Main';

export default function Rutes() {
    return (
        //Parte de rotas da aplicação:
        <BrowserRouter>
            <Route path='/' exact component={Login} /> {/* O "exact" é usado para comparar exatamente a rota digitada, e não só o começo, que é como o react compara por deafult */}
            <Route path='/dev/:id' component={Main} />
        </BrowserRouter>
    );
}
