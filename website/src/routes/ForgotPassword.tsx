import React, { FormEvent, useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import { Redirect } from "react-router-dom";
import {gql, useMutation} from '@apollo/client';
import {ForgotPasswordMutation} from '../generated/graphql';
import { Error } from '../components/Error';
import {Success} from '../components/Success';
import { Button, Input } from '@chakra-ui/react';

const ForgotPasswordGraphQL = gql`
    mutation ForgotPassword($email: String!) {
        forgotPassword(email: $email)
    }
`;

function ForgotPassword() {
    const [forgot, { data, loading, error }] = useMutation<ForgotPasswordMutation>(ForgotPasswordGraphQL);
    const user = useContext(UserContext);
    const [email, setEmail] = useState("");

    async function handleForgotPassword(e: FormEvent): Promise<void> {
        e.preventDefault();
        try {
            await forgot({ variables: {
                email: email
            }});
        }
        catch(error) {
            console.error('Error:', error);
        }
    }

    if(user) {
        return <Redirect to={{ pathname: "/"}} />;
    }
    
    return (
        <div>
            {error && <Error error={error}/>}
            {loading && <p>Loading</p>}
            {data?.forgotPassword && <Success message="Successfully sent password reset email"/>}
            <form onSubmit={handleForgotPassword}>
                <Input
                    id="email"
                    type="email"
                    label="Email"
                    placeholder="example@ridebeep.app"
                    onChange={(value: any) => setEmail(value.target.value)}
                    disabled={data?.forgotPassword}
                />
                <Button raised>
                    Send Reset Password Email
                </Button>
            </form>
        </div>
    );
}

export default ForgotPassword;
