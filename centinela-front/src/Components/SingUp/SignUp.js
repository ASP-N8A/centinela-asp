import React from 'react';
import { Form, Input, Button, Alert, Typography, Result } from 'antd';
import { useDispatch } from 'react-redux';
import { useMutation } from 'react-query';

import { Container, Link } from './SignUp.styles';
import { login } from '../../Slices/accountSlice';
import useURLQuery from '../../Utils/useQuery';
import { signUp } from '../../Utils/api';

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
  const [mutate, { isLoading, error }] = useMutation(signUp);

  const dispatch = useDispatch();

  const query = useURLQuery();

  const organizationToJoin = query.get('company');
  const token = query.get('token');
  const isInvitation = organizationToJoin && token;

  const onFinish = async ({ name, email, password, organization }) => {
    const user = await mutate({
      values: { name, email, password, organization },
      invitationId: isInvitation,
      organizationToJoin,
    });
    if (user) {
      dispatch(login(user));
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
      {error && renderError()}
    </Container>
  );
};

export default SignUp;
