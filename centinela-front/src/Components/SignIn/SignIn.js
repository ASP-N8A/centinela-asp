import React from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import { Container } from './SignIn.styles';
import { Link } from '../SingUp/SignUp.styles';
import auth from '../../Utils/auth';
import { API_URL } from '../../Utils/config';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not validate email!',
  },
};

const postLogin = async ({ email, password }) => {
  const { data } = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  return data;
};

const SignIn = ({ setForm }) => {
  const history = useHistory();

  const [mutateLogin, { isLoading, error }] = useMutation(postLogin, {
    onSuccess: (response) => {
      const { tokens, user } = response;
      auth.storeToken(tokens.access.token, tokens.refresh.token);
      Cookies.set('role', user.role);
      history.push('/issues');
    },
  });

  React.useEffect(() => {
    if (error) {
      renderError();
    }
  }, [error]);

  const onFinish = async ({ email, password }) => {
    await mutateLogin({ email, password });
  };

  const renderError = () => {
    const {
      response: { data },
    } = error;
    return message.error(data.message);
  };

  return (
    <Container>
      <Typography.Title level={3}>Login</Typography.Title>
      <Form
        {...layout}
        name="signin"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        validateMessages={validateMessages}
      >
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input type="password" />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }} loading={isLoading}>
            Log in
          </Button>
          Or <Link onClick={() => setForm('signup')}>register now!</Link>
        </Form.Item>
      </Form>
    </Container>
  );
};

export default SignIn;
