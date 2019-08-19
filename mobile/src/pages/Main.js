import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';
import {
    SafeAreaView, // Vai aplicar os componentes apenas nas áreas que são safe. (Mais valido para IOS)
    Text, Image, StyleSheet, View, TouchableOpacity
} from 'react-native';

import api from '../services/api';

import logo from '../assets/images/logo.png';
import like from '../assets/images/like.png';
import dislike from '../assets/images/dislike.png';
import itsamatch from '../assets/images/itsamatch.png';

export default function Main({ navigation }) {
    const id = navigation.getParam('user');
    const [users, setUsers] = useState([]); // Essas variáveis vão ser iniciadas com um vetor vazio pq são vários devs que serão pegos na busca a API.
    const [matchDev, setMatchDev] = useState(false);

    // Essa função vai ser chamada sempre que o componente for carregado na tela.
    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: {
                    user: id,
                }
            })

            setUsers(response.data);
        }

        loadUsers();
    }, [id]);

    // Chamada a API, para pegar os desenvolvedores de deram e receberam like, formando um match, através de Websocket.
    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: {
                user: id
            }
        });

        socket.on('match', dev => {
            setMatchDev(dev);
            console.log(dev);
        });

    }, [id]);

    async function handleLike() {
        const [user, ...rest] = users; // Usando desestruração: A primeira variável "user" vai receber a primeira posição do vetor usuários, e o resto vai ser armazenado no vetor "rest". 

        await api.post(`/devs/${user._id}/likes`, null, {
            headers: { user: id },
        })

        setUsers(rest);
    }

    async function handleDislike() {
        const [user, ...rest] = users;

        await api.post(`/devs/${user._id}/dislikes`, null, {
            headers: { user: id },
        })

        setUsers(rest);
    }

    async function handleLogout() {
        await AsyncStorage.clear(); // Limpando usuários salvos.

        navigation.navigate('Login'); // Levando usuário até a página de login.
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <TouchableOpacity onPress={handleLogout}>
                <Image style={styles.logo} source={logo} />
            </TouchableOpacity>

            <View style={styles.cardsContainer}>
                {users.length > 0
                    ? (users.map((user, index) => (
                        <View key={user._id} style={[styles.card, { zIndex: users.length - index }]}>
                            <Image style={styles.avatar} source={{ uri: user.avatar }} />
                            <View style={styles.footer}>
                                <Text style={styles.name}>{user.name}</Text>
                                <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                            </View>
                        </View>
                    ))) : (
                        <Text style={styles.empty}>Abacou :(</Text>
                    )
                }
            </View>

            {/* Se não tiver usuários, os botões não aparecem. */}
            {users.length > 0 && (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleLike}>
                        <Image source={like} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleDislike}>
                        <Image source={dislike} />
                    </TouchableOpacity>
                </View>
            )}

            {matchDev && (
                <View style={styles.matchContainer}>
                    <Image source={itsamatch} style={styles.matchImage} />
                    <Image source={{ uri: matchDev.avatar }} style={styles.matchUserAvatar} />

                    {/* <View style={styles.matchUserInfo}> */}
                    <Text style={styles.matchUserName}> {matchDev.name} </Text>
                    <Text style={styles.matchUserBio}> {matchDev.bio} </Text>
                    {/* </View> */}

                    <TouchableOpacity style={styles.matchButton} onPress={() => setMatchDev(false)}>
                        <Text style={styles.closeMatch}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            )}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    logo: {
        marginTop: 20
    },

    mainContainer: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'space-between' // Vai adicionar um estaço entre o que tiver dentro desse componente.
    },

    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,
    },

    card: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        margin: 25,
        overflow: 'hidden', // O que ficar além do tamanho do container, ficará escondido.
        position: 'absolute', // Essa propriedade faz com que os usuários fiquem um em cima do outro.
        // Para que o container ocupe todo tamanho possível: (500)
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },

    avatar: {
        flex: 1,
        height: 300,
        backgroundColor: '#F5F5F5'
    },

    footer: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },

    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 5
    },

    bio: {
        fontSize: 14,
        color: '#999',
        lineHeight: 20
    },

    buttonsContainer: {
        flexDirection: 'row', // Ficar em diração de linha (Um ao lado do outro)
        marginBottom: 30,
        zIndex: 1 // Para que os botões fiquem debaixo do container do match.
    },

    button: {
        width: 50,
        height: 50,
        borderRadius: 25, // Para que os botões fiquem totalmente redondos, tem que colocar o valor a metade da altura e da largura.
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        // Botar sombra:
        elevation: 2, // Android
        //IOS:
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: { // Caracteristicas de tamanho da sombra.
            width: 0,
            height: 2
        },
    },

    empty: {
        alignSelf: 'center',
        color: '#999',
        fontSize: 24,
        fontWeight: 'bold',
    },

    // Match style:
    matchContainer: {
        flex: 1,
        ...StyleSheet.absoluteFillObject, // Usand isso, o "matchContainer" vai ter todas as propriedades de um container aboluto: "position: absolute, top: 0, rigth: 0, bottom: 0, left: 0"
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2 // Para que esse container fique em cima de todos os outros.
    },

    matchImage: {
        height: 60,
        resizeMode: 'contain' // Fazendo a imagem se adequar ao tamanho da tela do celular, com uma altura de 60.
    },

    matchUserAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#FFF',
        marginVertical: 30
    },

    matchUserName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFF'
    },

    matchUserBio: {
        marginTop: 10,
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 30
    },

    matchButton: {
        marginTop: 25,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'rgba(255, 255, 255, 0.8)'
    },

    closeMatch: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: 'bold'
    }
});
