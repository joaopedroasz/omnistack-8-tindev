import {
    createAppContainer, // Método que engloba todas as rotas da aplicação.
    createSwitchNavigator, // Esse método faz a troca de páginas sem nenhum tipo da animação ou opção de retorno para a página anterior.
    createStackNavigator, // Método que faz a troca de páginas com animações.
    createBottomTabNavigator, // Cria uma navegação por abas na parte de baixo do celular.
    createMaterialTopTabNavigator, // Cria uma navegação por abas no topo do celular
    createDrawerNavigator, // Cria uma navegação por uma barra lateral que o usuário pode arrastar.
} from 'react-navigation';

import Login from './pages/Login';
import Main from './pages/Main';

export default createAppContainer(
    createSwitchNavigator({
        Login,
        Main,
    })
);
