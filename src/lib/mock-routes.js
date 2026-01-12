export const api = {
  auth: {
    me: {
      path: '/api/auth/me',
      responses: {
        200: {
          parse: (data) => data
        }
      }
    },
    login: {
      path: '/api/auth/login',
      method: 'POST',
      responses: {
        200: {
          parse: (data) => ({
            id: 1,
            username: data.username,
            email: `${data.username}@amrita.edu`,
            name: data.username.toUpperCase(),
            role: 'student'
          })
        }
      }
    },
    logout: {
      path: '/api/auth/logout',
      method: 'POST'
    }
  }
};