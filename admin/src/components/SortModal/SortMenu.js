import {
  Button,
  Divider,
  Icon,
  IconButton,
  MenuItem,
  Popover,
} from '@strapi/design-system';
import { Drag } from '@strapi/icons';
import React, { useState } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import {
  SortMenuProps,
  SortableItemProps,
  SortableListProps,
} from './types.d.js';
import { getSubtitle, getTitle } from './utils';

/**
 *
 * @type {React.ComponentType<import("prop-types").InferProps<typeof SortableItemProps>>}
 * @returns {React.ReactElement}
 */
const SortableItem = SortableElement(({ title, subtitle }) => {
  return (
    <MenuItem
      style={{ zIndex: 10, cursor: 'all-scroll', userSelect: 'none' }}
      onClick={(e) => {
        e.preventDefault();
      }}
      href={undefined}
      to={undefined}
    >
      <div
        style={{
          overflowX: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        <Icon height={'0.6em'} as={Drag} />
        &nbsp;
        <span title={title}>
          {title}
          {subtitle}
        </span>
      </div>
    </MenuItem>
  );
});

SortableItem.propTypes = SortableItemProps;

/**
 *
 * @type {React.ComponentType<import("prop-types").InferProps<typeof SortableListProps>>}
 * @returns {React.ReactElement}
 */
const SortableList = SortableContainer(
  ({ items, onShowMore, hasMore, settings }) => {
    const { title, subtitle, mainField } = settings;

    return (
      <div style={{ maxWidth: '280px' }}>
        <ul>
          {items.map((value, index) => (
            <SortableItem
              key={`item-${value.id}`}
              index={index}
              sortIndex={index}
              title={getTitle(value, title, mainField)}
              subtitle={getSubtitle(value, subtitle, title)}
            />
          ))}
        </ul>
        <Divider unsetMargin={false} />
        <Button size="S" disabled={hasMore ? true : false} onClick={onShowMore}>
          Show more
        </Button>
      </div>
    );
  }
);

SortableList.propTypes = SortableListProps;

/**
 *
 * @type {React.FC<import("prop-types").InferProps<typeof SortMenuProps>>}
 * @returns {React.ReactElement}
 */
function SortMenu({ status, items, onSortEnd, onShowMore, hasMore, settings }) {
  const [visible, setVisible] = useState(false);
  const buttonRef = React.useRef(null);
  const togglePortal = React.useCallback(() => {
    setVisible((prev) => !prev);
  }, []);

  const handleClose = React.useCallback((event) => {
    if (
      event?.target?.id !== 'drag-drop-content-type-plugin--sort-menu-button'
    ) {
      setVisible(false);
    }
  }, []);

  return (
    // Only show menu when the content type has needed fields
    <React.Fragment>
      <IconButton
        id="drag-drop-content-type-plugin--sort-menu-button"
        ref={buttonRef}
        variant="secondary"
        disabled={status === 'success' ? false : true}
        icon={<Drag />}
        onClick={togglePortal}
        label="Sort"
      />
      {visible && (
        <Popover
          label="Sort"
          //as={IconButton}
          //icon={<Layer />}
          //aria-label="Sort via drag and drop"
          // onOpen={onOpen}
          id={'drag-drop-content-type-plugin--sort-menu'}
          source={buttonRef}
          spacing={4}
          fullWidth={false}
          centered={false}
          placement={'bottom-end'}
          onEscapeKeyDown={handleClose}
          onPointerDownOutside={handleClose}
          onDismiss={undefined}
          // onDismiss={undefined}
        >
          <SortableList
            items={items}
            onShowMore={onShowMore}
            onSortEnd={onSortEnd}
            hasMore={hasMore}
            settings={settings}
          />
        </Popover>
      )}
    </React.Fragment>
  );
}

SortMenu.propTypes = SortMenuProps;

export default SortMenu;
