import React from "react";
import styled, { css } from "styled-components";

const Header = ({ profilePicture, connected = true }) => {
    const defaultProfilePicture =
        profilePicture || "https://lh3.googleusercontent.com/a/default-user";

    return (
        <HeaderContainer>
            <Logo>🚀 Galaga Course</Logo>
            <ProfilePictureContainer>
                <GlowDot connected={connected} />
                <ProfilePicture src={defaultProfilePicture} alt="Profile" />
            </ProfilePictureContainer>
        </HeaderContainer>
    );
};

export default Header;

const HeaderContainer = styled.div`
    background: #000;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 25px;
    border-bottom: 1px solid #ffffff;
    position: relative;
`;

const Logo = styled.h1`
    font-size: 22px;
    font-weight: bold;
    letter-spacing: 1.5px;
    color: #fff;
    cursor: pointer;

    &:hover {
        color: #ffff00;
        transform: scale(1.1);
        transition: all 0.3s ease-in-out;
    }
`;

const ProfilePictureContainer = styled.div`
    display: flex;
    align-items: center;
    position: relative;
`;

const ProfilePicture = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: ${({ connected }) =>
            connected ? "2px solid #00ff00" : "2px solid #888"};
`;

const GlowDot = styled.div`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    ${({ connected }) =>
            connected
                    ? css`
                        background-color: #00d8ff; /* Neon blue */
                        box-shadow: 0 0 10px 3px rgba(0, 216, 255, 0.8); /* Glow effect */
                    `
                    : css`
                        background-color: #888; /* Grey for disconnected */
                        box-shadow: none;
                    `};

    position: absolute;
    left: -50px; /* Move 50px left */
    top: calc(50% + 10px); /* Move it slightly down */
    transform: translateY(-50%);
    cursor: pointer;

    /* Tooltip styling */
    &:hover::after {
        content: ${({ connected }) =>
                connected ? '"Connected"' : '"Disconnected"'};

        /* Tooltip positioning and styling changes */
        position: absolute;
        right: 20px; /* Position tooltip to the left of the dot */
        top: 50%; /* Center vertically */
        transform: translateY(-50%);
        background-color: #003366; 
        color: #fff; 
        font-size: 12px;
        padding: 5px 10px;
        border-radius: 5px;
        white-space: nowrap;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
        z-index: 10;

        opacity: 0;
        animation: fadeIn 0.3s ease-in-out forwards;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-50%) translateX(5px); 
        }
        to {
            opacity: 1;
            transform: translateY(-50%) translateX(0); 
        }
    }
`;