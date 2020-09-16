import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { useDispatch } from 'react-redux';

import { Container } from './SignIn.styles';
import { login } from '../../Slices/accountSlice';
import { Link } from '../SingUp/SignUp.styles';

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
  const dispatch = useDispatch();

  const onFinish = (values) => {
    // TODO: Sign-in endpoint
    const { password } = values;
    const user = { role: password === 'admin' ? 'admin' : 'developer'}
    dispatch(login(user));
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
          <Input type="password" placeholder="Password" />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Log in
          </Button>
          Or <Link onClick={() => setForm('signup')}>register now!</Link>
        </Form.Item>
      </Form>
    </Container>
  );
};

export default SignIn;
