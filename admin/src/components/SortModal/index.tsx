import { arrayMoveImmutable } from 'array-move';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFetchClient, useNotification, useAPIErrorHandler } from '@strapi/strapi/admin';

import { getData, getDataSucceeded } from '../../utils/strapi';
import { useQueryParams } from '../../utils/useQueryParams';
import pluginPermissions from '../../permissions';
import { ContentTypeConfigResponse, ContentTypeResponse, FetchedSettings, GetPageEntriesResponse, Pagination, QueryParams, UpdateContentTypeParams } from './types';
import { PluginSettingsResponse } from '../../../../typings';
import SortMenu from './SortMenu';

const SortModal = () => {
    const { get, post, put } = useFetchClient();

    const [data, setData] = useState<GetPageEntriesResponse[]>([]);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [pageSize, setPageSize] = useState(10);
    const [pagination, setPagination] = useState<Pagination>();
    const [status, setStatus] = useState('loading');
    const [mainField, setMainField] = useState('id');
    const [uid, setUid] = useState<string | null>(null);
    const [settings, setSettings] = useState<FetchedSettings>({
        rank: '',
        title: '',
        subtitle: '',
        mainField: null,
    });
    const [noEntriesFromNextPage, setNoEntriesFromNextPage] = useState(0);

    const { queryParams } = useQueryParams();
    const dispatch = useDispatch();

    const { toggleNotification } = useNotification();
    const { formatAPIError } = useAPIErrorHandler();

    // Get content type from url
    const paths = window.location.pathname.split('/');
    const contentTypePath = paths[paths.length - 1];

    const params = queryParams as unknown as QueryParams;
    const pageSize = parseInt(params?.pageSize) ?? 0;
    const currentPage = parseInt(params?.page) ?? 0;

    // Get locale from query params
    const locale = params?.['plugins[i18n][locale]'];

    const listIncrementSize = pageSize ? pageSize / 2 : 1;
    const hasMore = noEntriesFromNextPage
        ? noEntriesFromNextPage + listIncrementSize >= data?.length - 1
        : false;

    // Show loading symbol after refetching the entries
    const refetchEntries = React.useCallback(
        () => dispatch(getData(uid, undefined)),
        [dispatch]
    );

    // Use strapi hook to reorder list after drag and drop
    const refetchEntriesSucceeded = React.useCallback(
        (pagination: Pagination, newData: GetPageEntriesResponse[]) => {
            dispatch(getDataSucceeded(pagination, newData));
        },
        [dispatch, pagination, data]
    );

    // Fetch content type config settings
    const fetchContentTypeConfig = async () => {
        // TODO: tie this in with middleware with the request that is already being made on page load
        try {
            const { data } = await get<ContentTypeConfigResponse>(
                `/content-manager/content-types/${contentTypePath}/configuration`
            );
            const settings = data.data.contentType?.settings;
            setMainField(settings.mainField);
            setUid(data.data.contentType?.uid);
            // setPageSize(settings.pageSize);
            setNoEntriesFromNextPage(settings.pageSize / 2);
        } catch (e) {
            console.log(e);
        }
    };

    // Fetch settings from configuration
    const fetchSettings = async () => {
        try {
            const { data } = await get<PluginSettingsResponse>(`/drag-drop-content-types/settings`);
            let fetchedSettings = {
                rank: data.body.rank,
                title: data.body.title?.length > 0 ? data.body.title : mainField,
                subtitle: data.body.subtitle?.length > 0 ? data.body.subtitle : null,
                mainField,
            };
            setSettings(fetchedSettings);
        } catch (e) {
            console.log(e);
        }
    };

    // Fetch page entries from the sort controller
    const getPageEntries = async () => {
        if (pageSize) {
            const sortIndexParam = {
                contentType: contentTypePath,
                rankFieldName: settings.rank,
                start: Math.max(
                    0,
                    (currentPage - 1) * pageSize - noEntriesFromNextPage
                ),
                limit:
                    currentPage === 1
                        ? pageSize + noEntriesFromNextPage
                        : pageSize + 2 * noEntriesFromNextPage,
                locale: locale,
            };
            const results = await post<GetPageEntriesResponse[]>(`/drag-drop-content-types/sort-index`, sortIndexParam);
            return results;
        }
    };

    // Check database if the desired fields are available
    // TODO: check field integrity
    const initializeContentType = async () => {
        try {
            if (settings?.rank) {
                const entries = await getPageEntries();
                if (entries?.data?.length) {
                    const firstEntry = entries.data[0];
                    const firstEntryRank = (firstEntry as any)[settings.rank];
                    if (entries.data?.length > 0 && firstEntryRank && !!firstEntryRank.toString()) {
                        setStatus('success');
                    }
                }
            }
        } catch (e) {
            console.log('Could not initialize content type', e);
            setStatus('error');
        }
    };

    // Fetch data from the database via get request
    const fetchContentType = async () => {
        try {
            const entries = await getPageEntries();
            if (entries?.data?.length) {
                setStatus('success');
                setData(entries.data);

                // TODO: remove this line and get pagination from elsewhere
                const { data } = await get<ContentTypeResponse>(
                    `/content-manager/collection-types/${contentTypePath}?sort=${settings.rank}:asc&page=${currentPage}&pageSize=${pageSize}&locale=${locale}`
                );
                setPagination(data.pagination);
            }
        } catch (e) {
            console.log('Could not fetch content type', e);
            setStatus('error');
        }
    };

    // Update all ranks via put request.
    const updateContentType = async (item: UpdateContentTypeParams) => {
        const { oldIndex, newIndex } = item;
        try {
            // Increase performance by breaking loop after last element having a rank change is updated
            const sortedList = arrayMoveImmutable(data, oldIndex, newIndex);
            const rankUpdates = [];
            let rankHasChanged = false;
            // Iterate over all results and append them to the list
            for (let i = 0; i < sortedList.length; i++) {
                // Only update changed values
                if (sortedList[i].id != data[i].id) {
                    const newRank = pageSize * (currentPage - 1) + i || 0;
                    const update = {
                        id: sortedList[i].id,
                        rank: newRank,
                    };
                    rankUpdates.push(update);
                    rankHasChanged = true;
                } else if (rankHasChanged) {
                    break;
                }
            }

            // Batch Update DB with new ranks
            await put('/drag-drop-content-types/batch-update', {
                contentType: contentTypePath,
                updates: rankUpdates,
            });

            // distinguish last page from full/first page
            let sortedListViewEntries =
                currentPage == 1
                    ? sortedList.slice(0, pageSize)
                    : sortedList.length < pageSize
                        ? sortedList.slice(noEntriesFromNextPage, sortedList.length)
                        : sortedList.slice(
                            noEntriesFromNextPage,
                            pageSize + noEntriesFromNextPage
                        );
            // set new sorted data (refresh UI list component)
            setData(sortedList);
            setStatus('success');
            afterUpdate(sortedListViewEntries, pagination);
        } catch (e: any) {
            console.log('Could not update content type:', e);
            toggleNotification({
                type: 'warning',
                message: formatAPIError(e)
            });
            setStatus('error');
        }
    };

    // Actions to perform after sorting is successful
    const afterUpdate = (newData: GetPageEntriesResponse[], pagination?: Pagination) => {
        // Avoid full page reload and only re-render table.
        refetchEntries();
        if(pagination)
            refetchEntriesSucceeded(pagination, newData);
    };

    const showMoreHandler = () => {
        setNoEntriesFromNextPage(noEntriesFromNextPage + listIncrementSize);
    };

    // Fetch content-type on page render
    useEffect(() => {
        fetchContentTypeConfig();
        console.log('fetchContentTypeConfig');
    }, []);

    // Fetch settings when mainField changes
    useEffect(() => {
        fetchSettings();
    }, [mainField]);

    // Update view when settings change
    useEffect(() => {
        if (settings?.rank) {
            initializeContentType();
        }
    }, [settings]);

    // Update menu when loading more elements
    useEffect(() => {
        if (settings?.rank && pageSize && currentPage) {
            fetchContentType();
        }
    }, [noEntriesFromNextPage, locale, pageSize, currentPage, settings]);

    // Sync entries in sort menu to match current page of ListView when content-manager page changes
    // useEffect(() => {
    //   if (params?.page) {
    //     const page = parseInt(params?.page);
    //     const pageSize = parseInt(params?.pageSize);

    //     setCurrentPage(page);
    //     setPageSize(pageSize);
    //   }
    // }, [params?.page, params?.pageSize]);

    return (
        // <CheckPermissions permissions={pluginPermissions.main}>
            <SortMenu
                data={data}
                status={status}
                onOpen={fetchContentType}
                onSortEnd={updateContentType}
                onShowMore={showMoreHandler}
                hasMore={hasMore}
                settings={settings}
            />
        // </CheckPermissions>
    );

}

export default SortModal;