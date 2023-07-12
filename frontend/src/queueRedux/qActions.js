import axios from 'axios'
import { FETCH_QUEUE_MESSAGES_FAILURE, FETCH_QUEUE_MESSAGES_REQUEST, FETCH_QUEUE_MESSAGES_SUCCESS, } from './qConstants';
import { Logout } from '../userRedux/userActions'

export const getQueues = (qu) => async (dispatch, getState) => {
  try {
    dispatch({
      type: FETCH_QUEUE_MESSAGES_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`http://localhost:5000/qu/getQueue/${qu}`, config)

    dispatch({
      type: FETCH_QUEUE_MESSAGES_SUCCESS,
      payload: data,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(Logout())
    }
    dispatch({
      type: FETCH_QUEUE_MESSAGES_FAILURE,
      payload: message,
    })
  }
}