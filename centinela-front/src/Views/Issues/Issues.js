import React, { useState } from 'react';
import { Table, Space, Modal, Form, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { usePaginatedQuery, useMutation, queryCache } from 'react-query';

import { Link } from '../../Components/SingUp/SignUp.styles';
import EdditIssue from '../../Components/EditIssue/EdditIssue';
import MainLayout from '../../Layouts/MainLayout';

import api from '../../Utils/api';
import auth from '../../Utils/auth';

const fetchIssues = (queryParams) => {
  return api.get(`/issues?${queryParams}`);
};

const patchIssue = async ({ values, id }) => {
  const { data } = await api.patch(`/issues/${id}`, values);
  return data;
};

const Issues = () => {
  const [info, setInfo] = useState({
    sortedInfo: {
      order: 'descend',
      columnKey: 'severity',
    },
    filteredInfo: undefined,
  });
  const [isEditVisible, setEditVisible] = useState(false);
  const [issues, setIssues] = useState([]);
  const [queryParams, setQueryParams] = useState('page=0&status=open&sortBy=severity');
  const [pagination, setPagination] = useState({ pageSize: 10 });
  const [form] = Form.useForm();
  const history = useHistory();

  const { resolvedData, isLoading, isFetching } = usePaginatedQuery([queryParams], fetchIssues);
  const [mutate] = useMutation(patchIssue, {
    onSuccess: (data) => {
      const { id } = data;
      queryCache.setQueryData(['issues', { id }], data);

      message.success('Issue updated!');

      const newIssues = [...issues];
      const indexIssue = issues.findIndex((issue) => issue.id === id);
      newIssues.splice(indexIssue, 1, data);
      setIssues(newIssues);
    },
    onError: (err) => message.error(`Error ocurred: ${err.message}`),
  });

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
      setIssues(results);
    }
  }, [resolvedData]);

  const handleEditIssue = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();

        const { id } = values;
        delete values.id;
        mutate({ values, id });

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
      title: 'Key',
      dataIndex: 'keyName',
      key: 'keyName',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, issue) => (
        <Space>
          {auth.isAdmin() && <Link onClick={() => handleClickEdit(issue)}>Edit</Link>}
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
        dataSource={issues}
        pagination={pagination}
        scroll={{ y: 550 }}
        onChange={handleChange}
        loading={isLoading || isFetching}
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
