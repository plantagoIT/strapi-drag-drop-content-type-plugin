import { GetPageEntriesResponse, Pagination } from "../components/SortModal/types";

export const GET_DATA = 'ContentManager/ListView/GET_DATA';
export const GET_DATA_SUCCEEDED = 'ContentManager/ListView/GET_DATA_SUCCEEDED';

export function getData(uid: any, params: any) {
  return {
    type: GET_DATA,
    uid,
    params,
  };
}

export function getDataSucceeded(pagination: Pagination, data: GetPageEntriesResponse[]) {
  return {
    type: GET_DATA_SUCCEEDED,
    pagination,
    data,
  };
}
