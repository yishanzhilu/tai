/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

export interface IUserProfile {
  username: string;
  email: string;
  userID: number;
}


export interface IWorkProfile {
  goals: IGoal[];
  missions: IMission[];
  hours: number;
}

export interface IGoal {
  id: number;
  title: string;
  status: 'doing' | 'done' | 'drop' | 'plan';
  description: string;
  hours: number;
  missions?: IMission[];
  records?: IRecord[];
  todo?: ITodo[];

}

export interface IMission {
  id: number;
  title: string;
  status: 'doing' | 'done' | 'drop' | 'plan';
  description: string;
  hours: number;
  goalID?: number;
  records?: IRecord[];
  todo?: ITodo[];
}

export interface IRecord {
  content: string;
  thoughts: string;
  hours: number;
  goalID?: number;
  missionID?: number;
}

export interface ITodo {
  id: number;
  content: string;
  status: 'doing' | 'done';
  goalID?: number;
  goalTitle?: string;
  missionID?: number;
  missionTitle?: string;
}
