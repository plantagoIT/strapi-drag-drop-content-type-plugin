export interface SortMenuProps {
    status: string;
    data: GetPageEntriesResponse[];
    onOpen: () => void;
    onSortEnd: (item: UpdateContentTypeParams) => void;
    onShowMore: () => void;
    hasMore?: boolean;
    settings: FetchedSettings;
};

export interface SortableListProps {
    data: GetPageEntriesResponse[];
    onShowMore: () => void;
    onSortEnd: (item: UpdateContentTypeParams) => void;
    hasMore?: boolean
    settings: FetchedSettings;
};

export interface SortableListItemProps {
    title?: string;
    subtitle: string;
};

export interface QueryParams {
    pageSize: string;
    page: string;
    'plugins[i18n][locale]': string;
}

export interface Pagination {
    page: number;
    pageCount: number;
    pageSize: number;
    total: number;
}

export interface ContentTypeResponse {
    pagination: Pagination;
    results: { id: number }[];
}

export interface GetPageEntriesResponse {
    id: number;
}

export interface ContentTypeConfigResponse {
    data: {
        contentType: {
            settings: {
                bulkable: boolean;
                defaultSortBy: string;
                defaultSortOrder: string;
                filterable: boolean;
                mainField: string;
                pageSize: number;
                searchable: boolean;
            },
            uid: string;
        }
    }
}

export interface FetchedSettings {
    rank: string;
    title: string;
    subtitle: string | null;
    mainField: string | null;
}

export interface UpdateContentTypeParams {
    oldIndex: number;
    newIndex: number;
}