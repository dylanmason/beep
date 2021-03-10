import React, { FormEvent, useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import { Redirect, Link } from "react-router-dom";
import { TextInput } from '../components/Input';
import { Caption } from '../components/Typography';
import {gql, useMutation} from '@apollo/client';
import {LoginMutation} from '../generated/graphql';
import { Error } from '../components/Error';

const LoginGraphQL = gql`
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

function Login() {
    const { user, setUser } = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [login, { loading, error }] = useMutation<LoginMutation>(LoginGraphQL);

    async function handleLogin(e: FormEvent): Promise<void> {

        e.preventDefault();

        try {
            const result = await login({ variables: {
                username: username,
                password: password
            }});

            if (result) {
                setUser(result.data.login);
                localStorage.setItem('user', JSON.stringify(result.data.login));
            }
        }
        catch (error) {

        }
    }

    if (user) {
        return <Redirect to={{ pathname: "/" }} />;
    }

    return (
        <div className="px-4 mx-auto lg:container">
            {error && <Error error={error}/>}
            <form onSubmit={handleLogin}>
                <TextInput
                    className="mb-4"
                    id="username"
                    label="Username"
                    onChange={(value: any) => setUsername(value.target.value)}
                />
                <TextInput
                    className="mb-4"
                    id="password"
                    type="password"
                    label="Password"
                    onChange={(value: any) => setPassword(value.target.value)}
                />
                <button type="submit" className="px-4 py-2 mb-4 font-bold text-white bg-yellow-400 rounded shadow hover:bg-yellow-400 focus:shadow-outline focus:outline-none">
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <Link to={"/password/forgot"} className="text-gray-500">Forgot Password</Link>
            <Caption className="mt-4">Currently, the option to sign up is only avalible in our app (coming soon)</Caption>
        </div>
    );
}

export default Login;
