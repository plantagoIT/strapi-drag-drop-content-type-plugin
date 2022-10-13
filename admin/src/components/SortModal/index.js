import React, { useState, useEffect } from 'react';

import axiosInstance from '../../utils/axiosInstance';

import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import { SimpleMenu, MenuItem } from '@strapi/design-system/SimpleMenu';
import { IconButton } from '@strapi/design-system/IconButton';
import { Icon } from '@strapi/design-system/Icon';
import Drag from '@strapi/icons/Drag';
import Layer from '@strapi/icons/Layer';

const SortModal = () => {

  const [active, setActive] = useState(false);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState('loading');
  const [settings, setSettings] = useState();

  // Shorten string to prevent line break
  const shortenString = (string) => {
    if (string.length > 40) {
      return string.substring(0, 37) + "..."
    }
    return string
  }

  // Fetch settings from configuration
  const fetchSettings = async () => {
    try {
      const { data } = await axiosInstance.get(`/drag-drop-content-types/settings`);
      console.log(data);
      setSettings(data.body);
    } catch (e) {
      console.log(e);
    }
  };

  // Check database if the desired fields are available
  // TODO: check field integrity 
  const initializeContentType = async () => {
    try {
      if (settings) {
        const { data } = await axiosInstance.get(
          `/content-manager/collection-types/${contentTypePath}?sort=rank:asc`
        );
        console.log(data.results)
        if (data.results.length > 0 && !!toString(data.results[0][settings.rank]) && !!data.results[0][settings.title]) {
          setActive(true);
        }
      }
    } catch (e) {
      console.log(e);
      setStatus('error');
    }
  }

  // Fetch data from the database via get request
  const fetchContentType = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/content-manager/collection-types/${contentTypePath}?sort=rank:asc`
      );
      setStatus('success');
      // Iterate over all results and append them to the list
      let list = [];
      for (let i = 0; i < data.results.length; i++) {
        list.push({
          content: (<MenuItem ><Icon height={"0.6rem"} as={Drag} />&nbsp;<span title={data.results[i][settings.title]}>{shortenString(data.results[i][settings.title])}</span></MenuItem>), strapiId: data.results[i].id
        });
      }
      setData(data.results);
    } catch (e) {
      console.log(e);
      setStatus('error');
    }
  };

  // Update all ranks via put request.
  const updateContentType = async (sortedList) => {
    try {
      // Increase performance by breaking loop after last element having a rank change is updated

      let rankHasChanged = false
      // Iterate over all results and append them to the list
      for (let i = 0; i < sortedList.length; i++) {
        // Only update changed values
        if (previousSortedList.length == 0 || previousSortedList[i].strapiId != sortedList[i].strapiId) {
          // Update rank via put request
          await axiosInstance.put(`/drag-drop-content-types/sort-update/${sortedList[i].strapiId}`, {
            contentType: contentTypePath,
            rank: sortedList[i].rank,
          });
          rankHasChanged = true;
        } else if (rankHasChanged) {
          break;
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
    const SortableItem = SortableElement(({ value }) => (
      <MenuItem ><Icon height={"0.6rem"} as={Drag} />&nbsp;<span title={value[settings.title]}>{shortenString(value[settings.title])}</span></MenuItem>
    ));
    const SortableList = SortableContainer(({ items }) => {
      return (
        <ul>
          {data.map((value, index) => (
            <SortableItem style={{ zIndex: 10 }} key={`item-${value}`} index={index} value={value} />
          ))}
        </ul>
      );
    });

    return (
      <>
        <SimpleMenu
          as={IconButton}
          icon={<Layer />}
          onClick={() => { fetchContentType() }}
        >
          <SortableList items={SortableList} onSortEnd={updateContentType} />
        </SimpleMenu>
      </>
    )
  }

  // Fetch settings on page render
  useEffect(() => {
    fetchSettings();
  }, [])

  // Update view when settings change
  useEffect(() => {
    initializeContentType();
  }, [settings])

  // Get content type from url
  const paths = window.location.pathname.split('/')
  const contentTypePath = paths[paths.length - 1]

  // Store the drag and drop lists previous value to increase update performance
  let previousSortedList = []

  return (
    <>
      {showMenu()}
    </>
  );
};

export default SortModal;