import React, { useState } from 'react';
import { Table, Space, Modal, Form } from 'antd';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { usePaginatedQuery } from 'react-query';

import { Link } from '../../Components/SingUp/SignUp.styles';
import { selectUser } from '../../Slices/accountSlice';
import EdditIssue from '../../Components/EditIssue/EdditIssue';
import MainLayout from '../../Layouts/MainLayout';

import { fetchIssues } from '../../Utils/api';

const Issues = () => {
  const [info, setInfo] = useState({
    sortedInfo: {
      order: 'descend',
      columnKey: 'severity',
    },
    filteredInfo: undefined,
  });
  const [isEditVisible, setEditVisible] = useState(false);
  const [data, setData] = useState([]);
  //  TODO: manejar paginado
  const [page, setPage] = useState(0);
  const [form] = Form.useForm();
  const history = useHistory();

  const user = useSelector(selectUser);

  const { resolvedData } = usePaginatedQuery([page], fetchIssues);

  const handleClickEdit = (issue) => {
    setEditVisible(true);
    form.setFieldsValue(issue);
  };

  const handleEditIssue = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('new values ', values);
        form.resetFields();
        // TODO: PUT edit issue

        // Function to simulate behaviour
        const index = data.findIndex((issue) => issue.id === values.id);
        const newData = [...data];
        newData.splice(index, 1, values);
        setData(newData);

        setEditVisible(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const columns = [
    {
      title: 'Title',
      key: 'title',
      dataIndex: 'title',
    },
    {
      title: 'Description',
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      sorter: (a, b) => b.severity - a.severity,
      sortOrder: info.sortedInfo?.columnKey === 'severity' && info.sortedInfo.order,
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        {
          text: 'Open',
          value: 'open',
        },
        {
          text: 'Close',
          value: 'close',
        },
      ],
      defaultFilteredValue: ['open'],
      onFilter: (value, issue) => issue.status.indexOf(value) === 0,
      width: 100,
    },
    {
      title: 'Developer',
      dataIndex: 'developer',
      key: 'developer',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, issue) => (
        <Space>
          {user?.role === 'admin' && <Link onClick={() => handleClickEdit(issue)}>Edit</Link>}
          <Link onClick={() => history.push(`/issue/${issue.id}`)}>View</Link>
        </Space>
      ),
      width: 85,
    },
  ];

  const handleChange = (_, filters, sorter) => {
    setInfo({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  return (
    <MainLayout>
      <Table
        columns={columns}
        dataSource={resolvedData && resolvedData.data && resolvedData.data.results}
        pagination={{ pageSize: 50 }}
        scroll={{ y: 550 }}
        onChange={handleChange}
      />
      <Modal
        title="Edit Issue"
        visible={isEditVisible}
        onOk={handleEditIssue}
        onCancel={() => setEditVisible(false)}
        okText="Edit"
      >
        <EdditIssue form={form} />
      </Modal>
    </MainLayout>
  );
};

export default Issues;
