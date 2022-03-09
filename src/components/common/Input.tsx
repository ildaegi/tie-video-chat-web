import { InputHTMLAttributes } from "react";
import styled from "styled-components";

const DivInputContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 1rem 0;
`;
const DivInputLabel = styled.div`
  /* fontsize: 14; */
  font-weight: 500;
  color: #fff;
  margin-bottom: 0.3rem;
`;
const Input = styled.input`
  height: 32px;
  padding: 0px 16px;
  background-color: transparent;
  border: none;
  outline: none;
  border-bottom: 1px solid #fff;
  color: #fff;
`;

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}
export default function _Input({ label, ...props }: InputProps) {
  return (
    <DivInputContainer>
      {label && <DivInputLabel>{label}</DivInputLabel>}
      <Input {...props} style={{ ...props.style }} />
    </DivInputContainer>
  );
}
