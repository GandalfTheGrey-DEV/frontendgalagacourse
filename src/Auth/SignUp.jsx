import React, { useState } from 'react';
import styled from 'styled-components';
import { signUp, signInWithGoogle } from '../firebase';
import { FcGoogle } from 'react-icons/fc';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = (e) => {
        e.preventDefault();
        signUp(email, password);
    };

    const handleGoogleSignUp = () => {
        signInWithGoogle();
    };

    return (
        <Container>
            <FormWrapper>
                <h2>Create Your Account</h2>
                <form onSubmit={handleSignUp}>
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit">Sign Up</Button>
                </form>
                <Divider>or</Divider>
                <GoogleButton onClick={handleGoogleSignUp}>
                    <FcGoogle size={24} /> Sign Up with Google
                </GoogleButton>
            </FormWrapper>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #1a1a2e; 
    color: #ffffff; 
`;

const FormWrapper = styled.div`
    background: #22234a; 
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4); 
    text-align: center;
    width: 90%; 
    max-width: 400px;
`;

const Input = styled.input`
    width: calc(100% - 2px);
    padding: 1rem; 
    margin: 0.8rem 0;
    background-color: #2b2d4a; 
    color: #ffffff; 
    border: 1px solid #444d6e; 
    border-radius: 8px; 
    font-size: 1rem;
    box-sizing: border-box;

    &::placeholder {
        color: #a1a2c3; 
    }

    &:focus {
        outline: none;
        border-color: #865dff;
        box-shadow: 0px 0px 5px rgba(134, 93, 255, 0.6); 
    }
`;

const Button = styled.button`
    width: 100%;
    padding: 1rem; 
    margin-top: 1rem;
    background-color: #613dc1; 
    color: #fff;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background-color: #7f5cff;
        box-shadow: 0px 0px 8px rgba(127, 92, 255, 0.8);
    }

    &:focus {
        outline: none;
        box-shadow: 0px 0px 8px rgba(134, 93, 255, 0.8);
    }
`;

const Divider = styled.div`
    margin: 1.5rem 0;
    font-size: 0.9rem;
    color: #a1a2c3;
    position: relative;

    &:before,
    &:after {
        content: '';
        position: absolute;
        height: 1px;
        width: 45%;
        background-color: #444d6e; 
        opacity: 0.6;
        top: 50%;
    }

    &:before {
        left: 0;
    }

    &:after {
        right: 0;
    }
`;

const GoogleButton = styled.button`
    width: 100%; /* Matching width for better alignment */
    padding: 1rem; /* Even padding for better size */
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #38405f; /* Neutral Dark Blue */
    color: #fff;
    font-size: 1rem;
    border: 1px solid #565f89; /* Subtle Border for Contrast */
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background-color: #4a5672;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
    }

    svg {
        margin-right: 8px;
    }
`;

export default SignUp;