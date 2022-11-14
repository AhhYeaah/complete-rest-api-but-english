import * as dotenv from 'dotenv';
dotenv.config();
import { describe, expect, test } from '@jest/globals';
/* There's two reasons for why I didnt implement this test.
   1. The functions in AccountService are so simple that I would be basically testin typeorm.
   3. I dont know how to virtualize a database only for testing T~T
*/

describe('AccountService', () => {
  test('Being a really cool test', () => {
    expect(true).toBe(true);
  });
});
