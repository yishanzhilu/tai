/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

export interface IUserProfile {
  name: string;
  avatarUrl: string;
  id: number;
  minutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface IWorkProfile {
  goals: IGoal[];
  missions: IMission[];
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
  createdAt: string;
  updatedAt: string;
}

export interface IMission {
  id: number;
  title: string;
  status: 'doing' | 'done' | 'drop' | 'plan';
  description: string;
  minutes: number;
  goalID?: number;
  goalTitle?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRecord extends IGoalMission {
  id: number;
  content: string;
  review: string;
  minutes: number;
  status: 'done' | 'todo';
  createdAt: string;
  updatedAt: string;
}

export interface ITodo extends IGoalMission {
  id: number;
  content: string;
  status: 'todo';
  createdAt: string;
  updatedAt: string;
}
