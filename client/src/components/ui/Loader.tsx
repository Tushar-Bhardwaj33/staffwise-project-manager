import React from 'react';
import styled from 'styled-components';

export const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <div className="square" id="sq1" />
        <div className="square" id="sq2" />
        <div className="square" id="sq3" />
        <div className="square" id="sq4" />
        <div className="square" id="sq5" />
        <div className="square" id="sq6" />
        <div className="square" id="sq7" />
        <div className="square" id="sq8" />
        <div className="square" id="sq9" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .loader {
    position: relative;
    width: 60px;
    height: 60px;
  }

  @keyframes loader_5191 {
    from {
      opacity: 0;
      transform: scale(0.5);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .square {
    background: #20beff;
    width: 12px;
    height: 12px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -6px;
    margin-left: -6px;
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(32, 190, 255, 0.4);
  }

  #sq1 {
    margin-top: -26px;
    margin-left: -26px;
    animation: loader_5191 675ms ease-in-out 0s infinite alternate;
  }

  #sq2 {
    margin-top: -26px;
    animation: loader_5191 675ms ease-in-out 75ms infinite alternate;
  }

  #sq3 {
    margin-top: -26px;
    margin-left: 14px;
    animation: loader_5191 675ms ease-in-out 150ms infinite alternate;
  }

  #sq4 {
    margin-left: -26px;
    animation: loader_5191 675ms ease-in-out 225ms infinite alternate;
  }

  #sq5 {
    animation: loader_5191 675ms ease-in-out 300ms infinite alternate;
  }

  #sq6 {
    margin-left: 14px;
    animation: loader_5191 675ms ease-in-out 375ms infinite alternate;
  }

  #sq7 {
    margin-top: 14px;
    margin-left: -26px;
    animation: loader_5191 675ms ease-in-out 450ms infinite alternate;
  }

  #sq8 {
    margin-top: 14px;
    animation: loader_5191 675ms ease-in-out 525ms infinite alternate;
  }

  #sq9 {
    margin-top: 14px;
    margin-left: 14px;
    animation: loader_5191 675ms ease-in-out 600ms infinite alternate;
  }
`;
