import React from 'react';
import styled from 'styled-components';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export const AskAIInput = ({ value, onChange, onKeyDown, onSubmit, disabled, placeholder = "Ask AI..." }: Props) => {
  return (
    <StyledWrapper>
      <div className="ask-ai-wrapper">
        <div className="ai-input-container">
          <span className="underline-effect" />
          <span className="ripple-circle" />
          <span className="bg-fade" />
          <span className="floating-dots">
            <span />
            <span />
            <span />
            <span />
          </span>
          <input 
            placeholder={placeholder} 
            className="ai-input" 
            type="text" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={disabled}
          />
          <button 
            type="button"
            className="icon-container" 
            onClick={onSubmit} 
            disabled={disabled}
            style={{ background: 'transparent', border: 'none' }}
          >
            <svg viewBox="0 0 24 24" height={24} width={24} xmlns="http://www.w3.org/2000/svg" className="ai-icon">
              <path color="currentColor" d="M7.94 3.078h8.11c1.37 0 2.47 0 3.34.12c.9.12 1.66.38 2.26.98s.86 1.36.98 2.26c.12.87.12 1.97.12 3.34v2.05c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-2c0-1.43 0-2.44-.1-3.19c-.1-.73-.28-1.12-.56-1.4s-.66-.46-1.4-.56c-.76-.1-1.76-.1-3.19-.1H8c-1.43 0-2.44 0-3.19.1c-.73.1-1.12.28-1.4.56s-.46.67-.56 1.4c-.1.76-.1 1.76-.1 3.19s0 2.44.1 3.19c.1.73.28 1.12.56 1.4s.66.46 1.4.56c.76.1 1.76.1 3.19.1h3c.41 0 .75.34.75.75s-.34.75-.75.75H7.95c-1.37 0-2.47 0-3.34-.12c-.9-.12-1.66-.38-2.26-.98s-.86-1.36-.98-2.26c-.12-.87-.12-1.97-.12-3.34v-.11c0-1.37 0-2.47.12-3.34c.12-.9.38-1.66.98-2.26s1.36-.86 2.26-.98c.87-.12 1.97-.12 3.34-.12zm8.76 10.88l-.04.09a4.34 4.34 0 0 1-2.45 2.45l-.09.04c-1.17.46-1.17 2.12 0 2.58l.09.04c1.12.44 2.01 1.33 2.45 2.45l.04.09c.46 1.17 2.12 1.17 2.58 0l.04-.09a4.34 4.34 0 0 1 2.45-2.45l.09-.04c1.17-.46 1.17-2.12 0-2.58l-.09-.04a4.34 4.34 0 0 1-2.45-2.45l-.04-.09c-.46-1.17-2.12-1.17-2.58 0m1.29.81a5.83 5.83 0 0 0 3.06 3.06a5.83 5.83 0 0 0-3.06 3.06a5.83 5.83 0 0 0-3.06-3.06a5.83 5.83 0 0 0 3.06-3.06M6.74 8.828c0-.41-.34-.75-.75-.75s-.75.34-.75.75v2c0 .41.34.75.75.75s.75-.34.75-.75zm8.25-1.75c.41 0 .75.34.75.75v4c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-4c0-.41.34-.75.75-.75m-2.25 2.25c0-.41-.34-.75-.75-.75s-.75.34-.75.75v1c0 .41.34.75.75.75s.75-.34.75-.75zm5.25-.75c.41 0 .75.34.75.75v1c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-1c0-.41.34-.75.75-.75m-8.25-.75c0-.41-.34-.75-.75-.75s-.75.34-.75.75v4c0 .41.34.75.75.75s.75-.34.75-.75z" fillRule="evenodd" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: 100%;
  
  .ask-ai-wrapper {
    display: block;
    width: 100%;
    position: relative;
  }

  .ask-ai-wrapper .ai-input-container {
    position: relative;
    display: flex;
    align-items: center;
    background: #ffffff;
    border: 1px solid #e3e8ee;
    border-radius: 12px;
    padding: 8px 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    transition: all 0.5s cubic-bezier(0.65, 0, 0.35, 1);
    overflow: hidden;
  }

  /* Input field */
  .ask-ai-wrapper .ai-input {
    flex-grow: 1;
    background: transparent;
    border: none;
    outline: none;
    font-family: inherit;
    font-size: 0.875rem;
    color: #333;
    padding: 4px 8px;
    width: 100%;
    position: relative; /* Ensure it stays above other elements */
    z-index: 2; /* Bring input to the front */
    transition: color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ask-ai-wrapper .ai-input::placeholder {
    color: #888;
    font-style: italic;
  }

  /* SVG container */
  .ask-ai-wrapper .icon-container {
    position: relative;
    width: 20px;
    height: 20px;
    transition: all 0.5s cubic-bezier(0.7, -0.5, 0.3, 1.5);
    cursor: pointer;
    z-index: 2; /* Ensure SVG is clickable */
  }

  /* SVG animation */
  .ask-ai-wrapper .ai-icon path {
    fill: #6b7280;
    transform-origin: center;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Subtle underline effect */
  .ask-ai-wrapper .underline-effect {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: #20beff;
    transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
    z-index: 1;
  }

  /* Ripple circle */
  .ask-ai-wrapper .ripple-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(32, 190, 255, 0.15);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 0;
  }

  /* Floating dots */
  .ask-ai-wrapper .floating-dots {
    position: absolute;
    inset: 0;
    pointer-events: none; /* Prevent dots from blocking input */
    z-index: 1; /* Below input but above background */
  }

  .ask-ai-wrapper .floating-dots span {
    position: absolute;
    width: 3px;
    height: 3px;
    background: #20beff;
    border-radius: 50%;
    opacity: 0;
    transition:
      opacity 0.3s ease,
      transform 0.6s cubic-bezier(0.7, -0.5, 0.3, 1.5);
  }

  /* Background fade */
  .ask-ai-wrapper .bg-fade {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(32, 190, 255, 0.05),
      rgba(32, 190, 255, 0.1)
    );
    opacity: 0;
    transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
    z-index: 0;
  }

  /* Hover and focus states */
  .ask-ai-wrapper .ai-input-container:hover,
  .ask-ai-wrapper .ai-input:focus-within .ai-input-container {
    border-color: #20beff;
    box-shadow: 0 4px 12px rgba(32, 190, 255, 0.2);
    transform: translateY(-2px);
  }

  .ask-ai-wrapper .ai-input-container:hover .icon-container,
  .ask-ai-wrapper .ai-input:focus-within .icon-container {
    transform: translateY(-1px) scale(1.1);
  }

  .ask-ai-wrapper .ai-input-container:hover .ai-icon path,
  .ask-ai-wrapper .ai-input:focus-within .ai-icon path {
    fill: #20beff;
    transform: scale(1.1) rotate(5deg);
    animation: gentleBounce 0.5s infinite alternate
      cubic-bezier(0.7, -0.5, 0.3, 1.5);
  }

  .ask-ai-wrapper .ai-input-container:hover .underline-effect,
  .ask-ai-wrapper .ai-input:focus-within .underline-effect {
    width: 100%;
  }

  .ask-ai-wrapper .ai-input-container:hover .ripple-circle,
  .ask-ai-wrapper .ai-input:focus-within .ripple-circle {
    width: 200px;
    height: 200px;
  }

  .ask-ai-wrapper .ai-input-container:hover .floating-dots span,
  .ask-ai-wrapper .ai-input:focus-within .floating-dots span {
    opacity: 1;
    animation: floatUp 1.2s infinite cubic-bezier(0.65, 0, 0.35, 1);
  }

  .ask-ai-wrapper .ai-input-container:hover .bg-fade,
  .ask-ai-wrapper .ai-input:focus-within .bg-fade {
    opacity: 1;
  }

  /* Focus state for input */
  .ask-ai-wrapper .ai-input:focus {
    color: #0f1419;
  }

  /* Animations */
  @keyframes gentleBounce {
    0% {
      transform: scale(1.1) translateY(1px);
    }
    100% {
      transform: scale(1.1) translateY(-1px);
    }
  }

  @keyframes floatUp {
    0% {
      transform: translate(var(--x), var(--y)) scale(1);
      opacity: 0;
    }
    50% {
      transform: translate(var(--x), calc(var(--y) - 15px)) scale(1.3);
      opacity: 1;
    }
    100% {
      transform: translate(var(--x), calc(var(--y) - 30px)) scale(1);
      opacity: 0;
    }
  }

  /* Dot positions */
  .ask-ai-wrapper .floating-dots span:nth-child(1) {
    --x: 10px;
    --y: 10px;
    animation-delay: 0s;
  }
  .ask-ai-wrapper .floating-dots span:nth-child(2) {
    --x: -5px;
    --y: 5px;
    animation-delay: 0.2s;
  }
  .ask-ai-wrapper .floating-dots span:nth-child(3) {
    --x: 15px;
    --y: 0px;
    animation-delay: 0.4s;
  }
  .ask-ai-wrapper .floating-dots span:nth-child(4) {
    --x: -10px;
    --y: 15px;
    animation-delay: 0.6s;
  }
`;
