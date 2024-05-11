// OTP Payload
export type OtpCookiePayload = {
   sub: string;
};

// Access Token
export type AccessTokenPayload = {
   sub: string;
};

export type ChangeTokenPayload = {
   sub: string;
   sub2: string;
};
