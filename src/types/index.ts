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
  | "close-account"
  | "add-relation"
  | "profile"
  | "approve-relation";

export type RefreshToken = {
  refreshToken: string;
  userId: number;
};

export type Login = {
  accessToken: string;
  refreshToken: string;
  username?: string;
};

export type Relation = {
  primaryUsername: string;
  associatedUsername: string;
  associationType: string;
};

export type PendingRelation = Pick<User, "username"> & {
  requestedAssociationType: string;
};

export type SentRelation = {
  status: "pending" | "approved" | "rejected";
  username: string;
};

export type ApproveRelation = Pick<
  Relation,
  "primaryUsername" | "associatedUsername"
> & {
  isApproved: boolean;
};

export type Profile = {
  user: User;
  myRelations: Array<Pick<User, "username">>;
};
