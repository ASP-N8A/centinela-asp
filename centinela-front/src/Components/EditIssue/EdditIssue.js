import React from 'react';
import { Form, Input, Select, Button, Result } from 'antd';
import { useMutation } from 'react-query';

import { patchIssue } from '../../Utils/api';

const { Option } = Select;
const severityOptions = [1, 2, 3, 4];

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const EdditIssue = ({ form }) => {
  const [mutate, { isLoading, error, data }] = useMutation(patchIssue);

  const onFinish = (values) => {
    const { id } = values;
    delete values.id;
    mutate({ values, id });
  };

  const renderError = () => {
    const {
      response: { data },
    } = error;
    return <Result status="error" title="Submission Failed" subTitle={data.message} />;
  };

  const renderSucces = () => {
    return <Result status="success" title="Issue succesfully updated!" />;
  };
  return (
    <React.Fragment>
      <Form {...layout} form={form} preserve={false} onFinish={onFinish}>
        <Form.Item name="id" label="ID" rules={[{ required: true }]} hidden />
        <Form.Item name="status" label="Status" rules={[{ required: true }]} hidden />

        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input />
        </Form.Item>
        <Form.Item name="severity" label="Severity">
          <Select>
            {severityOptions.map((value) => (
              <Option key={value} value={value}>
                {value}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="developer" label="Developer">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Update issue
          </Button>
        </Form.Item>
      </Form>
      {data && renderSucces()}
      {error && renderError()}
    </React.Fragment>
  );
};

export default EdditIssue;
