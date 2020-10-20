import React from 'react';
import { Form, Input, Button, Typography, Result } from 'antd';
import { useDispatch } from 'react-redux';
import { useMutation } from 'react-query';

import { Container } from './SignIn.styles';
import { login as loginSlice } from '../../Slices/accountSlice';
import { Link } from '../SingUp/SignUp.styles';

import { login as loginCall } from '../../Utils/api';

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
  const [mutate, { isLoading, error }] = useMutation(loginCall);

  const dispatch = useDispatch();

  const onFinish = async ({ email, password }) => {
    const user = await mutate({ email, password });
    if (user) {
      dispatch(loginSlice(user));
    }
  };

  const renderError = () => {
    const {
      response: { data },
    } = error;
    return <Result status="error" title="Submission Failed" subTitle={data.message} />;
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
      {error && renderError()}
    </Container>
  );
};

export default SignIn;
