import { Hasher } from '../../../data/protocols/cryptography/hasher'
import bcrypt from 'bcrypt'
import { HashComparer } from '../../../data/protocols/cryptography/hash-comparer'

export class BcryptAdapter implements Hasher, HashComparer {
  async hash(value: string): Promise<string> {
    const hashed = await bcrypt.hash(value, 12)
    return hashed
  }

  async compare(plainText: string, digest: string): Promise<boolean> {
    const isEqual = await bcrypt.compare(plainText, digest)
    return isEqual
  }
}
