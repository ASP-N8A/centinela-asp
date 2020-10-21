import React from 'react';
import { Form, Button, DatePicker, Typography, message, Statistic, Row, Col } from 'antd';
import { useMutation } from 'react-query';
import MainLayout from '../../Layouts/MainLayout';
import api from '../../Utils/api';

const { Text } = Typography;

const fetchStatistics = async ({ dateFrom, dateTo }) => {
  if (!dateFrom) {
    return;
  }
  const { data } = await api.get(`/issues/statistics?dateFrom=${dateFrom}&dateTo=${dateTo}`);
  return data;
};

const Keys = () => {
  const [form] = Form.useForm();

  const [mutate, { isLoading, data, error }] = useMutation(fetchStatistics);

  const onFinish = (values) => {
    mutate({ dateFrom: values.dateFrom, dateTo: values.dateTo });
  };

  const onReset = () => {
    form.resetFields();
  };

  const renderForm = () => (
    <div>
      <Form layout="inline" name="statistics" onFinish={onFinish} form={form}>
        <Form.Item
          label="Date from"
          name="dateFrom"
          rules={[{ required: true, message: 'Please enter a starting date!' }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="Date To"
          name="dateTo"
          rules={[{ required: true, message: 'Please enter the end date!' }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Search statistics
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  const renderStatistics = () => {
    const { total, resolved, severities } = data;
    return (
      <>
        <Row gutter={16}>
          <Col span={12}>
            <Statistic title="Total Issues" value={total} />
          </Col>
          <Col span={12}>
            <Statistic title="Resolved" value={resolved} />
          </Col>
          <Col span={24}>
            <Text style={{ marginTop: 32, fontWeight: 600 }}>By severity</Text>
          </Col>
          {severities.map(({ _id, count }) => {
            return (
              <Col span={6}>
                <Statistic title={_id} value={count} />
              </Col>
            );
          })}
        </Row>
      </>
    );
  };

  const renderError = () => {
    const {
      response: { data },
    } = error;
    return message.error(data.message);
  };

  return (
    <MainLayout>
      {renderForm()}
      {error && renderError()}
      {data && renderStatistics()}
    </MainLayout>
  );
};

export default Keys;
