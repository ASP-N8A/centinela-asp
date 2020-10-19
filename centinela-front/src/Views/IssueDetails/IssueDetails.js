import React, { useState, useEffect } from 'react';
import { Spin, Result, Button, Space, Tag, Alert, Typography } from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';

import { fetchIssue, patchIssue } from '../../Utils/api';

import {
  Container,
  HeaderContainer,
  IssueTitle,
  Description,
  DeveloperContainer,
} from './IssueDetails.styles';
import { CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { theme } from '../../theme';
import MainLayout from '../../Layouts/MainLayout';

const { Text, Link } = Typography;

// mock data
const initialIssue = {
  id: 1,
  title: '',
  description: '',
  severity: 1,
  status: '',
  developer: '',
};

const IssueDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const [mutate, { isLoading: loadingPath, error: errorPatch, data: mutationData }] = useMutation(
    patchIssue,
  );
  const { isLoading, data, error } = useQuery(id, fetchIssue);

  const [closeRecently, setCloseRecently] = useState(false);
  const { title, description, severity, status, developer } = data ? data.data : initialIssue;

  const getStatusTag = () => {
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

  const getSeverityTag = () => {
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

  if (isLoading || loadingPath) {
    return <Spin size="large" />;
  }

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

  return (
    <MainLayout>
      <Container>
        <HeaderContainer>
          <IssueTitle level={4}>{title}</IssueTitle>
          <Space>
            {getStatusTag()}
            {getSeverityTag()}
          </Space>
        </HeaderContainer>
        <Description>{description || 'No description.'}</Description>
        <DeveloperContainer>
          <IssueTitle level={5}>Developer:</IssueTitle>
          <Description>{developer || 'Not assigned.'}</Description>
        </DeveloperContainer>
        {status === 'open' ? (
          <Button type="primary" onClick={handleCloseIssue}>
            Close Issue
          </Button>
        ) : closeRecently ? (
          <Alert
            message="Issue status"
            description={
              <Text>
                Issue was succesfully closed, <Link href="/">return to home</Link>
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
                This issue is already closed, <Link href="/">return to home</Link>
              </Text>
            }
            type="info"
            showIcon
          />
        )}
      </Container>
    </MainLayout>
  );
};

export default IssueDetails;
