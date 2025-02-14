import React, { useState } from "react";
import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { rust } from "@codemirror/lang-rust";
import { EditorView } from "@codemirror/view";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ReplayIcon from "@mui/icons-material/Replay";

const cobaltTheme = EditorView.theme(
    {
        "&": {
            color: "#fff",
            backgroundColor: "#002240", // The cobalt background
        },
        ".cm-content": {
            caretColor: "#white",
        },
        ".cm-cursor, .cm-dropCursor": { borderLeftColor: "white" },
        "&.cm-focused .cm-cursor": { borderLeftColor: "#ffcc00" },
        "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection": {
            backgroundColor: "#003d5b",
        },
        ".cm-gutters": {
            backgroundColor: "#001b33",
            color: "#afafaf",
            border: "none",
        },
    },
    { dark: true }
);

const CodeEditor = ({ onRun }) => {
    const [code, setCode] = useState("// Write your Rust code here");
    const [tooltip, setTooltip] = useState({
        visible: false,
        content: "",
        pos: { x: 0, y: 0 },
    });
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);

    const handleMouseEnter = (event, tooltipContent) => {
        const { top, left, width } = event.target.getBoundingClientRect();
        setTooltip({
            visible: true,
            content: tooltipContent,
            pos: {
                x: left + width / 2,
                y: top,
            },
        });
    };

    const handleMouseLeave = () => {
        setTooltip({ visible: false, content: "", pos: { x: 0, y: 0 } });
    };

    const handleRunClick = () => {
        if (isPlaying) {
            console.log("[DEBUG] Run button reset to 'Run'");
            clearTimeout(timeoutId);
            setIsPlaying(false);
            return;
        }

        console.log("[DEBUG] Run button clicked! Code is running...");
        console.log("[DEBUG] Code being sent to App (via onRun):\n", code);
        if (onRun) onRun(code);
        setIsPlaying(true);

        const id = setTimeout(() => {
            console.log("[DEBUG] Run button reset to 'Run' after timeout.");
            setIsPlaying(false);
        }, 3000);

        setTimeoutId(id);
    };

    const handleCopyClick = () => {
        navigator.clipboard.writeText(code);
        console.log("[DEBUG] Code copied to clipboard!");
    };

    const handleResetClick = () => {
        console.log("[DEBUG] Code reset to default.");
        setCode("// Write your Rust code here");
    };

    return (
        <EditorSection>
            <EditorSectionContent>
                <ResizableEditor>
                    <CodeMirror
                        value={code}
                        extensions={[rust()]}
                        theme={cobaltTheme}
                        onChange={(value) => {
                            console.log("[DEBUG] Code updated in editor:\n", value);
                            setCode(value);
                        }}
                        height="100%"
                        style={{ flex: 1 }}
                    />
                </ResizableEditor>
                <ButtonContainer>
                    <RunButton
                        playing={isPlaying}
                        onMouseEnter={(e) => handleMouseEnter(e, "Runs the code in the editor")}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleRunClick}
                    >
                        {isPlaying ? <StopIcon /> : <PlayArrowIcon />}
                    </RunButton>
                    <IconButton
                        onMouseEnter={(e) => handleMouseEnter(e, "Copies the code to clipboard")}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleCopyClick}
                    >
                        <ContentCopyIcon /> Copy
                    </IconButton>
                    <IconButton
                        onMouseEnter={(e) => handleMouseEnter(e, "Resets the code to default")}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleResetClick}
                    >
                        <ReplayIcon /> Reset
                    </IconButton>
                </ButtonContainer>
                {tooltip.visible && (
                    <Tooltip style={{ top: tooltip.pos.y - 10, left: tooltip.pos.x }}>
                        {tooltip.content}
                    </Tooltip>
                )}
            </EditorSectionContent>
        </EditorSection>
    );
};

export default CodeEditor;

const EditorSection = styled.div`
    flex: 1;
    border: 1px solid #333;
    background-color: #001b33; // Cobalt dark blue
    color: white;
    display: flex;
    flex-direction: column;
`;

const EditorSectionContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const ResizableEditor = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
    max-height: 650px;
    border: 1px solid #444;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    gap: 20px;
    margin-top: 5px;
    padding: 5px 10px;
`;

const RunButton = styled.button`
    padding: 10px 15px;
    background-color: ${(props) => (props.playing ? "#ff3333" : "#00ff00")};
    border: none;
    color: #000;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    border-radius: 8px;

    &:hover {
        background-color: ${(props) => (props.playing ? "#ff6666" : "#32cd32")};
    }

    display: flex;
    align-items: center;
    justify-content: center;
`;

const IconButton = styled.button`
    padding: 10px;
    border: none;
    background: #333;
    color: #ffffff;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 8px;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    display: flex;
    align-items: center;
    justify-content: center;
`;

const Tooltip = styled.div`
    position: absolute;
    padding: 14px 10px;
    width: 140px;
    background: #004080; // Dark blue-like cobalt tooltip background
    color: white;
    font-size: 0.85rem;
    font-weight: bold;
    text-align: center;
    border-radius: 6px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    transform: translate(-50%, -100%);
    pointer-events: none;
    z-index: 1000;

    &::after {
        content: "";
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 10px solid #004080;
    }
`;
