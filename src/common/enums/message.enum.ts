export enum BadRequestMesage {
   inValidData = 'اطلاعات وارد شده صحیح نمی باشند ',
   emailFormatIncorrect = 'ایمیل وارد شده معتبر نمی باشد',
   mobileNumberIncorrect = 'شماره موبایل وارد شده معتبر نمی باشد',
   registerMethodIncorrect = 'باید از طریق ایمیل یا شماره موبایل ثبت نام کنید',
   saveEmailOtp = 'کد قبلا ارسال شده است ، لطفا بعد از 2 دقیقه مجددا تلاش کنید '
}

export enum AuthMessage {
   loginSuccess = 'ورود با موفقیت انجام شد',
   registerSuccess = 'ثبت نام با موفقیت انجام شد',
   notFoundAccount = 'یوزری با این مشخصات یافت نشد ',
   alreadyExistAccount = 'یوزری با این مشخصات قبلا ثبت شده است',
   expiredOtp = 'کد ارسالی منقضی شده است ، لطفا مجددا تلاش کنید',
   otpCodeIncorrect = 'کد وارد شده اشتباه است ، لطفا مجددا تلاش کنید',
   loginAgain = 'لطفا مجددا وارد شوید '
}

export enum NotFoundMessages {
   categoryNotFound = 'دسته بندی مورد نظر پیدا نشد',
   categoriesNotFound = 'دسته بندی ای موجود نمیباشد',
   userNotFound = 'کاربر مورد نظر پیدا نشد',
   blogNotFound = 'مقاله ای پیدا نشد',
}

export enum ConflictMessages {
   categoryConflict = 'دسته بندی مورد نظر قبلا ثبت شده است',
   emailConflict = 'این ایمیل قبلا ثبت شده است',
   userConflict = 'این نام کاربری قبلا ثبت شده است',
   blogConflict = 'این مقاله قبلا ثبت شده است'
}

export enum PublicMessage {
   sendOtpSuccess = 'کد با موفقیت ارسال شد',
   loginSucces = 'ورود با موفقیت انجام شد',
   deleteSuccess = ' با موفقیت پاک شد',
   updateSuccess = 'با موفقیت آپدیت شد',
   emailUpdated = 'ایمیل با موفقیت تغییر یافت',
   sendEmailSuccess = 'کد تایید با موفقیت به ایمیل شما ارسال شد',
   Error = 'لطفا مجددا امتحان کنید ',
   CreateSuccess = 'با موفقیت ایجاد شد'
}

export enum ValidationMessage {
   invalidImageFormat = 'فرمت تصاویر باید .png یا .jpg یا .jpeg باشد .'
}
