/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import { IGlobalState, ITheme } from '../store/global';
import { fakeGoals, fakeMissions } from '../utils/faker';

let count = 1;
export function getInitialState(delay: number) {
  return new Promise<IGlobalState>(resolve => {
    setTimeout(() => {
      const theme: ITheme = count % 2 === 0 ? 'dark' : 'light';
      count += 1;
      const serverState: IGlobalState = {
        user: {
          username: 'qy',
          userID: 1,
          email: 'test@ete.com',
        },
        theme,
        work: {
          goals: fakeGoals(3),
          missions: fakeMissions(3),
          hours: 0,
        },
      };
      resolve(serverState);
    }, delay);
  });
}
