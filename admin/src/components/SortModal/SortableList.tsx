import React, { useState } from 'react';
import { GetPageEntriesResponse, SortableListProps } from "./types";
import { Divider, Button, Box } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { getTranslation as getTrad } from '../../utils/getTranslation';

import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    TouchSensor,
    closestCenter
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
} from "@dnd-kit/sortable"
import SortableListItem from './SortableListItem';
import { getSubtitle, getTitle } from './utils';
import { TItem } from './CustomItem';

const SortableList = ({ data, onShowMore, hasMore, settings, onSortEnd }: SortableListProps) => {
    const { formatMessage } = useIntl();

    let { title, subtitle, mainField } = settings;
    subtitle = subtitle ?? "";
    mainField = mainField ?? "";

    const convertDataItem = (pageEntry: GetPageEntriesResponse) => {
        return {
            ...pageEntry,
            title: getTitle(pageEntry, title, mainField),
            subtitle: getSubtitle(pageEntry, subtitle, title),
        };
    }
    const defaultItems = data.map(x => convertDataItem(x));
    const [items, setItems] = useState<TItem[]>(defaultItems);
    if (items.length !== defaultItems.length)
        setItems(defaultItems);

    // for drag overlay
    const [activeItem, setActiveItem] = useState<TItem>();

    // for input methods detection
    const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

    // triggered when dragging starts
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveItem(items.find((item) => item.id === active.id));
    }

    // triggered when dragging ends
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeItem = items.find((item) => item.id === active.id);
        const overItem = items.find((item) => item.id === over.id);

        if (!activeItem || !overItem) {
            return;
        }

        const activeIndex = items.findIndex((item) => item.id === active.id);
        const overIndex = items.findIndex((item) => item.id === over.id);

        if (activeIndex !== overIndex) {
            setItems((prev) => arrayMove<TItem>(prev, activeIndex, overIndex))
        }
        setActiveItem(undefined);
        onSortEnd({ oldIndex: activeIndex, newIndex: overIndex });
    }

    const handleDragCancel = () => {
        setActiveItem(undefined);
    }

    return (
        <div style={{ maxWidth: '280px' }}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <SortableContext items={items}>
                    {items.map((item) => (
                        <SortableListItem key={item.id} item={item} />
                    ))}
                </SortableContext>
            </DndContext>
            <Divider margin={0} />
            <Box padding={1}>
                <Button size="S" disabled={hasMore ? true : false} onClick={onShowMore}>
                    {formatMessage({ id: getTrad("plugin.settings.sortableList.showMore") })}
                </Button>
            </Box>
        </div>
    );
}

export default SortableList;