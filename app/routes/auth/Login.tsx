import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Layout, Text, Button, Input } from '@ui-kitten/components';
import * as SplashScreen from 'expo-splash-screen';
import { UserContext } from '../../utils/UserContext';
import { isMobile } from '../../utils/config';
import { LoginIcon, SignUpIcon, QuestionIcon, LoadingIndicator } from '../../utils/Icons';
import { Icon } from '@ui-kitten/components';
import { gql, useMutation } from '@apollo/client';
import { LoginMutation } from '../../generated/graphql';

interface Props {
    navigation: any;
}

const Login = gql`
    mutation Login($username: String!, $password: String!) {
        login(input: {username: $username, password: $password}) {
            user {
                id
                first
                last
                username
                email
                phone
                venmo
                isBeeping
                isEmailVerified
                isStudent
                groupRate
                singlesRate
                capacity
                masksRequired
                queueSize
                role
                photoUrl
                name
            }
            tokens {
                id
                tokenid
            }
        }
    }
`;

function LoginScreen(props: Props) {
    const userContext: any = React.useContext(UserContext);
    const [login, { loading: loading, error: error }] = useMutation<LoginMutation>(Login);
    const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();

    const renderIcon = (props: unknown) => (
        <TouchableWithoutFeedback onPress={() => setSecureTextEntry(!secureTextEntry)}>
            <Icon {...props} name={secureTextEntry ? 'eye-off' :'eye'}/>
        </TouchableWithoutFeedback>
    );
    
    useEffect(() => {
        try {
            SplashScreen.hideAsync();
        }
        catch(error) {
            console.log(error);
        }
    }, []);

    async function doLogin() {

        const r = await login({ variables: {
            username: username,
            password: password
        }});

        if (r) {

            AsyncStorage.setItem("auth", JSON.stringify(r.data?.login));

            userContext.setUser(r.data?.login);
            userContext.subscribeToUser(r.data?.login.user.id);
                
            props.navigation.reset({
                index: 0,
                routes: [
                    { name: 'Main' },
                ],
            });
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} disabled={!isMobile} >
            <Layout style={styles.container}>
                <Text style={styles.title} category='h6'>Login</Text>
                <Layout style={styles.form}>
                    <Input
                        textContentType="username"
                        placeholder="Username"
                        returnKeyType="next"
                        onChangeText={(text) => setUsername(text)}
                        blurOnSubmit={true}
                    />
                    <Input
                        textContentType="password"
                        placeholder="Password"
                        returnKeyType="go"
                        accessoryRight={renderIcon}
                        secureTextEntry={secureTextEntry}
                        onChangeText={(text) => setPassword(text)}
                        blurOnSubmit={true}
                    />
                    {!loading ?
                        <Button
                            accessoryRight={LoginIcon}
                            onPress={() => doLogin()}
                        >
                            Login
                        </Button>
                        :
                        <Button appearance='outline' accessoryRight={LoadingIndicator}>
                            Loading
                        </Button>
                    }
                </Layout>
                {loading && <Text>Loading</Text>}
                {error && <Text>{error.message}</Text>}
                <Text style={{marginTop: 30, marginBottom: 10 }}> Don't have an account? </Text>
                <Button
                    size="small"
                    onPress={() => props.navigation.navigate('Register')}
                    appearance="outline"
                    accessoryRight={SignUpIcon}
                >
                    Sign Up
                </Button>
                <Text style={{marginTop: 20, marginBottom: 10}}> Forgot your password? </Text>
                <Button
                    size="small"
                    onPress={() => props.navigation.navigate('ForgotPassword')}
                    appearance="outline"
                    accessoryRight={QuestionIcon}
                >
                    Forgot Password
                </Button>
            </Layout>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 100
    },
    form: {
        justifyContent: "center",
        width: "83%",
        marginTop: 20,
    },
    title: {
        fontSize: 40,
        padding: 15,
    },
    input: {
        width: "90%"
    }
});

export default LoginScreen;
