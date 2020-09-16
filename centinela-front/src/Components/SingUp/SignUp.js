import React from 'react';
import { Form, Input, Button, Alert, Typography } from 'antd';
import { useDispatch } from 'react-redux';

import { Container, Link } from './SignUp.styles';
import { login } from '../../Slices/accountSlice';
import useQuery from '../../Utils/useQuery';

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

const SignUp = ({ setForm }) => {
  const dispatch = useDispatch();
  const query = useQuery();

  const company = query.get('company');
  const token = query.get('token');
  const isInvitation = company && token;

  const onFinish = (values) => {
    // TODO: Sign-up endpoint (create organization & user)
    const { password } = values;
    const user = { role: password === 'admin' ? 'admin' : 'developer'}
    dispatch(login(user));
  };

  return (
    <Container>
      <Typography.Title level={3}>
        {isInvitation ? 'Join company' : 'Create company'}
      </Typography.Title>
      <Form
        {...layout}
        name="signup"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        validateMessages={validateMessages}
      >
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ type: 'email', required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Password" name="password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>

        {isInvitation ? (
          <Alert
            message={`Your are joining ${company}`}
            type="info"
            showIcon
            style={{ marginBottom: 18 }}
          />
        ) : (
          <Form.Item label="Company" name="company" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        )}

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Submit
          </Button>
          Or <Link onClick={() => setForm('signin')}>sign in!</Link>
        </Form.Item>
      </Form>
    </Container>
  );
};

export default SignUp;
