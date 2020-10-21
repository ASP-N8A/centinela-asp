import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  width: 100%;
  padding-top: 48px;
`;

export const Link = styled.span`
  cursor: pointer;
  transition: color 0.3s;
  color: ${(props) => props.theme.colors.link};
  &:hover {
    color: ${(props) => props.theme.colors.linkActive} 
  }
`;
