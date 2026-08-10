export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
  employeeId: number;
  skills: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}