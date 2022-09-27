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
  USER_TYPE: Object.freeze({
    BUSINESS: 1,
    CREATOR: 2,
    ADMIN: 3,
  }),
  LANGUAGES: Object.freeze({
    NONE: 0,
    ENGLISH: 1,
    HINDI: 2,
  }),
  PROJECT_STATUS: Object.freeze({
    NONE: 0,
    DRAFT: 1,
    PENDING_ALLOCATION: 2,
    OUTLINE_CREATION: 3,
    PENDING_APPROVAL: 4,
    WRITING_IN_PROGRESS: 5,
    REWORK_NEEDED: 6,
    EDITING_IN_PROGRESS: 7,
    EDITING_COMPLETE: 8,
    COMPLETE: 9,
    INCOMPLETE: 10,
    NEW: 11,
  }),
  TAX_TYPES: Object.freeze({
    GROUP: 0,
    CGST: 1,
    SGST: 2,
    IGST: 3,
  }),
  TIMEZONE: Object.freeze({
    IST_TIMEZONE_NAME: 'Asia/Kolkata',
  }),

  PROJECT_STATUS_NAMES: Object.freeze({
    0: 'NONE',
    1: 'Draft',
    2: 'Pending Allocation',
    3: 'Outline Creation',
    4: 'Pendgin Approval',
    5: 'Writing in Progress',
    6: 'Rework Needed',
    7: 'Editing in Progress',
    8: 'Editing Complete',
    9: 'Completed',
    10: 'Incomplete',
    11: 'New',
  }),

  WRITER_TYPE: Object.freeze({
    GENERALIST: 1,
    ADVANCED: 2,
    SUBJECT_MATTER_EXPERT: 3,
  }),
};
