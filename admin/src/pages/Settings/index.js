import React, { useEffect, useState } from 'react';

import sortRequests from '../../api/sort';

import { LoadingIndicatorPage, useNotification } from '@strapi/helper-plugin';

import { Box } from '@strapi/design-system/Box';
import { Stack } from '@strapi/design-system/Stack';
import { Button } from '@strapi/design-system/Button';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { HeaderLayout } from '@strapi/design-system/Layout';
import { ContentLayout } from '@strapi/design-system/Layout';
import { Typography } from '@strapi/design-system/Typography';
import { TextInput } from '@strapi/design-system/TextInput';
import { Tooltip } from '@strapi/design-system/Tooltip';

import Information from '@strapi/icons/Information';
import Check from '@strapi/icons/Check';

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const toggleNotification = useNotification();

  useEffect(() => {
    sortRequests.getSettings().then(res => {
      setSettings(res.data.body);
      setIsLoading(false);
    });
  }, [setSettings]);

  const handleSubmit = async () => {
    setIsSaving(true);
    const res = await sortRequests.setSettings(settings);
    setSettings(res.data.body);
    setIsSaving(false);
    toggleNotification({
      type: 'success',
      message: 'Settings successfully updated',
    });
  };

  return (
    <>
      <HeaderLayout
        id="title"
        title="Drag Drop Content Type Config"
        subtitle="Manage field values for drag-droppable entries"
        primaryAction={
          isLoading ? (
            <></>
          ) : (
            <Button
              onClick={handleSubmit}
              startIcon={<Check />}
              size="L"
              disabled={isSaving}
              loading={isSaving}
            >
              Save
            </Button>
          )
        }
      ></HeaderLayout>
      {isLoading ? (
        <LoadingIndicatorPage />
      ) : (
        <ContentLayout>
          <Box
            background="neutral0"
            hasRadius
            shadow="filterShadow"
            paddingTop={6}
            paddingBottom={6}
            paddingLeft={7}
            paddingRight={7}
          >
            <Stack size={3}>
              <Typography>Field Names</Typography>
              <Grid gap={6}>
                <GridItem col={6} s={12}>
                  <Box padding={0}>
                    <TextInput
                      placeholder="Rank"
                      label="Rank Field Name"
                      hint="You must create a Number Field with this label and type integer in the Content-Type Builder"
                      name="content"
                      onChange={e => {
                        setSettings({
                          ...settings,
                          rank: e.target.value,
                        })
                      }}
                      value={settings.rank}
                      labelAction={
                        <Tooltip description="Field which is used for ordering content-type entries">
                          <button aria-label="Information about the email" style={{
                            border: 'none',
                            padding: 0,
                            background: 'transparent'
                          }}>
                            <Information aria-hidden={true} />
                          </button>
                        </Tooltip>
                      } />
                  </Box>
                </GridItem>
                <GridItem col={6} s={12}>
                  <Box padding={0}>
                    <TextInput
                      placeholder="Title"
                      label="Title Field Name"
                      hint="You must create a Short Text Field with this label in the Content-Type Builder"
                      name="content"
                      onChange={e => {
                        setSettings({
                          ...settings,
                          title: e.target.value,
                        })
                      }}
                      value={settings.title}
                      labelAction={
                        <Tooltip description="Field that will show up in the drag drop menu">
                          <button aria-label="Information about the email" style={{
                            border: 'none',
                            padding: 0,
                            background: 'transparent'
                          }}>
                            <Information aria-hidden={true} />
                          </button>
                        </Tooltip>
                      } />
                  </Box>
                </GridItem>
              </Grid>
            </Stack>
          </Box>
        </ContentLayout>
      )}
    </>
  );
};

export default Settings;