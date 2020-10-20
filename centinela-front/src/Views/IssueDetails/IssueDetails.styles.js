import styled from 'styled-components';
import { Typography } from 'antd';
const { Title, Text } = Typography;

export const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  padding-top: 40px;
  margin: 0 auto;
  width: 60%;
  max-width: 600px;
  padding: 20px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-item: flex-start;
  width: 100%;
`;

export const IssueTitle = styled(Title)`
  margin: 0 !important;
  margin-right: 4px !important;
`;

export const BadgeContainer = styled.div`
  display: flex;
`;

export const Description = styled(Text)``;

export const Developer = styled(Text)`
  display: flex;
  align-self: end;
`;

export const DeveloperContainer = styled.div`
  display: flex;
  margin: 20px 0px;
`;
