import * as types from '../actions/types';

export default function lastCached(state = {}, action) {
  switch (action.type) {
    case types.REFRESH_CACHE_SUCCESS:
      return action.json;
    default:
      return state;
  }
}
