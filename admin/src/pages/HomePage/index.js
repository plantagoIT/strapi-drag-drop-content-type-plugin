
import React, { memo, useState, useEffect } from 'react';

import { useIntl } from 'react-intl';
import getTrad from '../../utils/getTrad';

import taskRequests from '../../api/task';

import { LoadingIndicatorPage } from '@strapi/helper-plugin';

import { Box } from '@strapi/design-system/Box';
import { Flex } from '@strapi/design-system/Flex';
import { Typography } from '@strapi/design-system/Typography';
import { EmptyStateLayout } from '@strapi/design-system/EmptyStateLayout';
import { BaseHeaderLayout, ContentLayout } from '@strapi/design-system/Layout';

import { Illo } from '../../components/Illo';

const HomePage = () => {
  const [taskCount, setTaskCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { formatMessage } = useIntl();

  useEffect(() => {
    taskRequests.getTaskCount().then(data => {
      setTaskCount(data);
      setIsLoading(false);
    });
  }, [setTaskCount]);

  if (isLoading) return <LoadingIndicatorPage />;

  return (
    <>
      <BaseHeaderLayout
        title={formatMessage({
          id: getTrad('Homepage.BaseHeaderLayout.title'),
          defaultMessage: 'Todo Plugin',
        })}
        subtitle="Discover the number of tasks you have in your project"
        as="h2"
      />

      <ContentLayout>
        {taskCount === 0 && (
          <EmptyStateLayout icon={<Illo />} content="You don't have any tasks yet..." />
        )}
        {taskCount > 0 && (
          <Box background="neutral0" hasRadius={true} shadow="filterShadow">
            <Flex justifyContent="center" padding={8}>
              <Typography variant="alpha">You have a total of {taskCount} tasks 🚀</Typography>
            </Flex>
          </Box>
        )}
      </ContentLayout>
    </>
  );
};

export default memo(HomePage);