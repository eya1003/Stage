import axios from 'axios'
import { USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_VERIFY_FAIL, USER_VERIFY_REQUEST, USER_VERIFY_SUCCESS } from './userConstants';

/* 
export const login = (email,password) => async (dispatch)=>{
    try {
        dispatch({
            type:USER_LOGIN_REQUEST
        })
        const config = {
            headers:{
                'Content-Type' : 'application/json'
            }
        }

        const { data } = await axios.post(
            'http://localhost:5000/user/login',
            { email, password },
       
            config
          );

        dispatch({
            type : USER_LOGIN_SUCCESS,
            payload : data
        }) 
        localStorage.setItem('userInfo', JSON.stringify(data))
   
    } catch(error){
      if (error.response && error.response.data.message === 'Invalid Credentials !') {
          dispatch({
              type: USER_LOGIN_FAIL,
              payload: error.response.data.message
          });

    }
}} */
export const login = (email, password) => async (dispatch) => {
    try {
      dispatch({
        type: USER_LOGIN_REQUEST,
      });
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
  
      const { data } = await axios.post(
        'http://localhost:5000/user/login',
        { email, password },
        config
      );
  
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: data,
      });
  
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: USER_LOGIN_FAIL,
        payload: error.response && error.response.data.message
          ? error.response.data.message
          : 'Une erreur s\'est produite lors de la connexion.',
      });
    }
  };
  
  export const Logout = ()=>(dispatch) =>{

    localStorage.removeItem('userInfo')
   
    dispatch({
        type:USER_LOGOUT
    })
    
  }

export const verifyEmail = (emailToken) => async (dispatch)=>{
    let messageSuccess ;  
    try {
          dispatch({
              type:USER_VERIFY_REQUEST
          })
          const config = {
              headers:{
                  'Content-Type' : 'multipart/form-data'
              }
          }
  
          const { data } = await axios.put(
            `http://localhost:5000/user/verify-email/${emailToken}`,
              config
            );
  
         if( dispatch({
              type : USER_VERIFY_SUCCESS,
              payload : data
          })) { return messageSuccess === "MAil VERIFIED "}
          dispatch ({
              type : USER_VERIFY_SUCCESS,
              payload : data
          })
          localStorage.setItem('userInfo', JSON.stringify(data))
  
      } catch(error){
        if (error.response && error.response.data.message === 'User with this E-mail adress already verified') {
            dispatch({
                type: USER_VERIFY_FAIL,
                payload: error.response.data.message
            });
        } else {
            dispatch({
                type: USER_VERIFY_FAIL,
                payload: error.response && error.response.data.message
                    ? error.response.data.data.message
                    : error.message
            });
        }
        console.log(error.response.data.message);
    }
  }



  export const register = ({firstName,lastName,cin,phone,dateOfBirth,imageUrl,email,password}) => async (dispatch)=>{
    try {
          dispatch({
              type:USER_REGISTER_REQUEST
          })
          const config = {
              headers:{
                  'Content-Type' : 'multipart/form-data'
              }
          }
  
          const { data } = await axios.post(
              'http://localhost:5000/user/register',
              {firstName,lastName,cin,phone,dateOfBirth,imageUrl, email, password},
              config
            );
  
          dispatch({
              type : USER_REGISTER_SUCCESS,
              payload : data
          })
       
         // localStorage.setItem('userInfo', JSON.stringify(data))
  
         } catch(error){
        if (error.response && error.response.data.message === 'User with this E-mail adress already exists') {
            dispatch({
                type: USER_REGISTER_FAIL,
                payload: error.response.data.message
            });
        } else {
            dispatch({
                type: USER_REGISTER_FAIL,
                payload: error.response && error.response.data.message
                    ? error.response.data.data.message
                    : error.message
            });
        }
        console.log(error.response.data.message);
    }

  }



 