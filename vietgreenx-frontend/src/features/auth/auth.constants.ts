import { Building2, GraduationCap, Store, Tractor, Users2, type LucideIcon } from "lucide-react";

import { UserRole } from "@/shared/auth";
import type { AppLocale } from "@/shared/i18n/locale";

const AUTH_VALIDATION_COPY = {
  vi: {
    identifierRequired: "Vui lòng nhập email hoặc số điện thoại",
    identifierInvalid: "Email hoặc số điện thoại không hợp lệ",
    loginPasswordMin: "Mật khẩu tối thiểu 6 ký tự",
    phoneRequired: "Vui lòng nhập số điện thoại",
    phoneInvalid: "Số điện thoại không hợp lệ",
    emailInvalid: "Email không hợp lệ",
    otpLength: "OTP phải có 6 số",
    displayNameRequired: "Vui lòng nhập tên hiển thị",
    tokenInvalid: "Token xác minh không hợp lệ",
    confirmPasswordRequired: "Vui lòng xác nhận mật khẩu",
    passwordMismatch: "Mật khẩu xác nhận không khớp",
  },
  en: {
    identifierRequired: "Please enter your email or phone number",
    identifierInvalid: "Invalid email or phone number",
    loginPasswordMin: "Password must be at least 6 characters",
    phoneRequired: "Please enter a phone number",
    phoneInvalid: "Invalid phone number",
    emailInvalid: "Invalid email address",
    otpLength: "OTP must be 6 digits",
    displayNameRequired: "Please enter a display name",
    tokenInvalid: "Invalid verification token",
    confirmPasswordRequired: "Please confirm your password",
    passwordMismatch: "Confirmation password does not match",
  },
} as const;

export function getAuthValidationCopy(locale: AppLocale) {
  return AUTH_VALIDATION_COPY[locale] ?? AUTH_VALIDATION_COPY.vi;
}

