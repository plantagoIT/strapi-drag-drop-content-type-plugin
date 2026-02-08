import React, { useState } from 'react';
import { SortMenuProps } from "./types";
import { IconButton } from '@strapi/design-system';
import { Drag } from '@strapi/icons';
import { Popover } from '@strapi/design-system';
import SortableList from './SortableList';

const SortMenu = ({ status, data, onSortEnd, onShowMore, hasMore, settings, onClose }: SortMenuProps) => {
    const [visible, setVisible] = useState(false);
    const buttonRef = React.useRef(null);
    const togglePortal = React.useCallback(() => {
        setVisible((prev) => !prev);
    }, []);

    const handleClose = React.useCallback((event: any) => {
        if (event?.target?.id !== 'drag-drop-content-type-plugin--sort-menu-button') {
            setVisible(false);
            // Call onClose callback when popover closes
            if (onClose) {
                onClose();
            }
        }
    }, [onClose]);

    return (
        <React.Fragment>
            <Popover.Root>
                <Popover.Trigger>
                    <IconButton
                        id="drag-drop-content-type-plugin--sort-menu-button"
                        ref={buttonRef}
                        variant="secondary"
                        disabled={status === 'success' ? false : true}
                        withTooltip={false}
                        onClick={togglePortal}
                        label="Sort"
                    >
                        <Drag />
                    </IconButton>
                </Popover.Trigger>
                <Popover.Content
                    onEscapeKeyDown={handleClose}
                    onPointerDownOutside={handleClose}
                >
                    <SortableList
                        data={data}
                        onShowMore={onShowMore}
                        onSortEnd={onSortEnd}
                        hasMore={hasMore}
                        settings={settings}
                    />
                </Popover.Content>
            </Popover.Root>
        </React.Fragment>
    );
}

export default SortMenu;