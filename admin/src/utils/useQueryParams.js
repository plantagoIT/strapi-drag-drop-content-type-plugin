import React, { useState, useEffect } from "react";

export function useQueryParams() {
	const [queryParams, setQueryParams] = useState({});

	useEffect(() => {
		const queryParams = new Proxy(
			new URLSearchParams(window.location.search),
			{
				get: (searchParams, prop) => searchParams.get(prop),
			}
		);
		setQueryParams(queryParams);
		return () => {
			queryParams;
		};
	}, [window.location.search]);

	return [queryParams];
}
