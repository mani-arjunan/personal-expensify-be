export type User = {
  username: string;
  age: number;
  fullName: string;
  sex: string;
  martialStatus: string;
};

export type ValidateRoutes =
  | "signup"
  | "login"
  | "update-account"
  | "close-account";
