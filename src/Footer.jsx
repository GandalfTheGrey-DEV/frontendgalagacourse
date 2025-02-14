import React, { useState, useEffect } from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
    height: 60px;
    width: 100%;
    border-top: 1px solid white;
    background: linear-gradient(90deg, #1e1e30, #353547);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    box-sizing: border-box;
    position: fixed; 
    bottom: 0;    
    left: 0;      
    z-index: 1000;  
`;

const TaskStatus = styled.div`
    font-size: 16px;
    font-weight: bold;
    color: #f1f1f1;
    text-align: center;
`;

const ButtonContainer = styled.div`
    position: absolute;
    right: 20px;
    display: flex;
`;

const NextButton = styled.button`
    padding: 10px 15px;
    background-color: ${(props) => (props.disabled ? "#3a3a3a" : "#00ff00")};
    border: 2px solid transparent;
    color: ${(props) => (props.disabled ? "#a6a6a6" : "#000")};
    font-size: 1rem;
    font-weight: bold;
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    border-radius: 8px;
    margin-right: 10px;

    &:hover {
        background-color: ${(props) =>
                props.disabled ? "#3a3a3a" : "#32cd32"};
    }
`;

const BackButton = styled.button`
    padding: 10px 15px;
    background-color: transparent;
    border: 2px solid #00ff00;
    color: #00ff00;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    border-radius: 8px;
    margin-right: 18px;

    &:hover {
        background-color: rgba(0, 255, 0, 0.1);
    }
`;

const Footer = () => {
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState(0);
    const [totalTasks, setTotalTasks] = useState(0);
    const [isNextEnabled, setIsNextEnabled] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8080/tasks")
            .then((response) => response.json())
            .then((data) => {
                setTasks(data);
                setTotalTasks(data.length);
            })
            .catch((error) => console.error("Error fetching tasks:", error));
    }, []);

    useEffect(() => {
        const completed = tasks.filter((task) => task.isCompleted).length;
        setCompletedTasks(completed);
        setIsNextEnabled(completed === totalTasks);
    }, [tasks, totalTasks]);

    return (
        <FooterContainer>
            <TaskStatus>{`${completedTasks}/${totalTasks} tasks`}</TaskStatus>
            <ButtonContainer>
                <BackButton>Back</BackButton>
                <NextButton disabled={!isNextEnabled}>Next</NextButton>
            </ButtonContainer>
        </FooterContainer>
    );
};

export default Footer;