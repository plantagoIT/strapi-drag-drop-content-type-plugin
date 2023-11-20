import { useEffect, useState } from 'react';

/**
 *
 * @returns {Object} | {}}
 */
export function useQueryParams() {
  const [params, setParams] = useState({});

  useEffect(() => {
    const q = new Proxy(new URLSearchParams(window.location.search), {
      get: (queryParams, prop) => queryParams.get(prop.toString()),
    });
    setParams(q);
  }, [window.location.search]);

  return { queryParams: params };
}
