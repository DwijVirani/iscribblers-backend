module.exports = {
  // Admin Emails
  ADMIN_EMAILS: [],
  WHITELIST: {
    user: {
      register: ['name', 'email', 'password', 'mobile'],
      updateProfile: ['name', 'mobile'],
      updateEmail: ['email'],
      updatePassword: ['password'],
    },
  },
  USER_ROLE_TYPES: {
    BUSINESS: 'business',
    CREATOR: 'creator',
    ADMIN: 'admin',
  },
  USER_TYPE: {
    BUSINESS: 1,
    CREATOR: 2,
  },
};
