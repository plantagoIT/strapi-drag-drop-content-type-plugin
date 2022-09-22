import React, { useState, useEffect } from 'react';

import axiosInstance from '../../utils/axiosInstance';

import DragSortableList from 'react-drag-sortable'
import { SimpleMenu, MenuItem } from '@strapi/design-system/SimpleMenu';

const SortModal = () => {

  const [foo, setFoo] = useState([]);
  const [status, setStatus] = useState('loading');

  // Fetch data from the database via get request
  const fetchFoo = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/content-manager/collection-types/api::foo.foo`
      );

      setStatus('success');
      // Iterate over all results and append them to the list
      let list = [];
      for (let i = 0; i < data.results.length ; i++){
        list.push({
          content: (<MenuItem>{data.results[i].Bar}</MenuItem>), strapiId: data.results[i].id
        });
      }
      setFoo(list);
    } catch (e) {
      console.log(e);
      setStatus('error');
    }
  };

  const updateFoo = async (sortedList) => {
    try {
      // Iterate over all results and append them to the list
      for (let i = 0; i < sortedList.length ; i++){
        await axiosInstance.put(`/drag-drop-content-types/sort-update/${sortedList[i].strapiId}`, {
          rank: sortedList[i].rank,
        });
      }
      setStatus('success');
    } catch (e) {
      console.log(e);
      setStatus('error');
    }
  };



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

  var onSort = function (sortedList) {
    console.log("sortedList", sortedList);
    updateFoo(sortedList);
  }
  const Label = <>Order</>;

  return (
    <>
      <SimpleMenu 
      label={Label}
      onClick={() => {fetchFoo()}}
      >
        <DragSortableList items={foo} moveTransitionDuration={0.3} onSort={onSort} type="vertical" />
      </SimpleMenu>
    </>
  );
};

export default SortModal;