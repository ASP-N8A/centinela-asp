import React from 'react';
import { Form, Input, Button, Select, Result } from 'antd';
import { useMutation } from 'react-query';

import { sendInvitation } from '../../Utils/api';

import MainLayout from '../../Layouts/MainLayout';

const { Option } = Select;

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not valid!',
  },
};

const Invite = () => {
  const [mutate, { isLoading, data, error }] = useMutation(sendInvitation);
  const [form] = Form.useForm();

  const onFinish = ({ email, role }) => {
    mutate({ email, role });
    form.resetFields();
  };

  const renderError = () => {
    const {
      response: { data },
    } = error;
    return <Result status="error" title="Submission Failed" subTitle={data.message} />;
  };

  const renderSucces = () => {
    return <Result status="success" title="Invitation succesfully sended!" />;
  };

  return (
    <MainLayout>
      <Form
        layout="inline"
        name="invite"
        validateMessages={validateMessages}
        onFinish={onFinish}
        form={form}
      >
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>

        <Form.Item style={{ width: 120 }} name="role" initialValue="developer">
          <Select defaultValue="developer">
            <Option value="admin">Admin</Option>
            <Option value="developer">Developer</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Send invite
          </Button>
        </Form.Item>
      </Form>
      {data && renderSucces()}
      {error && renderError()}
    </MainLayout>
  );
};

export default Invite;
