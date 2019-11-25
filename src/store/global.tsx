/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import { NextPage } from 'next';
import { useStaticRendering, useLocalStore } from 'mobx-react-lite';
import nextCookie from 'next-cookies';

import { IUserProfile, IWorkProfile } from '../types/schemas';
import { TaiLayout } from '../layout';
import { IS_SERVER } from '../utils';
import { redirect } from '../utils/funcs';
import { axios } from '../api';

useStaticRendering(IS_SERVER);

export type ITheme = 'light' | 'dark';

export type IGlobalState = {
  user: IUserProfile;
  theme: ITheme;
  work?: IWorkProfile;
};

export type IGlobalStore = {
  toggleTheme: () => void;
} & IGlobalState;

const defaultState: IGlobalState = {
  user: null,
  theme: 'light',
  work: {
    goals: [],
    missions: [],
  },
};

export const initializeStore = (initialState = defaultState) => {
  return useLocalStore(state => {
    return {
      user: state.user || undefined,
      theme: state.theme || 'light',
      work: state.work || undefined,
      toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
      },
    };
  }, initialState);
};

let windowStore: IGlobalStore;
const getOrInitializeWindowStore = initialState => {
  // Always make a new store if server,
  // otherwise state is shared between requests
  if (IS_SERVER) {
    return initializeStore(initialState);
  }

  // Create store if unavailable on the client and set it on the window object
  if (!windowStore) {
    windowStore = initializeStore(initialState);
  }
  return windowStore;
};

// context and its provider for global store
const storeContext = React.createContext<IGlobalStore | null>(null);
const StoreProvider: React.FC<{ initialState: IGlobalState }> = ({
  children,
  initialState,
}) => {
  const store = getOrInitializeWindowStore(initialState);
  return (
    <storeContext.Provider value={store}>{children}</storeContext.Provider>
  );
};

async function getInitialState(token: string) {
  const res = await Promise.all([
    axios.get('/users/me', {
      headers: {
        Authorization: token,
      },
    }),
    axios.get('/workspace/overview', {
      headers: {
        Authorization: token,
      },
    }),
  ]);
  return {
    user: res[0].data,
    work: res[1].data,
  };
}

// hoc for pages want global store context
export const withGlobalState = PageComponent => {
  const WithGlobalState: NextPage<{ initialState: IGlobalState }> = ({
    initialState,
    ...props
  }) => {
    return (
      <StoreProvider initialState={initialState}>
        <TaiLayout>
          <PageComponent {...props} />
        </TaiLayout>
      </StoreProvider>
    );
  };

  WithGlobalState.getInitialProps = async context => {
    try {
      const { everestToken: token } = nextCookie(context);
      if (!token) {
        // 没有 token，去login
        redirect('/login', context);
      }
      let initialState = {};
      if (IS_SERVER || !windowStore) {
        initialState = await getInitialState(token);
      }
      const contextWithStore = {
        ...context,
        initialState,
      };
      // Run getInitialProps from high order PageComponent
      const pageProps =
        typeof PageComponent.getInitialProps === 'function'
          ? await PageComponent.getInitialProps(contextWithStore)
          : {};

      // Pass props to PageComponent
      return {
        ...pageProps,
        initialState,
      };
    } catch (error) {
      console.error(`getUserInfo | error: ${error}`);
      // token 错误，删除通过 redirect 的 removeCookie 删除 token
      // redirect('/login', context, true);
      return {};
    }
  };

  return WithGlobalState;
};

// hook for components want use global store,
// the component must inside a withGlobalState() hoc
export const useGlobalStore = () => {
  const store = React.useContext(storeContext);
  if (!store) {
    // this is especially useful in TypeScript
    // so you don't need to be checking for null all the time
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return store;
};
