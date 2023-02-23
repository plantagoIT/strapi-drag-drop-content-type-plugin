import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getData, getDataSucceeded } from "@strapi/admin/admin/src/content-manager/pages/ListView/actions";
import axiosInstance from "../../utils/axiosInstance";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import { useQueryParams } from "../../utils/useQueryParams";
import { Button, Divider } from '@strapi/design-system';
import { SimpleMenu, MenuItem } from "@strapi/design-system/SimpleMenu";
import { IconButton } from "@strapi/design-system/IconButton";
import { Icon } from "@strapi/design-system/Icon";
import Drag from "@strapi/icons/Drag";
import Layer from "@strapi/icons/Layer";

const SortModal = () => {
	const [data, setData] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState();
	const [pagination, setPagination] = useState();
	const [status, setStatus] = useState("loading");
	const [mainField, setMainField] = useState('id');
	const [settings, setSettings] = useState();
	const [noEntriesFromNextPage, setNoEntriesFromNextPage] = useState();

	// TODO: Refactor get queryParams to hook
	const [params] = useQueryParams();

	const dispatch = useDispatch();

	// Show loading symbol after refetching the entries
	const refetchEntries = React.useCallback(
		() => dispatch(getData()),
		[dispatch]
	);

	// Use strapi hook to reorder list after drag and drop
	const refetchEntriesSucceeded = React.useCallback(
		(pagination, newData) =>
			dispatch(getDataSucceeded(pagination, newData)),
		[dispatch, pagination, data]
	);

	// Fetch content type config settings
	const fetchContentTypeConfig = async () => {
		// TODO: tie this in with middleware with the request that is already being made on page load
		try {
			const { data } = await axiosInstance.get(
				`/content-manager/content-types/${contentTypePath}/configuration`
			);
			setMainField(data.data.contentType.settings.mainField);
			setPageSize(data.data.contentType.settings.pageSize);
			setNoEntriesFromNextPage(data.data.contentType.settings.pageSize / 2);
		} catch (e) {
			console.log(e);
		}
	};

	// Fetch settings from configuration
	const fetchSettings = async () => {
		try {
			const { data } = await axiosInstance.get(
				`/drag-drop-content-types/settings`
			);
			let fetchedSettings = {
				rank: data.body.rank,
				title: data.body.title.length > 0 ? data.body.title : mainField
			}
			setSettings(fetchedSettings);
		} catch (e) {
			console.log(e);
		}
	};

	// Fetch page entries from the sort controller
	const getPageEntries = async () => {
		console.log("PAGIN",currentPage == 1, noEntriesFromNextPage,  pageSize, pageSize + noEntriesFromNextPage,  pageSize + 2 * noEntriesFromNextPage, )
		return await axiosInstance.post(
			`/drag-drop-content-types/sort-index`,
			{
				contentType: contentTypePath,
				rankFieldName: settings.rank,
				start: Math.max(0, (currentPage - 1) * pageSize - noEntriesFromNextPage),
				limit: currentPage == 1 ? pageSize + noEntriesFromNextPage : pageSize + 2 * noEntriesFromNextPage,
				locale: locale,
			}
		);
	}

	// Check database if the desired fields are available
	// TODO: check field integrity
	const initializeContentType = async () => {
		try {
			if (settings) {
				const entries = await getPageEntries()
				if (
					entries.data.length > 0 &&
					!!toString(entries.data[0][settings.rank])
				) {
					setStatus("success");
				}
			}
		} catch (e) {
			console.log(e);
			setStatus("error");
		}
	};

	// Fetch data from the database via get request
	const fetchContentType = async () => {
		try {
			const entries = await getPageEntries();
			setStatus("success");
			setData(entries.data);
			// TODO: remove this line and get pagination from elsewhere
			const { data } = await axiosInstance.get(`/content-manager/collection-types/${contentTypePath}?sort=rank:asc&page=${currentPage}&pageSize=${pageSize}&locale=${locale}`);
			setPagination(data.pagination);
		} catch (e) {
			console.log(e);
			setStatus("error");
		}
	};

	// Update all ranks via put request.
	const updateContentType = async ({ oldIndex, newIndex }) => {
		try {
			// Increase performance by breaking loop after last element having a rank change is updated
			const sortedList = arrayMoveImmutable(data, oldIndex, newIndex);
			const rankUpdates = [];
			let rankHasChanged = false;
			// Iterate over all results and append them to the list
			for (let i = 0; i < sortedList.length; i++) {
				// Only update changed values
				if (sortedList[i].id != data[i].id) {
					const newRank =
						parseInt(pageSize * (currentPage - 1) + i) || 0;
<<<<<<< HEAD
					const update = {
						id: sortedList[i].id,
						rank: newRank,
					};
					rankUpdates.push(update);
=======
					// Update rank via put request
					await axiosInstance.put(
						`/drag-drop-content-types/sort-update/${sortedList[i].id}`,
						{
							contentType: contentTypePath,
							rankFieldName: settings.rank,
							rank: newRank,
						}
					);
>>>>>>> 9c1a9c3 (Sets title and pagination from content-type config)
					rankHasChanged = true;
				} else if (rankHasChanged) {
					break;
				}
			}

			// Batch Update DB with new ranks
			await axiosInstance.put("/drag-drop-content-types/batch-update", {
				contentType: contentTypePath,
				updates: rankUpdates,
			});

			// distinguish last page from full/first page
			let sortedListViewEntries =
				currentPage == 1
					?
					sortedList.slice(0, pageSize)
					:
					sortedList.length < pageSize
						?
						sortedList.slice(noEntriesFromNextPage, sortedList.length)
						:
						sortedList.slice(noEntriesFromNextPage, pageSize + noEntriesFromNextPage)
			// set new sorted data (refresh UI list component)
			setData(sortedList);
			setStatus("success");
			afterUpdate(pagination, sortedListViewEntries);
		} catch (e) {
			console.log(e);
			setStatus("error");
		}
	};

	// Actions to perform after sorting is successful
	const afterUpdate = (pagination, newData) => {
		// Avoid full page reload and only re-render table.
		refetchEntries();
		refetchEntriesSucceeded(pagination, newData);
	};

	// Render the menu
	const showMenu = () => {

		const SortableItem = SortableElement(({ value }) => (
			<MenuItem style={{ zIndex: 10, cursor: "all-scroll" }}>
				<div
					style={{
						overflowX: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
					}}
				>
					<Icon height={"0.6em"} as={Drag} />
					&nbsp;
					<span title={value[settings.title]}>
						{value[settings.title]}
					</span>
				</div>
			</MenuItem>
		));

		const SortableList = SortableContainer(({ items }) => {
			console.log(noEntriesFromNextPage , listIncrementSize, data.length);
			return (
				<div style={{ maxWidth: "280px" }}>
					<ul>
						{items.map((value, index) => (
							<SortableItem
								key={`item-${value.id}`}
								index={index}
								sortIndex={index}
								value={value}
							/>
						))}
					</ul>
					<Divider unsetMargin={false} />
					<Button
						size="S"
						disabled={noEntriesFromNextPage + listIncrementSize >= data.length - 1 ? true : false}
						onClick={() => { setNoEntriesFromNextPage(noEntriesFromNextPage + listIncrementSize) }}
					>Show more</Button>
				</div>
			);
		});
		return (
			// Only show menu when the content type has needed fields
			status == 'success' ?
				<>
					<SimpleMenu
						as={IconButton}
						icon={<Layer />}
						onClick={() => {
							fetchContentType();
						}}
					>
						<SortableList items={data} onSortEnd={updateContentType} />
					</SimpleMenu>
				</>
				:
				<></>
		);
	};

	// Fetch content-type on page render
	useEffect(() => {
		fetchContentTypeConfig();
	}, []);

	// Fetch settings on page render
	useEffect(() => {
		fetchSettings();
	}, [mainField]);

	// Update view when settings change
	useEffect(() => {
		initializeContentType();
	}, [settings]);

	// Update menu when loading more elements
	useEffect(() => {
		if (settings){
			fetchContentType();
		}
	}, [noEntriesFromNextPage])

	// Sync entries in sort menu to match current page of ListView when content-manager page changes
	useEffect(() => {
		if (params?.page) {
			const page = parseInt(params.page);
			const pageSize = parseInt(params.pageSize);

			setCurrentPage(page);
			setPageSize(pageSize);
		}
	}, [params?.page, params?.pageSize]);

	// Get content type from url
	const paths = window.location.pathname.split("/");
	const queryParams = new URLSearchParams(window.location.search);
	const contentTypePath = paths[paths.length - 1];
	const locale = queryParams.get("plugins[i18n][locale]");
	const listIncrementSize = pageSize / 2;

	return <>{showMenu()}</>;
};

export default SortModal;
