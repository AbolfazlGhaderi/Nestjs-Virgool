
export enum BadRequestMesage {
    inValidData = 'اطلاعات وارد شده صحیح نمی باشند ',
    emailFormatIncorrect='ایمیل وارد شده معتبر نمی باشد',
    mobileNumberIncorrect='شماره موبایل وارد شده معتبر نمی باشد',
    registerMethodIncorrect='باید از طریق ایمیل یا شماره موبایل ثبت نام کنید'
}

export enum AuthMessage{
    loginSuccess = 'ورود با موفقیت انجام شد',
    registerSuccess = 'ثبت نام با موفقیت انجام شد',
    notFoundAccount = 'یوزری با این مشخصات یافت نشد ',
    alreadyExistAccount = 'یوزری با این مشخصات قبلا ثبت شده است'

}