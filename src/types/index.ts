export type User = {
  username: string;
  id: number;
  password: string;
  age: number;
  fullName: string;
  sex: string;
  martialStatus: string;
};

export type IncomeExpense = {
  id: number;
  type: string;
};

export type QueryParams = 
  | "get-expense"
  | "get-income"


export type ValidateRoutes =
  | "signup"
  | "login"
  | "update-account"
  | "close-account"
  | "add-relation"
  | "profile"
  | "approve-relation"
  | "add-income"
  | "add-expense";

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

type IncomeExpensePayload = {
  amount: number;
  username: string;
  date: string;
  private?: boolean;
  description?: string;
};

export type ExpenseType = IncomeExpensePayload & {
  expenseType: string
}

export type IncomeType = IncomeExpensePayload & {
  incomeType: string
}

export type IncomeExpenseReponse = {
  description?: string;
  amount: number;
  date: string;
}

export type ExpenseResponse = IncomeExpenseReponse & ExpenseType

export type IncomeResponse = IncomeExpenseReponse & ExpenseType

