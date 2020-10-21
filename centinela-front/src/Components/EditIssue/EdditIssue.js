import React from 'react';
import { Form, Input, Select } from 'antd';

const { Option } = Select;
const severityOptions = [1, 2, 3, 4];

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const EdditIssue = ({ form }) => {
  return (
    <React.Fragment>
      <Form {...layout} form={form} preserve={false}>
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
      </Form>
    </React.Fragment>
  );
};

export default EdditIssue;
