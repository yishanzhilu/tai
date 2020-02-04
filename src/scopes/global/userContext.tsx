/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { IUserProfile } from '@/src/model/schemas';
import { noop } from '@/src/utils/funcs';

/**
 * User Context is used to store user info in global
 * if user is not login, user will all be blank value
 */
interface IUserContextState {
  user: IUserProfile;
  isLogin: boolean;
}

type IUserContextAction =
  | { type: 'LogOut' }
  | { type: 'UpdateMinutes'; minutes: number }
  | { type: 'Login'; user: IUserProfile };

const defaultState: IUserContextState = {
  user: {
    name: '',
    avatarUrl: '',
    id: 0,
    createdAt: '',
    updatedAt: '',
    minutes: 0,
  },
  isLogin: false,
};

const userContextReducer = (
  state: IUserContextState,
  action: IUserContextAction
): IUserContextState => {
  switch (action.type) {
    case 'LogOut':
      return defaultState;
    case 'UpdateMinutes':
      return {
        isLogin: state.isLogin,
        user: {
          ...state.user,
          minutes: state.user.minutes + action.minutes,
        },
      };
    case 'Login':
      return {
        user: action.user,
        isLogin: true,
      };
    default:
      return defaultState;
  }
};

const UserContext = React.createContext<{
  state: IUserContextState;
  dispatch: React.Dispatch<IUserContextAction>;
}>({ state: defaultState, dispatch: noop });

export const useUserContext = () => React.useContext(UserContext);

export const UserContextPorvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(userContextReducer, defaultState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
