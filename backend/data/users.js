import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Admin User',
    email: 'admin@hoaiphu.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Minh Thắng',
    email: 'minhthang@gmail.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Đình Tân',
    email: 'tanvd@gmail.com',
    password: bcrypt.hashSync('123456', 10),
  },
]

export default users
