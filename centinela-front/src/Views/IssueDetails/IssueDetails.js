import React, { useState } from 'react';
import { Spin, Result, Button, Space, Tag, Alert, Typography } from 'antd';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useQuery, useMutation, queryCache } from 'react-query';

import {
  Container,
  HeaderContainer,
  IssueTitle,
  Description,
  DeveloperContainer,
  Developer,
} from './IssueDetails.styles';
import { CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { theme } from '../../theme';
import MainLayout from '../../Layouts/MainLayout';
import api from '../../Utils/api';

const { Text } = Typography;

export const fetchIssue = async (id) => {
  const { data } = await api.get(`/issues/${id}`);
  return data;
};

export const patchIssue = async ({ values, id }) => {
  const { data } = await api.patch(`/issues/${id}`, values);
  return data;
};

const IssueDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const [closeRecently, setCloseRecently] = useState(false);
  const { isLoading, data, error } = useQuery(id, fetchIssue);
  const [mutate, { isLoading: loadingPatch, error: errorPatch }] = useMutation(patchIssue, {
    onSuccess: (data) => {
      queryCache.setQueryData(id, data);
    },
  });

  const getStatusTag = (status) => {
    if (status === 'open') {
      return (
        <Tag icon={<SyncOutlined spin />} color="processing">
          Open
        </Tag>
      );
    }

    return (
      <Tag icon={<CheckCircleOutlined />} color="success">
        Closed
      </Tag>
    );
  };

  const getSeverityTag = (severity) => {
    if (severity) {
      return <Tag color={theme.colors.severity[severity - 1]}>{severity}</Tag>;
    }
    return null;
  };

  const handleCloseIssue = () => {
    const values = { ...data.data, status: 'close' };
    delete values.id;
    mutate({ values, id });
    setCloseRecently(true);
  };

  if (error) {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the issue you visited does not exist."
        extra={
          <Button type="primary" onClick={() => history.push('/')}>
            Back Home
          </Button>
        }
      />
    );
  }

  const renderContent = () => {
    const { title, description, severity, status, developer } = data;

    return (
      <>
        <HeaderContainer>
          <IssueTitle level={4}>{title}</IssueTitle>
          <Space>
            {getStatusTag(status)}
            {getSeverityTag(severity)}
          </Space>
        </HeaderContainer>
        <Description>{description || 'No description.'}</Description>
        <DeveloperContainer>
          <IssueTitle level={5}>Developer:</IssueTitle>
          <Developer>{developer || 'Not assigned.'}</Developer>
        </DeveloperContainer>
        {status === 'open' ? (
          <Button type="primary" onClick={handleCloseIssue} loading={loadingPatch}>
            Close Issue
          </Button>
        ) : closeRecently ? (
          <Alert
            message="Issue status"
            description={
              <Text>
                Issue was succesfully closed, <Link to="/issues">return to home</Link>
              </Text>
            }
            type="success"
            showIcon
          />
        ) : (
          <Alert
            message="Issue status"
            description={
              <Text>
                This issue is already closed, <Link to="/issues">return to home</Link>
              </Text>
            }
            type="info"
            showIcon
          />
        )}
      </>
    );
  };

  return (
    <MainLayout>
      <Container>{isLoading ? <Spin size="large" /> : renderContent()}</Container>
    </MainLayout>
  );
};

export default IssueDetails;
