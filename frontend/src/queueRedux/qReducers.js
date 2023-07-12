import { FETCH_QUEUE_MESSAGES_FAILURE, FETCH_QUEUE_MESSAGES_REQUEST, FETCH_QUEUE_MESSAGES_SUCCESS } from "./qConstants";
const initialState = {
    messages: [],
    state: '',
    queue: {
      name: '',
      messageCount: 0,
      consumerCount: 0,
    },
    loading: false,
    error: null,
  };
  
  // Queue reducer
 export const queueReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_QUEUE_MESSAGES_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case FETCH_QUEUE_MESSAGES_SUCCESS:
        return {
          ...state,
          loading: false,
          messages: action.payload.messages,
          state: action.payload.state,
          queue: action.payload.queue,
        };
      case FETCH_QUEUE_MESSAGES_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  