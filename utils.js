import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcryptjs'

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

// __filename and __dirname aren't available by default in ES modules, so we need to create them
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
