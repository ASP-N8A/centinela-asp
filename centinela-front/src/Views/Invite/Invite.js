import React from 'react';
import { Form, Input, Button, Select } from 'antd';

import MainLayout from '../../Layouts/MainLayout';

const { Option } = Select;

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not valid!',
  },
};

const Invite = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    // TODO: Invite endpoint
    const { email, role } = values;
    form.resetFields();
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
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: 'email' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          style={{ width: 120 }}
          name="role"

          initialValue='developer'
        >
          <Select defaultValue='developer'>
            <Option value='admin'>
              Admin
            </Option>
            <Option value='developer'>
              Developer
            </Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Send invite
          </Button>
        </Form.Item>
      </Form>
    </MainLayout>
  );
};

export default Invite;
