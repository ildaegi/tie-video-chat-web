import styled from "styled-components";

interface DivRowProps {
  width?: string;
}
const DivRow = styled.div<DivRowProps>`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
`;

interface RowProps extends DivRowProps {
  children: React.ReactNode;
}
export default function Row({ children, ...props }: RowProps) {
  return <DivRow {...props}>{children}</DivRow>;
}
