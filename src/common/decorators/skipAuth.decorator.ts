import { SetMetadata } from "@nestjs/common"

const SKIP_AUTH = 'SKIP_AUTH'

export const SkipAuthDecorator = ()=> SetMetadata(SKIP_AUTH, true)