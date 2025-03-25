export const generateUserToken = (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const getOrCreateUserToken = (): string => {
const tokenFromCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('meetToken='))
    ?.split('=')[1];

if (tokenFromCookie) {
    return tokenFromCookie;
}

const newToken = generateUserToken();
document.cookie = `meetToken=${newToken}; max-age=86400; path=/; samesite=lax`;
return newToken;
};