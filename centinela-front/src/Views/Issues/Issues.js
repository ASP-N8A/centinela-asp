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
  const [queryParams, setQueryParams] = useState('page=0&status=open&sortBy=severity');
  const [pagination, setPagination] = useState({ pageSize: 10 });
  const [form] = Form.useForm();
  const history = useHistory();

  const user = useSelector(selectUser);

  const { resolvedData } = usePaginatedQuery([queryParams], fetchIssues);

  const handleClickEdit = (issue) => {
    setEditVisible(true);
    form.setFieldsValue(issue);
  };

  React.useEffect(() => {
    if (resolvedData) {
      const {
        data: { results, limit, page, totalResults },
      } = resolvedData;
      let newPagination = {
        pageSize: limit,
        total: totalResults,
        current: page,
      };
      setPagination(newPagination);
      setData(results);
    }
  }, [resolvedData]);

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

  const handleChange = ({ current, pageSize }, filters, sorter) => {
    let newQuery = `page=${current}&limit=${pageSize}&sortBy=severity`;
    if (filters.status && filters.status.length == 1) {
      newQuery += `&status=${filters.status[0]}`;
    }
    setQueryParams(newQuery);
    setInfo({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  return (
    <MainLayout>
      <Table
        columns={columns}
        dataSource={data}
        pagination={pagination}
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
