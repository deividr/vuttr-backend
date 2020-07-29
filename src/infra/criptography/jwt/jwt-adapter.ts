import { Encrypter } from '../../../data/protocols/cryptography/encrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter {
  constructor(private readonly secret: string) {}
  async encrypt(data: {}): Promise<string> {
    const result = jwt.sign(data, this.secret)
    return result
  }
}
