import React from 'react';
import { Form, Input, Button, Alert, Typography, message } from 'antd';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';

import { Container, Link } from './SignUp.styles';
import useURLQuery from '../../Utils/useQuery';
import api from '../../Utils/api';
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

const postSignup = async ({ values, invitationId, organizationToJoin }) => {
  const url = invitationId ? 'auth/registerUser' : 'auth/register';
  const newValues = invitationId
    ? { ...values, organization: organizationToJoin, invitationId }
    : values;

  const { data } = await api.post(`${API_URL}${url}`, newValues);
  return data;
};

const SignUp = ({ setForm }) => {
  const history = useHistory();
  const [mutateSignup, { isLoading, error }] = useMutation(postSignup, {
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

  const query = useURLQuery();

  const organizationToJoin = query.get('company');
  const token = query.get('token');
  const isInvitation = organizationToJoin && token;

  const onFinish = async ({ name, email, password, organization }) => {
    await mutateSignup({
      values: { name, email, password, organization },
      invitationId: isInvitation,
      organizationToJoin,
    });
  };

  const renderError = () => {
    const {
      response: { data },
    } = error;
    return message.error(data.message);
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
            message={`Your are joining ${organizationToJoin}`}
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
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }} loading={isLoading}>
            Submit
          </Button>
          Or <Link onClick={() => setForm('signin')}>sign in!</Link>
        </Form.Item>
      </Form>
    </Container>
  );
};

export default SignUp;
