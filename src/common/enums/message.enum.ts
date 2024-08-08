export enum BadRequestMesage {
    InValidData = 'اطلاعات وارد شده صحیح نمی باشند ',
    EmailFormatIncorrect = 'ایمیل وارد شده معتبر نمی باشد',
    MobileNumberIncorrect = 'شماره موبایل وارد شده معتبر نمی باشد',
    RegisterMethodIncorrect = 'باید از طریق ایمیل یا شماره موبایل ثبت نام کنید',
    SaveOtp = 'کد قبلا ارسال شده است ، لطفا بعد از 2 دقیقه مجددا تلاش کنید ',
    CategoryIncorrect = 'دسته بندی مورد نظر ثبت نشده است .  لطفا آن را ثبت کنید',
    FollowYourself = 'شما نمیتوانید خود را فالو کنید !',
    ExistEmail = 'ایمیلی برای این نام کاربری وجود دارد',
    ExistPhone = 'شماره موبایلی برای این نام کاربری وجود دارد',
}

export enum AuthMessage {
   LoginSuccess = 'ورود با موفقیت انجام شد',
   RegisterSuccess = 'ثبت نام با موفقیت انجام شد',
   NotFoundAccount = 'یوزری با این مشخصات یافت نشد ',
   AlreadyExistAccount = 'یوزری با این مشخصات قبلا ثبت شده است',
   ExpiredOtp = 'کد ارسالی منقضی شده است ، لطفا مجددا تلاش کنید',
   OtpCodeIncorrect = 'کد وارد شده اشتباه است ، لطفا مجددا تلاش کنید',
   LoginAgain = 'لطفا مجددا وارد شوید '
}

export enum NotFoundMessages {
    CategoriesNotFound = 'دسته بندی ای موجود نمیباشد',
    CategoryNotFound = 'دسته بندی مورد نظر یافت نشد',
    UserNotFound = 'کاربر مورد نظر یافت نشد',
    BlogNotFound = 'مقاله ای یافت نشد',
    ImageNotFound = 'در دریافت تصویر مشکلی پیش آمده است ٬ لطفا به پشتیبانی پیام دهید',
    CommentNotFound='کامنت مورد نظر یافت نشد',
    FollowerNotFound='دنبال کننده ای پیدا نشد ',
}

export enum ConflictMessages {
   CategoryConflict = 'دسته بندی مورد نظر قبلا ثبت شده است',
   EmailConflict = 'این ایمیل قبلا ثبت شده است',
   UserConflict = 'این نام کاربری قبلا ثبت شده است',
   BlogConflict = 'این مقاله قبلا ثبت شده است',
   PhoneConflict = 'این شماره موبایل قبلا ثبت شده است',
}

export enum PublicMessage
{
   SendOtpSuccess = 'کد با موفقیت ارسال شد',
   LoginSucces = 'ورود با موفقیت انجام شد',
   DeleteSuccess = ' با موفقیت پاک شد',
   UpdateSuccess = 'با موفقیت آپدیت شد',
   EmailUpdated = 'ایمیل با موفقیت تغییر یافت',
   SendEmailSuccess = 'کد تایید با موفقیت به ایمیل شما ارسال شد',
   Error = 'لطفا مجددا امتحان کنید ',
   CreateSuccess = 'با موفقیت ایجاد شد',
   SystemError = 'سیستم به مشکل خورده است . لطفا بعدا تلاش کنید',
   Like = 'با موفقیت لایک شد',
   DisLike = 'لایک با موفقیت برداشته شد',
   Bookmark = 'با موفقیت ذخیره شد',
   UnBookmark = ' مقاله با موفقیت از لیست ذخیره ها برداشته شد',
   Accept = 'با موفقیت تایید شد',
   Reject = 'با موفقیت رد شد',
   Follow = 'فالو شد',
   UnFollow = 'از لیست دنبال کنندگان حذف شد ',
   AlreadyVerified = 'قبلا تایید شده است',
   AddEmailSuccess='ایمیل با موفقیت ثبت شد',
   AddPhoneSuccess='شماره تلفن با موفقیت ثبت شد',
}

export enum ValidationMessage
{
   InvalidImageFormat = 'فرمت تصاویر باید .png یا .jpg یا .jpeg باشد .'
}

export enum ServiceUnavailableMessage
{
   SmsServiceUnavailable = 'سرویس ارسال پیامک در درسترس نمیباشد . مجددا امتحان نمایید ',
}

export enum ForbiddenMessage
{
   RoleAcces = 'شما به این بخش دسترسی ندارید',
}