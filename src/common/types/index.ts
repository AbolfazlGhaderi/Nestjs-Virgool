export { OtpCookiePayload } from '../../common/types/auth/payload.type'
export { LoginResponseType } from '../../common/types/response.type'
export { AccessTokenPayload } from './auth/payload.type'
export { ProfileImage } from './multer/profile.image.type'
export type DefaultSuccessResponseT = {
    ok: boolean
    statusCode: number
    timestamp: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
}