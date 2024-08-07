import { PublicMessage } from '../../../common/enums';

export type TChangeEmailC = Promise<
    | {
          message: PublicMessage;
          code?: undefined;
          token?: undefined;
      }
    | {
          code: number;
          token: string;
          message: PublicMessage;
      }
>;

export type TCheckOtp = Promise<{ message: PublicMessage }>;
