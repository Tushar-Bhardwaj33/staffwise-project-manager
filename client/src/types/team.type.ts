import type { IUser } from "../types/user.type";

export interface ITeam {
  _id: string;
  name: string;
  members: (string | IUser)[];
  createdBy: string | IUser;
  createdAt: string;
  updatedAt: string;
  __v: number;
}