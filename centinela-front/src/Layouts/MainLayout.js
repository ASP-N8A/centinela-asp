import React from 'react';
import { Layout, Menu, Divider } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import auth from '../Utils/auth';

const { Header, Content, Footer } = Layout;

const MainLayout = ({ children }) => {
  const history = useHistory();
  const location = useLocation();

  const logout = () => {
    auth.clear();
    history.push('/');
  }

  const getSelectedKey = () => {
    const { pathname } = location;
    switch (pathname) {
      case '/issues':
        return ['1'];
      case '/invite':
        return ['2'];
      case '/keys':
        return ['3'];
      case '/statistics':
        return ['4'];
      default:
        return ['1'];
    }
  };

  const renderHeader = () => {
    return (
      <Header>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={getSelectedKey()}>
          <Menu.Item key="1" onClick={() => history.push('/issues')}>
            Issues
          </Menu.Item>
          <Menu.Item key="2" onClick={() => history.push('/invite')}>
            Invite
          </Menu.Item>
          <Menu.Item key="3" onClick={() => history.push('/keys')}>
            Mange keys
          </Menu.Item>
          <Menu.Item key="4">Statistics</Menu.Item>
          <Menu.Item key="5" onClick={logout} style={{ position: 'absolute', right: 0}}>
            Log out
          </Menu.Item>
        </Menu>
      </Header>
    );
  };

  return (
    <Layout style={{ height: '100vh' }}>
      {renderHeader()}
      <Content style={{ padding: '20px 50px', minHeight: 'auto' }}>{children}</Content>
      <Footer style={{ textAlign: 'center' }}>Centinela ©2020 Created by ISP</Footer>
    </Layout>
  );
};

export default MainLayout;
