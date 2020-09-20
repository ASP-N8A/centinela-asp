import React, { useState, useEffect } from 'react';
import { Spin, Result, Button, Space, Tag, Alert, Typography } from 'antd';
import { useParams, useHistory } from 'react-router-dom';
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
  title: 'Issue 1 with windows size',
  description:
    'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias exceptur',
  severity: 1,
  status: 'open',
  developer: 'diego@diego.com',
};

// const issue = null;

const IssueDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [closeRecently, setCloseRecently] = useState(false);
  const [issue, setIssue] = useState(initialIssue);
  const { title, description, severity, status, developer } = issue;

  useEffect(() => {
    // get issue details with `id`
  }, []);

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
    // close Issue request.
    setIssue({ ...initialIssue, status: 'close' });
    setCloseRecently(true);
  };

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (!issue) {
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
