export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type TokenPayload = {
  sub: string;
  iat: number;
  exp: number;
};
