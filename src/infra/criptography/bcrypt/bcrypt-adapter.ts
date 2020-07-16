import { Hasher } from '../../../data/protocols/encrypter'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher {
  async hash(value: string): Promise<string> {
    const hashed = await bcrypt.hash(value, 12)
    return hashed
  }
}
