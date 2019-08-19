import React from 'react';
import { YellowBox } from 'react-native'; // Importando Lib para cuidar de "Warnings" no react-native.

YellowBox.ignoreWarnings([
    'Unrecognized WebSocket' //Com isso, todo Warning que começar com as palavras 'Unrecognized WebSocket' vai ser ignorado.
]);

import Routes from './routes';

export default function App() {
    return (
        <Routes />
    );
}
