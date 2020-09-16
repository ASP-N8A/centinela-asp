import React, { useState } from 'react';
import { Table, Space } from 'antd';
import { useSelector } from 'react-redux';

import { Link } from '../../Components/SingUp/SignUp.styles';
import { selectUser } from '../../Slices/accountSlice';

const data = [
  {
    name: 'Issue 1 with windows size',
    severity: 3,
    status: 'open',
    developer: 'diego@diego.com',
  },
  {
    name: 'Issue 2 with windows size',
    severity: 3,
    status: 'open',
    developer: 'diego@diego.com',
  },
  {
    name: 'Issue 3 with windows size',
    severity: 1,
    status: 'open',
    developer: 'diego@diego.com',
  },
  {
    name: 'Issue 4 with windows size',
    severity: 2,
    status: 'open',
    developer: null,
  },
  {
    name: 'Issue 5 with windows size',
    severity: 4,
    status: 'close',
    developer: null,
  },
  {
    name: 'Issue 6 with windows size',
    severity: 4,
    status: 'open',
    developer: null,
  },
  {
    name: 'Issue 7 with windows size',
    severity: 3,
    status: 'close',
    developer: null,
  },
  {
    name: 'Issue 8 with windows size',
    severity: 2,
    status: 'open',
    developer: null,
  },
];

const Issues = () => {
  const [info, setInfo] = useState({
    sortedInfo: {
      order: 'descend',
      columnKey: 'severity',
    },
    filteredInfo: undefined,
  });

  const user = useSelector(selectUser);

  console.log('user ', user);

  const columns = [
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      sorter: (a, b) => b.severity - a.severity,
      sortOrder: info.sortedInfo?.columnKey === 'severity' && info.sortedInfo.order,
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
    },
    {
      title: 'Developer',
      dataIndex: 'developer',
      key: 'developer',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space>
          {user?.role === 'admin' && <Link>Edit</Link>}
          <Link>View</Link>
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
    <Table
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 50 }}
      scroll={{ y: 550 }}
      onChange={handleChange}
    />
  );
};

export default Issues;
