import { TEST_ACTION } from '../constants/ActionTypes';

const initialState = {
  articles: [],
};

function rootReducer(state = initialState, action) {
  if (action.type === TEST_ACTION) {
    return { ...state, articles: state.articles.concat(action.payload) };
  }
  return state;
}

export default rootReducer;
