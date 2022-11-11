import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  /**
   * Hasing provided password
   * @param password String for hash
   * @returns Hashed password
   */
  async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }
  /**
   * Checking if hashed password is valid
   * @param password String to compare
   * @param hash Hashed string to compare
   * @returns true/false
   */
  async comparePassword(password: string, hash) {
    return await bcrypt.compare(password, hash);
  }
}
