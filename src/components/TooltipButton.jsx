import React from "react";
import "./TooltipButton.css";

const TooltipButton = ({ tooltipText, children, ...buttonProps }) => {
    return (
        <div className="tooltip-wrapper">
            <button className="tooltip-button" {...buttonProps}>
                {children}
            </button>
            <span className="tooltip-text">{tooltipText}</span>
        </div>
    );
};

export default TooltipButton;
