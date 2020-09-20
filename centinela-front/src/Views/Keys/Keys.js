import React, { useState } from 'react';
import { Form, Button, Input, Typography, List } from 'antd';

import MainLayout from '../../Layouts/MainLayout';

const { Text } = Typography;

// mock data
const initialKeys = [
  {
    name: 'develop',
    value: 'K3qs4HObsppqHrMZCIebNeSsVQ8agfqP',
  },
  {
    name: 'production',
    value: 'tP0ctfAjtwYvLBSohgOdUINMHoH8PlDn',
  },
  {
    name: 'test',
    value: 'u2mkICL6HEF5p1CliCrN0JcEEsRmknJi',
  },
];

const Keys = () => {
  const [form] = Form.useForm();
  const [keys, setKeys] = useState(initialKeys);

  const onFinish = (values) => {
    // TODO: Create key endpoint
    const { name } = values;
    form.resetFields();
  };

  const renderForm = () => (
    <Form layout="inline" name="create-key" onFinish={onFinish} form={form}>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please enter a name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create key
        </Button>
      </Form.Item>
    </Form>
  );

  const renderKeys = () => {
    return (
      <List
        size="small"
        style={{ marginTop: 28 }}
        header={<div>Keys</div>}
        bordered
        dataSource={keys}
        renderItem={(key) => (
          <List.Item>
            <Text strong>{key.name}</Text> - <Text copyable>{key.value}</Text>
          </List.Item>
        )}
      />
    );
  };

  return (
    <MainLayout>
      {renderForm()}
      {renderKeys()}
    </MainLayout>
  );
};

export default Keys;