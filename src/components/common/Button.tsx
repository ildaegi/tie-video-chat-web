import { HTMLAttributes } from "react";
import styled from "styled-components";

const DivButton = styled.button`
  background-color: "#fff";
  font-weight: bold;
  font-size: 20px;
  width: 100%;
  height: 50px;
  border-radius: 8px;
  border: none;
  margin: 1rem 0;

  :active {
    background-color: #bdbdbd;
  }
`;

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
export default function Button({
  label,
  disabled: _disabled,
  onClick,
  loading,
  ...props
}: ButtonProps) {
  const waiting = loading ? "..." : "";
  const disabled = _disabled || loading;

  return (
    <>
      <DivButton onClick={disabled ? undefined : onClick} {...props}>
        {label + waiting}
      </DivButton>
    </>
  );
}
