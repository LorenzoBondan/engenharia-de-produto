export type RoleEnum = "ROLE_ADMIN" | "ROLE_ANALYST" | "ROLE_OPERATOR";

export type CredentialsDTO = {
  username: string;
  password: string;
};

export type AccessTokenPayloadDTO = {
  exp: number;
  username: string;
  authorities: RoleEnum[];
};
