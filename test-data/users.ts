// Credentials come from .env so nothing is hard-coded in tests.
export const users = {
  standard: {
    username: process.env.STANDARD_USER || 'standard_user',
    password: process.env.PASSWORD || 'secret_sauce',
  },
  locked: {
    username: process.env.LOCKED_USER || 'locked_out_user',
    password: process.env.PASSWORD || 'secret_sauce',
  },
  problem: {
    username: process.env.PROBLEM_USER || 'problem_user',
    password: process.env.PASSWORD || 'secret_sauce',
  },
};
