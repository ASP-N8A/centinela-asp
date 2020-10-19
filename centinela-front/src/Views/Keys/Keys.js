import React from 'react';
import { Form, Button, Input, Typography, Result } from 'antd';
import { useMutation } from 'react-query';
import axios from 'axios';
import MainLayout from '../../Layouts/MainLayout';

const { Text } = Typography;

const createKey = async (name) => {
  const { data } = await axios.post('/keys', {
    name,
  });
  return data;
};

const Keys = () => {
  const [form] = Form.useForm();
  const [mutate, { isLoading, data, error }] = useMutation(createKey);

  const onFinish = ({ name }) => {
    mutate(name);
    form.resetFields();
  };

  const renderForm = () => (
    <div>
      <Form layout="inline" name="create-key" onFinish={onFinish} form={form}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter a name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Create key
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  const renderKeyValue = () => {
    return (
      <>
        <Text style={{ marginRight: 4, fontWeight: 600 }}>Key:</Text>
        <Text copyable ellipsis style={{ maxWidth: 300, marginRight: 8, fontStyle: 'italic' }}>
          ${data.token}
        </Text>
        <Text>This is the only chance you have to save the key, keep it save.</Text>
      </>
    );
  };

  const renderKey = () => {
    return <Result status="success" title="Key succesfully created!" subTitle={renderKeyValue()} />;
  };

  const renderError = () => {
    return <Result status="error" title="Submission Failed" subTitle={error.message} />;
  };

  return (
    <MainLayout>
      {renderForm()}
      {data && renderKey()}
      {error && renderError()}
    </MainLayout>
  );
};

export default Keys;
