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
          content: (<MenuItem ><Icon height={"0.6rem"} as={Drag} />&nbsp;{data.results[i].Bar}</MenuItem>), strapiId: data.results[i].id
        });
      }
      setFoo(list);
    } catch (e) {
      console.log(e);
      setStatus('error');
    }
  };

  //
  const updateFoo = async (sortedList) => {
    try {
      // Iterate over all results and append them to the list
      for (let i = 0; i < sortedList.length; i++) {
        await axiosInstance.put(`/drag-drop-content-types/sort-update/${sortedList[i].strapiId}`, {
          contentType: contentType,
          rank: sortedList[i].rank,
        });
      }
      setStatus('success');
    } catch (e) {
      console.log(e);
      setStatus('error');
    }
  };

  const showMenu = () => {
    if (!active) {
      return
    }
    return (
      <>
        <SimpleMenu
          label="Menu"
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

  initializeFoo();

  return (
    <>
      {showMenu()}
    </>
  );
};

export default SortModal;