import React from 'react';
import { Form, Input, Button, Alert, Typography } from 'antd';
import { useDispatch } from 'react-redux';

import { Container, Link } from './SignUp.styles';
import { login } from '../../Slices/accountSlice';
import useURLQuery from '../../Utils/useQuery';
import { createOrgAndUser } from '../../Utils/api';

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
  const [errorMessage, setErrorMesage] = React.useState('');

  const dispatch = useDispatch();

  const query = useURLQuery();

  const organization = query.get('organization');
  const token = query.get('token');
  const isInvitation = organization && token;

  const onFinish = ({ name, email, password, organization }) => {
    createOrgAndUser(
      { name, email, password, organization },
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
      <Typography.Title level={3}>
        {isInvitation ? 'Join organization' : 'Create organization'}
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
            message={`Your are joining ${organization}`}
            type="info"
            showIcon
            style={{ marginBottom: 18 }}
          />
        ) : (
          <Form.Item label="Organization" name="organization" rules={[{ required: true }]}>
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
      {/* TODO: agregar estilos */}
      <div>{errorMessage}</div>
    </Container>
  );
};

export default SignUp;
