/**
 * @format
 */

import {AppRegistry} from 'react-native';
import index from './src/index'; // Importando "index.js" da pasta src.
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => index); // Esse index é o da pasta "src".
