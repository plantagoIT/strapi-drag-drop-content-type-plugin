export const GET_DATA = 'ContentManager/ListView/GET_DATA';
export const GET_DATA_SUCCEEDED = 'ContentManager/ListView/GET_DATA_SUCCEEDED';

export function getData(uid, params) {
  return {
    type: GET_DATA,
    uid,
    params,
  };
}

export function getDataSucceeded(count, data) {
  return {
    type: GET_DATA_SUCCEEDED,
    count,
    data,
  };
}