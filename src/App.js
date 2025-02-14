import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Header from "./Header";
import Instruction from "./components/Instruction";
import CodeEditor from "./components/CodeEditor";
import Output from "./components/Output";
import Footer from "./Footer";
import '@fortawesome/fontawesome-free/css/all.min.css';

import { auth } from './firebase';
import SignIn from "./Auth/SignIn";
import SignUp from "./Auth/SignUp";
import { onAuthStateChanged } from "firebase/auth";

const App = () => {
    const [progress, setProgress] = useState(0);
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("Waiting for code execution...");
    const [user, setUser] = useState(null);
    const wsRef = useRef(null); // WebSocket reference

    // Effect for synchronizing with authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                // Save user info to localStorage on successful login
                localStorage.setItem("user", JSON.stringify(currentUser));
                setUser(currentUser);
            } else {
                // Remove user info from localStorage on logout
                localStorage.removeItem("user");
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    // On component load, check for persisted user in localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Handle WebSocket connection
    useEffect(() => {
        if (!user) return;

        // Connect to WebSocket server
        wsRef.current = new WebSocket("ws://localhost:3030/compile");

        // On open, send a welcome message or setup
        wsRef.current.onopen = () => {
            console.log("WebSocket connected.");
        };

        // On receiving a message, update the output
        wsRef.current.onmessage = (event) => {
            const message = event.data;
            console.log("[DEBUG] Received from WebSocket:", message);
            setOutput((prevOutput) => prevOutput + "\n" + message);
        };

        // On WebSocket error, log the error
        wsRef.current.onerror = (error) => {
            console.error("[DEBUG] WebSocket error:", error);
        };

        // On WebSocket close, handle disconnection
        wsRef.current.onclose = () => {
            console.log("WebSocket disconnected.");
        };

        // Clean up on component unmount or user logout
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [user]);

    useEffect(() => {
        const executeRustCode = async () => {
            try {
                if (!code) {
                    console.log("[DEBUG] No code provided.");
                    setOutput("No code provided.");
                    return;
                }

                console.log("[DEBUG] Sending Rust code execution request...");

                // Send code via WebSocket when it's available
                if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                    wsRef.current.send(code);
                    setOutput("Executing code...");
                } else {
                    console.error("[DEBUG] WebSocket is not connected.");
                }
            } catch (error) {
                console.error("[DEBUG] Error occurred during execution:", error.message);
                setOutput(`Error: ${error.message}`);
            }
        };

        if (code) {
            executeRustCode();
        }
    }, [code]);

    return (
        <MainContainer>
            {user ? (
                <>
                    <Header progress={progress} />
                    <ContentContainer>
                        <StyledInstruction />
                        <CodeEditor
                            onRun={(newCode) => {
                                console.log("[DEBUG] Run triggered! Code received:\n", newCode);
                                setCode(newCode);
                            }}
                        />
                        <StyledOutput output={output} />
                    </ContentContainer>
                    <Footer />
                </>
            ) : (
                <SignUp />
            )}
        </MainContainer>
    );
};

export default App;

// Styled Components
const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #1e1e2f;
`;

const ContentContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: row;
`;

const StyledInstruction = styled(Instruction)`
    flex: 1;
    background-color: #2c2c3e;
`;

const StyledOutput = styled(Output)`
    flex: 1;
    background-color: #3a3a5f;
`;
