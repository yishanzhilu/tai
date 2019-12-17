/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

export interface IUserProfile {
  username: string;
  email: string;
  userID: number;
  createdAt: string;
  updatedAt: string;
}

export interface IWorkProfile {
  goals: IGoal[];
  missions: IMission[];
  minutes: number;
}

export interface IGoalMission {
  goalID?: number;
  goalTitle?: string;
  missionID?: number;
  missionTitle?: string;
}

export interface IGoal {
  id: number;
  title: string;
  status: 'doing' | 'done' | 'drop' | 'plan';
  description: string;
  minutes: number;
  missions: IMission[];
}

export interface IMission {
  id: number;
  title: string;
  status: 'doing' | 'done' | 'drop' | 'plan';
  description: string;
  minutes: number;
  goalID?: number;
  goalTitle?: string;
}

export interface IRecord {
  id: number;
  content: string;
  thoughts: string;
  minutes: number;
  goalID?: number;
  createdAt: string;
  missionID?: number;
}

export interface ITodo extends IGoalMission {
  id: number;
  content: string;
  status: 'doing' | 'done';
}
