import React, { useState, useEffect } from 'react';

import axiosInstance from '../../utils/axiosInstance';

import DragSortableList from 'react-drag-sortable'

import { SimpleMenu, MenuItem } from '@strapi/design-system/SimpleMenu';
import { IconButton } from '@strapi/design-system/IconButton';
import { Icon } from '@strapi/design-system/Icon';
import Drag from '@strapi/icons/Drag';
import Layer from '@strapi/icons/Layer';

const SortModal = () => {

  const [active, setActive] = useState(false);
  const [foo, setFoo] = useState([]);
  const [status, setStatus] = useState('loading');
  const [settings, setSettings] = useState('loading');

  // Shorten string to prevent line break
  const shortenString = (string) => {
    if (string.length > 40){
      return string.substring(0, 37) + "..."
    }
    return string
  }

  // Fetch settings from configuration
  const fetchSettings = async () => {
    try {
      const { data } = await axiosInstance.get(`drag-drop-content-types/settings`);
      setSettings(data.body);
      console.log(settings);
    } catch (e) {
      console.log(e);
    }
  };

  // Check database if the desired fields are available
  // TODO: check field integrity 
  const initializeFoo = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/content-manager/collection-types/${contentType}?sort=rank:asc`
      );
      if (!!toString(data.results[0].rank) && !!data.results[0].Bar) {
        setActive(true);
      }
    } catch (e) {
      console.log(e);
      setStatus('error');
    }
  }

  // Fetch data from the database via get request
  const fetchFoo = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/content-manager/collection-types/${contentType}?sort=rank:asc`
      );
      setStatus('success');
      // Iterate over all results and append them to the list
      let list = [];
      for (let i = 0; i < data.results.length; i++) {
        list.push({
          content: (<MenuItem ><Icon height={"0.6rem"} as={Drag} />&nbsp;<span title={data.results[i].Bar}>{shortenString(data.results[i].Bar)}</span></MenuItem>), strapiId: data.results[i].id
        });
      }
      setFoo(list);
    } catch (e) {
      console.log(e);
      setStatus('error');
    }
  };
  
  // Update all ranks via put request.
  const updateFoo = async (sortedList) => {
    try {
      // Iterate over all results and append them to the list
      for (let i = 0; i < sortedList.length; i++) {
        // Only update changed values
        if (previousSortedList[i] && previousSortedList[i].strapiId != sortedList[i].strapiId){
          // Update rank via put request
          await axiosInstance.put(`/drag-drop-content-types/sort-update/${sortedList[i].strapiId}`, {
            contentType: contentType,
            rank: sortedList[i].rank,
          });
        }
      }
      // Store the state of the list to increase update performance
      // TODO: Currently on the first event all entries are updated, 
      //       since there is no previous list available. 
      //       Get an initial state when first loading page.
      previousSortedList = sortedList;
      setStatus('success');
    } catch (e) {
      console.log(e);
      setStatus('error');
    }
  };

  // Render the menu
  const showMenu = () => {
    if (!active) {
      return
    }
    return (
      <>
        <SimpleMenu
          as={IconButton}
          icon={<Layer />}
          onClick={() => { fetchFoo() }}
        >
          <DragSortableList items={foo} moveTransitionDuration={0.3} onSort={updateFoo} type="vertical" />
        </SimpleMenu>
      </>
    )
  }


  var listHorizontal = [
    { content: (<div style={{ color: 'white' }}>test1</div>), classes: ['bigger'] },
    { content: (<div style={{ color: 'white' }}>test2</div>) },
    { content: (<div style={{ color: 'white' }}>test3</div>), classes: ['bigger'] },
    { content: (<div style={{ color: 'white' }}>test4</div>) }
  ];

  var listGrid = [
    { content: (<div style={{ color: 'white' }}>test1</div>) },
    { content: (<div style={{ color: 'white' }}>test2</div>) },
    { content: (<div style={{ color: 'white' }}>test3</div>) },
    { content: (<div style={{ color: 'white' }}>test4</div>) },
  ];

  // Get content type from url
  const paths = window.location.pathname.split('/')
  const contentType = paths[paths.length - 1]
  // Store the drag and drop lists previous value to increase update performance
  let previousSortedList = []

  useEffect(() => {
    fetchSettings();
    initializeFoo();
  }, [])

  return (
    <>
      {showMenu()}
    </>
  );
};

export default SortModal;