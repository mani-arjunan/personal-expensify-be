export type User = {
  username: string;
  id: number;
  password: string;
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

export type RefreshToken = {
  refreshToken: string;
  userId: number
}

export type LoginToken = {
  accessToken: string;
  refreshToken: string
}