const AUTH_COPY = {
  vi: {
    loginForm: {
      welcomeHeading: "Chào mừng bạn quay trở lại!",
      title: "Đăng nhập",
      subtitle: "Đăng nhập để tiếp tục hành trình nông sản xanh của bạn",
      identifier: "Email hoặc Số điện thoại",
      identifierPlaceholder: "your.email@example.com",
      password: "Mật khẩu",
      remember: "Ghi nhớ đăng nhập",
      forgot: "Quên mật khẩu?",
      submit: "Đăng nhập",
      otpLogin: "Đăng nhập bằng OTP",
      divider: "hoặc",
      featureComingSoon: "Tính năng đang phát triển",
      noAccount: "Bạn chưa có tài khoản?",
      signUp: "Đăng ký",
    },
    register: {
      communityPill: "Tham gia cộng đồng VietGreenX",
      title: "Chào mừng bạn đến với VietGreenX",
      subtitle: "Tạo tài khoản để bắt đầu hành trình xanh cùng hàng ngàn người dùng trên khắp Việt Nam",
      back: "Quay lại",
      next: "Tiếp tục",
      finish: "Hoàn tất",
      hasAccount: "Đã có tài khoản?",
      login: "Đăng nhập",
      tabs: { phone: "Số điện thoại", email: "Email" },
      divider: "hoặc",
      social: {
        featureComingSoon: "Tính năng đang phát triển",
        google: "Tiếp tục với Google",
        facebook: "Tiếp tục với Facebook",
      },
      phone: {
        stepLabels: ["Số điện thoại", "Xác minh OTP", "Tài khoản"],
        step1Title: "Nhập số điện thoại",
        step1Subtitle: "Chúng tôi sẽ gửi mã OTP để xác minh",
        step3Title: "Thông tin tài khoản",
        step3Subtitle: "Điền thông tin để hoàn tất đăng ký",
        phoneLabel: "Số điện thoại",
        phonePlaceholder: "0912345678",
        devOtpHint: "Mã OTP (dev):",
        sendRetryHint: "Vui lòng thử lại...",
      },
      email: {
        step1Title: "Nhập email",
        step1Subtitle: "Chúng tôi sẽ gửi link xác minh vào hộp thư",
        emailLabel: "Email",
        checkInboxTitle: "Kiểm tra hộp thư",
        checkInboxSubtitle: "Nhấn link trong email để hoàn tất đăng ký. Link có hiệu lực ~24 giờ.",
        resend: "Gửi lại email",
        changeEmail: "← Đổi email khác",
      },
      account: {
        displayName: "Tên hiển thị",
        username: {
          label: "Username",
          placeholder: "johndoe",
          hint: "3–30 ký tự: chữ, số và dấu _ (dùng cho @profile)",
          required: "Vui lòng nhập username",
          checking: "Đang kiểm tra…",
          available: "Username khả dụng",
          taken: "Username đã được dùng",
          tooShort: "Nhập ít nhất 3 ký tự",
          tooLong: "Username tối đa 30 ký tự",
          invalid: "Chỉ dùng chữ, số và dấu _",
          checkError: "Không kiểm tra được. Thử lại.",
          unavailable: "Username không khả dụng",
        },
        password: "Mật khẩu",
        passwordHint: "Tối thiểu 8 ký tự, có chữ và số",
      },
      roleSelection: {
        title: "Chọn vai trò",
        subtitle: "Bạn có thể thay đổi sau trong cài đặt (khi tính năng sẵn sàng)",
        placeholder: "Chọn vai trò của bạn",
        searchPlaceholder: "Tìm vai trò...",
        emptyText: "Không tìm thấy vai trò",
      },
      roles: {
        consumer: {
          title: "Người mua / dùng app",
          description: "Khám phá bảng tin, mua sản phẩm và truy xuất nguồn gốc.",
        },
        seller: {
          title: "Người bán cá nhân",
          description: "Tiếp thị nông sản và quản lý sản phẩm của bạn.",
        },
        cooperative: {
          title: "Hợp tác xã",
          description: "Quản lý nhóm nông dân và giao dịch tập thể.",
        },
        enterprise: {
          title: "Doanh nghiệp",
          description: "Quản lý chuỗi cung ứng và kết nối B2B.",
        },
        expert: {
          title: "Chuyên gia",
          description: "Tư vấn, xác minh hồ sơ xanh và hỗ trợ cộng đồng.",
        },
      },
      verifyIdentity: {
        title: "Nhập mã OTP",
        subtitle: "Mã 6 số đã gửi tới số điện thoại của bạn",
        checking: "Đang kiểm tra...",
        otpInvalid: "Mã OTP không đúng, vui lòng kiểm tra lại",
        otpExpired: "Mã OTP không hợp lệ hoặc đã hết hạn",
        resendHint: "Không nhận được mã?",
        resend: "Gửi lại",
        resendWait: "Gửi lại sau {s}s",
      },
      roleRequired: "Vui lòng chọn vai trò",
    },
    verifyEmail: {
      title: "Hoàn tất đăng ký email",
      subtitle: "Tạo mật khẩu và chọn vai trò để bắt đầu",
      submit: "Tạo tài khoản",
      missingToken: "Link xác minh không hợp lệ. Vui lòng đăng ký lại.",
      registerAgain: "Đăng ký lại",
    },
    forgotPasswordForm: {
      title: "Quên mật khẩu",
      subtitle: "Nhập email hoặc số điện thoại để nhận mã OTP đặt lại mật khẩu.",
      tabs: { phone: "Số điện thoại", email: "Email" },
      phoneLabel: "Số điện thoại",
      phonePlaceholder: "0912345678",
      emailLabel: "Email",
      submit: "Gửi mã OTP",
      sentHint: "Nếu tài khoản tồn tại, mã OTP sẽ được gửi.",
      devOtpHint: "Mã OTP (dev):",
      backToLogin: "Quay lại đăng nhập",
    },
    resetPasswordForm: {
      title: "Đặt lại mật khẩu",
      subtitlePhone: "Nhập mã OTP và mật khẩu mới cho số {phone}.",
      subtitleEmail: "Nhập mã OTP và mật khẩu mới cho email {email}.",
      otp: "Mã OTP",
      newPassword: "Mật khẩu mới",
      confirmPassword: "Xác nhận mật khẩu",
      passwordHint: "Tối thiểu 8 ký tự, có chữ và số",
      submit: "Đặt lại mật khẩu",
      success: "Đã đặt lại mật khẩu. Vui lòng đăng nhập lại.",
      resendHint: "Không nhận được mã?",
      resend: "Gửi lại",
      resendWait: "Gửi lại sau {s}s",
      missingChannel: "Thiếu thông tin xác minh. Vui lòng bắt đầu lại từ bước quên mật khẩu.",
      restart: "Quên mật khẩu",
    },
    sessions: {
      title: "Phiên đăng nhập",
      description: "Quản lý thiết bị đang đăng nhập tài khoản.",
      loading: "Đang tải…",
      empty: "Không có phiên nào.",
      current: "Thiết bị này",
      revoke: "Đăng xuất",
      revokeAll: "Đăng xuất tất cả thiết bị",
      revoked: "Đã đăng xuất phiên.",
      revokedAll: "Đã đăng xuất tất cả thiết bị.",
    },
    errors: {
      generic: "Đã có lỗi xảy ra. Vui lòng thử lại.",
      login: {
        default: "Email hoặc mật khẩu không đúng.",
        unauthorized: "Email hoặc mật khẩu không đúng.",
        rateLimited: "Quá nhiều lần thử. Vui lòng thử lại sau.",
      },
      register: {
        default: "Không thể gửi email xác minh. Vui lòng thử lại.",
        emailExists: "Email đã được đăng ký.",
        invalid: "Thông tin đăng ký không hợp lệ.",
        rateLimited: "Quá nhiều lần thử. Vui lòng thử lại sau.",
      },
      registerPhone: {
        default: "Không thể gửi OTP. Vui lòng thử lại.",
        phoneExists: "SĐT đã được đăng ký.",
        rateLimited: "Quá nhiều lần thử. Vui lòng thử lại sau.",
      },
      verifyOtp: {
        default: "Mã OTP không đúng hoặc đã hết hạn.",
        unauthorized: "Mã OTP không đúng hoặc đã hết hạn.",
        rateLimited: "Quá nhiều lần thử. Vui lòng yêu cầu mã mới.",
      },
      verifyEmail: {
        default: "Không thể xác minh email. Vui lòng thử lại.",
        invalidLink: "Link hết hạn hoặc không hợp lệ.",
      },
      resendOtp: {
        success: "Đã gửi lại mã OTP.",
        default: "Không thể gửi lại mã. Vui lòng thử lại.",
        rateLimited: "Vui lòng đợi 60 giây trước khi gửi lại.",
      },
      resendEmail: {
        success: "Đã gửi lại email xác minh.",
        default: "Không thể gửi lại email. Vui lòng thử lại.",
        rateLimited: "Vui lòng đợi 60 giây trước khi gửi lại.",
      },
      forgotPassword: {
        default: "Không thể gửi mã OTP. Vui lòng thử lại.",
        rateLimited: "Quá nhiều lần thử. Vui lòng thử lại sau.",
      },
      resetPassword: {
        default: "Không thể đặt lại mật khẩu. Vui lòng thử lại.",
        rateLimited: "Quá nhiều lần thử. Vui lòng yêu cầu mã mới.",
      },
      be: {
        phoneExists: "SĐT đã được đăng ký",
        emailExists: "Email đã được đăng ký",
        otpIncorrect: "Mã OTP không đúng",
        otpExpired: "Mã OTP đã hết hạn, vui lòng yêu cầu mã mới",
        linkInvalid: "Link hết hạn hoặc không hợp lệ",
        loginIncorrect: "Email hoặc mật khẩu không đúng",
        cooldown60s: "Vui lòng đợi 60 giây trước khi gửi lại",
        dailyLimitExceeded: "Bạn đã gửi OTP quá nhiều lần trong ngày. Vui lòng thử lại vào ngày mai",
        passwordMin8: "Mật khẩu tối thiểu 8 ký tự, có chữ và số",
        passwordReused: "Không được dùng lại 3 mật khẩu gần nhất",
      },
    },
  },
  en: {
    loginForm: {
      welcomeHeading: "Welcome back!",
      title: "Log in",
      subtitle: "Log in to continue your green agriculture journey",
      identifier: "Email or Phone Number",
      identifierPlaceholder: "your.email@example.com",
      password: "Password",
      remember: "Remember me",
      forgot: "Forgot password?",
      submit: "Log in",
      otpLogin: "Log in with OTP",
      divider: "or",
      featureComingSoon: "Feature coming soon",
      noAccount: "Don't have an account?",
      signUp: "Sign up",
    },
    register: {
      communityPill: "Join the VietGreenX community",
      title: "Welcome to VietGreenX",
      subtitle: "Create an account to start your green journey with thousands of users across Vietnam",
      back: "Back",
      next: "Continue",
      finish: "Complete",
      hasAccount: "Already have an account?",
      login: "Log in",
      tabs: { phone: "Phone", email: "Email" },
      divider: "or",
      social: {
        featureComingSoon: "Feature coming soon",
        google: "Continue with Google",
        facebook: "Continue with Facebook",
      },
      phone: {
        stepLabels: ["Phone number", "Verify OTP", "Account"],
        step1Title: "Enter phone number",
        step1Subtitle: "We will send an OTP to verify",
        step3Title: "Account information",
        step3Subtitle: "Fill in your details to complete registration",
        phoneLabel: "Phone number",
        phonePlaceholder: "0912345678",
        devOtpHint: "OTP code (dev):",
        sendRetryHint: "Please try again...",
      },
      email: {
        step1Title: "Enter email",
        step1Subtitle: "We will send a verification link",
        emailLabel: "Email",
        checkInboxTitle: "Check your inbox",
        checkInboxSubtitle: "Click the link in your email to finish signup. Link expires in ~24h.",
        resend: "Resend email",
        changeEmail: "← Change email",
      },
      account: {
        displayName: "Display name",
        username: {
          label: "Username",
          placeholder: "johndoe",
          hint: "3–30 characters: letters, numbers, and _ (for @profile)",
          required: "Please enter a username",
          checking: "Checking…",
          available: "Username is available",
          taken: "Username is taken",
          tooShort: "Enter at least 3 characters",
          tooLong: "Username must be at most 30 characters",
          invalid: "Use letters, numbers, and _ only",
          checkError: "Could not check. Try again.",
          unavailable: "Username is not available",
        },
        password: "Password",
        passwordHint: "At least 8 characters with letters and numbers",
      },
      roleSelection: {
        title: "Choose your role",
        subtitle: "Default is consumer — you can explore other roles later",
        placeholder: "Select your role",
        searchPlaceholder: "Search roles...",
        emptyText: "No roles found",
      },
      roles: {
        consumer: {
          title: "Consumer",
          description: "Explore the feed, buy products, and trace origins.",
        },
        seller: {
          title: "Individual seller",
          description: "Market your produce and manage products.",
        },
        cooperative: {
          title: "Cooperative",
          description: "Manage farmer groups and collective trade.",
        },
        enterprise: {
          title: "Enterprise",
          description: "Supply chain management and B2B connections.",
        },
        expert: {
          title: "Expert",
          description: "Advise, verify green profiles, and support the community.",
        },
      },
      verifyIdentity: {
        title: "Enter OTP",
        subtitle: "6-digit code sent to your phone",
        checking: "Checking...",
        otpInvalid: "Incorrect OTP, please check again",
        otpExpired: "OTP is invalid or has expired",
        resendHint: "Didn't receive the code?",
        resend: "Resend",
        resendWait: "Resend in {s}s",
      },
      roleRequired: "Please select a role",
    },
    verifyEmail: {
      title: "Complete email signup",
      subtitle: "Set password and role to get started",
      submit: "Create account",
      missingToken: "Invalid verification link. Please register again.",
      registerAgain: "Register again",
    },
    forgotPasswordForm: {
      title: "Forgot password",
      subtitle: "Enter email or phone to receive an OTP for resetting your password.",
      tabs: { phone: "Phone", email: "Email" },
      phoneLabel: "Phone number",
      phonePlaceholder: "0912345678",
      emailLabel: "Email",
      submit: "Send OTP",
      sentHint: "If the account exists, an OTP will be sent.",
      devOtpHint: "OTP code (dev):",
      backToLogin: "Back to log in",
    },
    resetPasswordForm: {
      title: "Reset password",
      subtitlePhone: "Enter the OTP and new password for {phone}.",
      subtitleEmail: "Enter the OTP and new password for {email}.",
      otp: "OTP code",
      newPassword: "New password",
      confirmPassword: "Confirm password",
      passwordHint: "At least 8 characters with letters and numbers",
      submit: "Reset password",
      success: "Password reset. Please log in again.",
      resendHint: "Didn't receive the code?",
      resend: "Resend",
      resendWait: "Resend in {s}s",
      missingChannel: "Missing verification info. Please restart from forgot password.",
      restart: "Forgot password",
    },
    sessions: {
      title: "Login sessions",
      description: "Manage devices signed in to your account.",
      loading: "Loading…",
      empty: "No sessions found.",
      current: "This device",
      revoke: "Sign out",
      revokeAll: "Sign out all devices",
      revoked: "Session revoked.",
      revokedAll: "Signed out from all devices.",
    },
    errors: {
      generic: "Something went wrong. Please try again.",
      login: {
        default: "Incorrect email or password.",
        unauthorized: "Incorrect email or password.",
        rateLimited: "Too many attempts. Please try again later.",
      },
      register: {
        default: "Could not send verification email. Please try again.",
        emailExists: "This email is already registered.",
        invalid: "Invalid registration details.",
        rateLimited: "Too many attempts. Please try again later.",
      },
      registerPhone: {
        default: "Could not send OTP. Please try again.",
        phoneExists: "This phone number is already registered.",
        rateLimited: "Too many attempts. Please try again later.",
      },
      verifyOtp: {
        default: "Incorrect or expired OTP.",
        unauthorized: "Incorrect or expired OTP.",
        rateLimited: "Too many attempts. Please request a new code.",
      },
      verifyEmail: {
        default: "Could not verify email. Please try again.",
        invalidLink: "This link is invalid or has expired.",
      },
      resendOtp: {
        success: "OTP code resent.",
        default: "Could not resend code. Please try again.",
        rateLimited: "Please wait 60 seconds before resending.",
      },
      resendEmail: {
        success: "Verification email resent.",
        default: "Could not resend email. Please try again.",
        rateLimited: "Please wait 60 seconds before resending.",
      },
      forgotPassword: {
        default: "Could not send OTP. Please try again.",
        rateLimited: "Too many attempts. Please try again later.",
      },
      resetPassword: {
        default: "Could not reset password. Please try again.",
        rateLimited: "Too many attempts. Please request a new code.",
      },
      be: {
        phoneExists: "This phone number is already registered",
        emailExists: "This email is already registered",
        otpIncorrect: "Incorrect OTP",
        otpExpired: "OTP has expired, please request a new one",
        linkInvalid: "This link is invalid or has expired",
        loginIncorrect: "Incorrect email or password",
        cooldown60s: "Please wait 60 seconds before resending",
        dailyLimitExceeded: "You have requested too many OTPs today. Please try again tomorrow",
        passwordMin8: "Password must be at least 8 characters with letters and numbers",
        passwordReused: "Cannot reuse your last 3 passwords",
      },
    },
  },
} as const;

const REGISTER_ROLE_IDS = [
  UserRole.CONSUMER,
  UserRole.SELLER,
  UserRole.COOPERATIVE,
] as const;

const REGISTER_ROLE_ICONS: Record<(typeof REGISTER_ROLE_IDS)[number], LucideIcon> = {
  consumer: Store,
  seller: Tractor,
  cooperative: Users2,
};

export type RegisterRoleId = (typeof REGISTER_ROLE_IDS)[number];

export interface RegisterRoleOption {
  id: RegisterRoleId;
  icon: LucideIcon;
  title: string;
  description: string;
}

export const OTP_LENGTH = 6;

export function getAuthCopy(locale: AppLocale) {
  return AUTH_COPY[locale] ?? AUTH_COPY.vi;
}

export function getAuthErrorCopy(locale: AppLocale) {
  return (AUTH_COPY[locale] ?? AUTH_COPY.vi).errors;
}

export function getRegisterRoles(locale: AppLocale): RegisterRoleOption[] {
  const roles = getAuthCopy(locale).register.roles;

  return REGISTER_ROLE_IDS.map((id) => ({
    id,
    icon: REGISTER_ROLE_ICONS[id],
    title: roles[id].title,
    description: roles[id].description,
  }));
}
