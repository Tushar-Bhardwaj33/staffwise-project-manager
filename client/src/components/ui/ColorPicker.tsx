import React from 'react';
import styled from 'styled-components';

interface ColorPickerProps {
  value: string | undefined;
  onChange: (color: string) => void;
}

const COLORS = [
  '#e11d48', // rose
  '#f472b6', // pink
  '#fb923c', // orange
  '#facc15', // yellow
  '#84cc16', // lime
  '#10b981', // emerald
  '#0ea5e9', // sky
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#a78bfa', // purple
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  return (
    <StyledWrapper>
      <div className="comic-panel">
        <div className="container-items">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className={`item-color ${value === color ? 'selected' : ''}`}
              style={{ '--color': color } as React.CSSProperties}
              aria-label={`Select color ${color}`}
            >
              {value === color && (
                <svg
                  className="check-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .comic-panel {
    background: #ffffff;
    border: 4px solid #000;
    padding: 1.2rem;
    border-radius: 8px;
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 1);
    display: inline-block;
  }

  .container-items {
    display: flex;
    transform-style: preserve-3d;
    transform: perspective(1000px);
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }

  .item-color {
    position: relative;
    flex-shrink: 0;
    width: 40px;
    height: 48px;
    border: none;
    outline: none;
    margin: -4px;
    background-color: transparent;
    transition: 300ms ease-out;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .item-color::after {
    position: absolute;
    content: "";
    inset: 0;
    width: 40px;
    height: 40px;
    background-color: var(--color);
    border-radius: 6px;
    border: 3px solid #000;
    box-shadow: 4px 4px 0 0 #000;
    pointer-events: none;
    transition: 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 1;
  }
  
  .item-color.selected::after {
    box-shadow: 0px 0px 0 0 #000;
    transform: translate(4px, 4px);
    border-color: #000;
  }

  .check-icon {
    position: relative;
    z-index: 10;
    width: 20px;
    height: 20px;
    transform: translate(2px, -2px);
    filter: drop-shadow(0px 2px 0px rgba(0,0,0,0.5));
  }

  .item-color:hover {
    transform: scale(1.3) translateY(-3px);
    z-index: 99999;
  }

  .item-color:active::after {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 0 #000;
  }

  .item-color:hover + * {
    transform: scale(1.15) translateY(-2px);
    z-index: 9999;
  }

  .item-color:hover + * + * {
    transform: scale(1.05);
    z-index: 999;
  }

  .item-color:has(+ *:hover) {
    transform: scale(1.15) translateY(-2px);
    z-index: 9999;
  }

  .item-color:has(+ * + *:hover) {
    transform: scale(1.05);
    z-index: 999;
  }
`;
