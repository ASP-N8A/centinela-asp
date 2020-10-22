import React, { useState } from 'react';
import { Spin, Result, Button, Space, Tag, Alert, Typography, message } from 'antd';
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

export const closeIssue = async ({ id }) => {
  const { data } = await api.post(`/issues/${id}/close`);
  return data;
};

const IssueDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const [closeRecently, setCloseRecently] = useState(false);
  const { isLoading, data, error } = useQuery(id, fetchIssue);
  const [mutate, { isLoading: loadingMutation, error: errorMutation }] = useMutation(closeIssue, {
    onSuccess: (data) => {
      queryCache.setQueryData(id, data);
    },
  });

  React.useEffect(() => {
    if (errorMutation) {
      renderCloseError();
    }
  }, [errorMutation]);

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
    mutate({ id });
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

  const renderCloseError = () => {
    const {
      response: { data },
    } = errorMutation;
    return message.error(data.message);
  };

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
          <Button type="primary" onClick={handleCloseIssue} loading={loadingMutation}>
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
