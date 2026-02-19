/**
 * 관리자 권한을 가진 이메일 목록입니다.
 * 이 파일에서만 관리 이메일을 수정하면 모든 관련 페이지와 API에 적용됩니다.
 */
export const ADMIN_EMAILS = [
    'dumi3345@gmail.com',
    '0aoi.soe0@gmail.com'
];

/**
 * 주어진 이메일이 관리자인지 확인하는 헬퍼 함수입니다.
 */
export function isAdminEmail(email) {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase());
}
