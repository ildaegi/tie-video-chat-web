import styled, { keyframes } from "styled-components";
import background from "../../assets/image/noiseBackground.png";

const noiseAnimationGenerator = (x: number, y: number) =>
  `-webkit-transform: translate(${x}%,${y}%); transform: translate(${x}%,${y}%);`;

const noiseAnimation = keyframes`
  0% {${noiseAnimationGenerator(0, 0)}}
  10% {${noiseAnimationGenerator(-5, -5)}}
  20% {${noiseAnimationGenerator(-10, 5)}}
  30% {${noiseAnimationGenerator(5, -10)}}
  40% {${noiseAnimationGenerator(-5, 15)}}
  50% {${noiseAnimationGenerator(-10, 5)}}
  60% {${noiseAnimationGenerator(15, 0)}}
  70% {${noiseAnimationGenerator(0, 10)}}
  80% {${noiseAnimationGenerator(-15, 0)}}
  90% {${noiseAnimationGenerator(10, 5)}}
  100% {${noiseAnimationGenerator(5, 0)}}
`;

const Noise = styled.div`
  pointer-events: none;

  position: fixed;

  width: 180%;
  height: 180%;
  left: -40%;
  top: -40%;

  background-image: url(${background});

  z-index: 10;

  -webkit-animation: ${noiseAnimation} 1s steps(4) infinite;
  animation: ${noiseAnimation} 1s steps(4) infinite;
`;

export default Noise;
