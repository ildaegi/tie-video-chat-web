import styled, { keyframes } from "styled-components";
import logoImage from "../../assets/logo/logo.svg";

const ImgLogoSpin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;
const ImgLogo = styled.img`
  width: 100%;
  height: 100%;
  pointer-events: none;
  animation: ${ImgLogoSpin} infinite 20s linear;
  object-fit: contain;
`;

const ImgLogoContainer = styled.div`
  height: 60vmin;
  width: 40vmin;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Logo() {
  return (
    <ImgLogoContainer>
      <ImgLogo src={logoImage} alt="logo" />
    </ImgLogoContainer>
  );
}
