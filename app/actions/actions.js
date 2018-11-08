import * as types from './types';

export function beginRefreshCache() {
  return { type: types.REFRESH_CACHE };
}

export function refreshCacheSuccess(json) {
  return { type: types.REFRESH_CACHE_SUCCESS, json };
}

export function refreshCacheError() {
  return { type: types.REFRESH_CACHE_ERROR };
}

export function refreshCache() {
  return dispatch => {
    dispatch(beginRefreshCache());

    fetch('/refreshInstanceCache', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((json) => {
      if (json.lastCached) {
        dispatch(refreshCacheSuccess(json));
      } else {
        dispatch(refreshCacheError());
      }
    })
    .catch((error) => {
      console.log(error);
      dispatch(refreshCacheError());
    });
  };
}
