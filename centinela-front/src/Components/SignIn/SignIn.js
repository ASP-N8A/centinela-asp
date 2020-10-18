import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { useDispatch } from 'react-redux';

import { Container } from './SignIn.styles';
import { login } from '../../Slices/accountSlice';
import { Link } from '../SingUp/SignUp.styles';

import { login as signin } from '../../Utils/api';

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

const SignIn = ({ setForm }) => {
  const [errorMessage, setErrorMesage] = React.useState('');

  const dispatch = useDispatch();

  const onFinish = ({ email, password }) => {
    signin(
      { email, password },
      //  On Success
      (user) => {
        dispatch(login(user));
      },
      // On error
      (resp) => {
        setErrorMesage(resp.message);
      },
    );
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
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Log in
          </Button>
          Or <Link onClick={() => setForm('signup')}>register now!</Link>
        </Form.Item>
      </Form>
      {/* TODO: agregar estilos */}
      <div>{errorMessage}</div>
    </Container>
  );
};

export default SignIn;
