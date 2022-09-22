import React, { useState } from 'react';
import {
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Typography,
  Button,
  TextInput,
} from '@strapi/design-system';

import { useCMEditViewDataManager } from '@strapi/helper-plugin';

import axiosInstance from '../../utils/axiosInstance';

const TaskModal = ({ handleClose, refetchTasks }) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState();

  const { slug, initialData } = useCMEditViewDataManager();

  const handleSubmit = async e => {
    // Prevent submitting parent form
    e.preventDefault();
    e.stopPropagation();

    try {
      // Show loading state
      setStatus('loading');

      // Create task and link it to the related entry
      await axiosInstance.post('/content-manager/collection-types/plugin::drag-drop-content-types.task', {
        name,
        isDone: false,
        related: {
          __type: slug,
          id: initialData.id,
        },
      });

      // Refetch tasks list so it includes the created one
      await refetchTasks();

      // Remove loading and close popup
      setStatus('success');
      handleClose();
    } catch (e) {
      setStatus('error');
    }
  };

  const getError = () => {
    // Form validation error
    if (name.length > 40) {
      return 'Content is too long';
    }
    // API error
    if (status === 'error') {
      return 'Could not create todo';
    }
    return null;
  };

  return (
    <ModalLayout onClose={handleClose} labelledBy="title" as="form" onSubmit={handleSubmit}>
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          Add todo
        </Typography>
      </ModalHeader>
      <ModalBody>
        <TextInput
          placeholder="What do you need to do?"
          label="Name"
          name="text"
          hint="Max 40 characters"
          error={getError()}
          onChange={e => setName(e.target.value)}
          value={name}
        />
      </ModalBody>
      <ModalFooter
        startActions={
          <Button onClick={handleClose} variant="tertiary">
            Cancel
          </Button>
        }
        endActions={
          <Button type="submit" loading={status === 'loading'}>
            {status === 'loading' ? 'Saving...' : 'Save'}
          </Button>
        }
      />
    </ModalLayout>
  );
};

export default TaskModal;