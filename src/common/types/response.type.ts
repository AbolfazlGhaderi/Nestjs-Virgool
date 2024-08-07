import { TOtpToken } from '../../modules/token/types/token.type';

export type LoginResponseType = {
  token: TOtpToken;
  code: string;
};
