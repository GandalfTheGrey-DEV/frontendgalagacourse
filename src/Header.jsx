import React from "react";
import styled from "styled-components";

const Header = ({ progress }) => {
    return (
        <HeaderContainer>
            <Title>Galaga Course</Title>
            <ProgressContainer>
                <ProgressBar progress={progress} />
            </ProgressContainer>
        </HeaderContainer>
    );
};

export default Header;

// Styled components
const HeaderContainer = styled.div`
    background-color: #2c2c3e;
    color: #fff;
    padding: 20px;
    text-align: center;
`;

const Title = styled.h1`
    margin: 0;
    font-size: 24px;
    color: #fff;
`;

const ProgressContainer = styled.div`
    background-color: #404050;
    border-radius: 10px;
    width: 100%;
    height: 20px;
    margin-top: 10px;
    position: relative;
`;

const ProgressBar = styled.div`
    background-color: #61dafb;
    height: 100%;
    border-radius: 10px;
    width: ${({ progress }) => progress}%;
    transition: width 0.3s ease;
`;