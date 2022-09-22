import React, { useState, useEffect } from 'react';

import { useCMEditViewDataManager } from '@strapi/helper-plugin';

import axiosInstance from '../../utils/axiosInstance';

import { Box, Typography, Divider, Checkbox, Stack, Flex, Icon } from '@strapi/design-system';

import Plus from '@strapi/icons/Plus';

import TaskModal from '../TaskModal';

import DragSortableList from 'react-drag-sortable'


function useRelatedTasks() {
  const { initialData, isSingleType, slug } = useCMEditViewDataManager();

  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('loading');
  const [settings, setSettings] = useState(false);

  const fetchSettings = async () => {
    try {
      const { data } = await axiosInstance.get(`drag-drop-content-types/settings`);
      setSettings(data.disabled);
    } catch (e) {
      console.log(e);
    }
  };

  const refetchTasks = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/content-manager/${isSingleType ? 'single-types' : 'collection-types'}/${slug}/${isSingleType ? '' : initialData.id
        }?populate=tasks`
      );

      setTasks(data.tasks);
      setStatus('success');
    } catch (e) {
      setStatus('error');
    }
  };

  useEffect(() => {
    fetchSettings();
    refetchTasks();
  }, [initialData, isSingleType, axiosInstance, setTasks, setStatus, setSettings]);

  return { status, tasks, refetchTasks, fetchSettings, settings };
}

const TodoCard = () => {
  const { status, tasks, refetchTasks, settings } = useRelatedTasks();
  const [createModalIsShown, setCreateModalIsShown] = useState(false);

  const toggleTask = async (taskId, isChecked) => {
    // Update task in database
    await axiosInstance.put(`/content-manager/collection-types/plugin::drag-drop-content-types.task/${taskId}`, {
      isDone: isChecked,
    });
    // Call API to update local cache
    await refetchTasks();
  };

  const showTasks = () => {
    // Loading state
    if (status === 'loading') {
      return <p>Fetching todos...</p>;
    }

    // Error state
    if (status === 'error') {
      return <p>Could not fetch tasks.</p>;
    }

    // Empty state
    if (tasks == null || tasks.length === 0) {
      return <p>No todo yet.</p>;
    }

    // Success state, show all tasks
    return tasks.map(task => (
      <>
        <Checkbox
          value={task.isDone}
          onValueChange={isChecked => toggleTask(task.id, isChecked)}
          key={task.id}
          disabled={task.isDone && settings ? true : false}
        >
          <span
            style={{
              textDecoration: task.isDone && settings == false ? 'line-through' : 'none',
              backgroundColor: 'red',
            }}
          >
            {task.name}
          </span>
        </Checkbox>
      </>
    ));
  };

  var placeholder = (
    <div className="placeholderContent"> DROP HERE ! </div>
  );

  var list = [
    { content: (<span style={{color: 'white'}}>test1</span>), classes: ['test', 'bigger'] },
    { content: (<span style={{color: 'white'}}>test2</span>), classes: ['test'] },
    { content: (<span style={{color: 'white'}}>test3</span>), classes: ['test'] },
    { content: (<span style={{color: 'white'}}>test4</span>), classes: ['test', 'bigger'] }
  ];

  var listHorizontal = [
    { content: (<div>test1</div>), classes: ['bigger'] },
    { content: (<div>test2</div>) },
    { content: (<div>test3</div>), classes: ['bigger'] },
    { content: (<div>test4</div>) }
  ];

  var listGrid = [
    { content: (<div>test1</div>) },
    { content: (<div>test2</div>) },
    { content: (<div>test3</div>) },
    { content: (<div>test4</div>) },
    { content: (<div>test5</div>) },
    { content: (<div>test6</div>) },
    { content: (<div>test7</div>) },
    { content: (<div>test8</div>) },
    { content: (<div>test9</div>) }
  ];

  var onSort = function (sortedList) {
    console.log("sortedList", sortedList);
  }

  return (
    <>
      {createModalIsShown && (
        <TaskModal handleClose={() => setCreateModalIsShown(false)} refetchTasks={refetchTasks} />
      )}
      <Box
        as="aside"
        aria-labelledby="additional-informations"
        background="neutral0"
        borderColor="neutral150"
        hasRadius
        paddingBottom={4}
        paddingLeft={4}
        paddingRight={4}
        paddingTop={3}
        shadow="tableShadow"
      >
        <Typography variant="sigma" textColor="neutral600" id="additional-informations">
          Todos
        </Typography>
        <Box paddingTop={2} paddingBottom={6}>
          <Box paddingBottom={2}>
            <Divider />
          </Box>
          <Typography
            fontSize={2}
            textColor="primary600"
            as="button"
            type="button"
            onClick={() => setCreateModalIsShown(true)}
          >
            <Flex>
              <Icon as={Plus} color="primary600" marginRight={2} width={3} height={3} />
              Add todos
            </Flex>
          </Typography>

          <div>

            <DragSortableList items={list} moveTransitionDuration={0.3} onSort={onSort} type="vertical" />
            <DragSortableList items={listHorizontal} moveTransitionDuration={0.3} dropBackTransitionDuration={0.3} placeholder={placeholder} onSort={onSort} type="horizontal" />
            <DragSortableList items={listGrid} dropBackTransitionDuration={0.3} onSort={onSort} type="grid" />
          </div>
          <br></br>
          <br></br>
          <br></br>
          <Stack paddingTop={3} size={2}>
            {showTasks()}
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default TodoCard;