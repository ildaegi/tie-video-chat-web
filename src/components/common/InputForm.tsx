import styled from "styled-components";
import Row from "./Row";

const DivInputForm = styled.div`
  width: 340px;
`;

interface InputFormProps {
  children: React.ReactNode;
}
export default function InputForm({ children }: InputFormProps) {
  return (
    <Row>
      <DivInputForm>{children}</DivInputForm>
    </Row>
  );
}
