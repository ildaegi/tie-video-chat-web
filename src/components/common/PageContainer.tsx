import styled from "styled-components";

const DivPageContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;
interface PageContainerProps {
  children: React.ReactNode;
}
export default function PageContainer({ children }: PageContainerProps) {
  return <DivPageContainer>{children}</DivPageContainer>;
}
