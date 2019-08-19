import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage'; // Serve para salvar informações do usuário, como username etc.
import {
    View, // Tag "div" do React Native.
    Text, // Tag para textos.
    StyleSheet, // Estilização do componente.
    Image, // Tag para mostrar imagens.
    TextInput, // Tag de input.
    TouchableOpacity, // Botão sem estilização do React Native.
    KeyboardAvoidingView, // Usando esse componente, o teclado do celular não ficará em cima o input ou do button.
    Platform, // Com isso a gente pode verificar qual sistema o usuário está acessando.
} from 'react-native';

import api from '../services/api';

import logo from '../assets/images/logo.png';

export default function Login({ navigation }) { // Esse navegation é chamado como uma herança do routes.
    const [user, setUser] = useState('');

    // Essa função vai ver se tem alguma informação salva do usuário, se tiver, já vai entrar com a conta logada.
    useEffect(() => {
        AsyncStorage.getItem('user').then(user => { // Vendo se tem alguma informação salva.
            if (user) {
                navigation.navigate('Main', { user }); // Mandando pra página Main com o Id do usuário.
            }
        })
    }, []); // Com esse segundo parâmetro (vetor) vazio, a função só será executada uma vez.

    async function handleLogin() {
        const response = await api.post('/devs', {
            username: user
        });

        const { _id } = response.data;

        await AsyncStorage.setItem('user', _id); // Salvando id do usuário.

        navigation.navigate('Main', { user: _id }); // Mandando o usuário para a tela Main passando o _id do usuário logado.
    }

    return (
        // Cada conponente tem que ter seu prório estilo, não tem como fazer cascata de estilos.
        <KeyboardAvoidingView
            behavior='padding' // Quando o teclado o celular aparecer, esse componente vai dar um "padding-bottom" altomático.
            enabled={Platform.OS === 'ios'} // Só vai ativar quando o sistema dor igual a 'ios'. | Platform.OS === 'android'.
            style={styles.mainContainer}
        >
            <Image source={logo} />

            <TextInput
                value={user}
                onChangeText={setUser}
                autoCapitalize='none' // Quando o usuário escrever nesse input, a primeira letra *não* vai ficar maiúscula.
                autoCorrect={false} // O corretor altomático não vai ficar tentando corrigir o que for escrito.
                placeholder='Digite deu usuário no GitHub'
                placeholderTextColor="#999" // Cor do placeholder | Não é consigurável pelo style.
                style={styles.input}
            />

            {/* Esse componente, quando toca nele, ele fica com uma opacidade. */}
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                {/* *Todo* texto tem que estar dentro do componente <Text></Text> */}
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },

    input: {
        height: 46,
        alignSelf: 'stretch', // Com essa propriedade, o componente vai ocupar todo espaço possível.
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15,
    },

    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#DF4723',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',

    }
});
