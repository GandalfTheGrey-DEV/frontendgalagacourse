import React, { useState } from "react";
import styled from "styled-components";

const Output = ({ output }) => {
    const [width, setWidth] = useState(300);

    const parseOutput = (outputText) => {
        const lines = outputText.split("\n");

        return lines.map((line, index) => {
            if (line.startsWith("error:") || line.includes("error[")) {
                return <ErrorLine key={index}>{line}</ErrorLine>;
            } else if (line.startsWith("-->")) {
                return <FileLine key={index}>{line}</FileLine>;
            } else if (line.trim().startsWith("|")) {
                return <CodeLine key={index}>{line}</CodeLine>;
            } else if (line.trim().startsWith("note:") || line.trim().startsWith("help:")) {
                return <HelpLine key={index}>{line}</HelpLine>;
            } else {
                return <NormalLine key={index}>{line}</NormalLine>;
            }
        });
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = width;

        const onMouseMove = (moveEvent) => {
            const newWidth = startWidth - (moveEvent.clientX - startX);
            setWidth(newWidth > 100 ? newWidth : 100);
        };

        const onMouseUp = () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };

    return (
        <ResizableContainer width={width}>
            <ResizeHandle onMouseDown={handleMouseDown} />
            <Section>
                <OutputArea>{parseOutput(output)}</OutputArea>
            </Section>
        </ResizableContainer>
    );
};

export default Output;

// Styled components
const ResizableContainer = styled.div`
    display: flex;
    width: ${(props) => props.width}px;
    min-width: 100px;
    border: 1px solid #1e2a38;
    position: relative;
`;

const Section = styled.div`
    flex: 1;
    background-color: black;
    color: white;
    display: flex;
    flex-direction: column;
    padding: 15px;
    height: 100%;
    overflow-y: auto; 
    overflow-x: hidden; 
`;

const OutputArea = styled.div`
    flex: 1;
    width: 100%;
    color: white;
    font-family: "Courier New", Courier, monospace;
    font-size: 1rem;
    white-space: pre-wrap;
    padding-right: 15px; 
`;

const ResizeHandle = styled.div`
    width: 10px;
    cursor: ew-resize;
    background-color: #2e4d66;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 2;

    &:hover {
        background-color: #88c0d0;
    }
`;

const NormalLine = styled.div`
    color: white;
`;

const ErrorLine = styled.div`
    color: red;
    font-weight: bold;
`;

const FileLine = styled.div`
    color: yellow;
    font-style: italic;
`;

const CodeLine = styled.div`
    color: lightblue;
`;

const HelpLine = styled.div`
    color: green;
    font-style: italic;
`;
