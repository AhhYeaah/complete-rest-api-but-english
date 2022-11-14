import * as dotenv from 'dotenv';
dotenv.config();
import { describe, expect, test } from '@jest/globals';
import { AccountController } from '../../controllers/AccountController';
import { AccountService } from '../../services/AccountService';
import {
  INVALID_CPF,
  INVALID_NAN_MONTANTE,
  INVALID_NEGATIVE_MONTANTE,
  INVALID_STRING,
  INVALID_TOO_HIGH_MONTANTE,
  VALID_CPF,
  VALID_CPF2,
  VALID_LOW_MONTANTE,
  VALID_MONTANTE,
  VALID_NAME,
} from '../variables';

// This test also covers all the utils functions by consequence.
describe('accountController', () => {
  const stubAccountService = {
    doesAccountExists: (cpf: string) => {
      return 1;
    },
    saveAccount: (name: string, cpf: string) => {
      return {
        name: name,
        cpf: cpf,
        balance: 0,
      };
    },
    changeAccountBalance: (cpf: string, amount: number) => {
      return {
        cpf: cpf,
        balance: 0,
      };
    },
    checkAccountBalance: (senderCpf) => {
      return 20;
    },
    transfer: (senderCpf, receiverCpf, amount) => {
      return true;
    },
  } as unknown as AccountService;

  test('createAccount - Should work when everything is correct', async () => {
    const modifiedStubAccountService = {
      ...stubAccountService,
      doesAccountExists: (cpf: string) => {
        return 0;
      },
    } as unknown as AccountService;

    const accountController = new AccountController(modifiedStubAccountService);
    const { result, error } = await accountController.createAccount(VALID_NAME, VALID_CPF);

    expect(result).toMatchObject({
      name: VALID_NAME,
      cpf: VALID_CPF,
      balance: 0,
    });

    expect(error).toBe(undefined);
  });

  test('createAccount - Should return an error if account already exists', async () => {
    const accountController = new AccountController(stubAccountService);

    const { result, error } = await accountController.createAccount(VALID_NAME, VALID_CPF);
    expect(error).toMatchObject({
      code: 403,
      message: 'User already exists',
    });
    expect(result).toBe(undefined);
  });

  test('createAccount - Should return an error when name is a invalid string', async () => {
    const modifiedStubAccountService = {
      ...stubAccountService,
      doesAccountExists: (cpf: string) => {
        return 0;
      },
    } as unknown as AccountService;

    const accountController = new AccountController(modifiedStubAccountService);

    const { result, error } = await accountController.createAccount(INVALID_STRING, VALID_CPF);
    expect(error).toMatchObject({
      code: 400,
      message: 'Invalid parameters',
    });
    expect(result).toBe(undefined);
  });

  test('createAccount - Should return an error when cpf is a invalid string', async () => {
    const modifiedStubAccountService = {
      ...stubAccountService,
      doesAccountExists: (cpf: string) => {
        return 0;
      },
    } as unknown as AccountService;

    const accountController = new AccountController(modifiedStubAccountService);

    const { result, error } = await accountController.createAccount(VALID_NAME, INVALID_CPF);
    expect(error).toMatchObject({
      code: 400,
      message: 'Invalid parameters',
    });
    expect(result).toBe(undefined);
  });

  test('deposit - Should work if everything is correct', async () => {
    const accountController = new AccountController(stubAccountService);
    const { result, error } = await accountController.deposit(VALID_CPF, VALID_MONTANTE);

    expect(result).toMatchObject({
      cpf: VALID_CPF,
      balance: 0,
    });

    expect(error).toBe(undefined);
  });

  test('deposit - Should return an error if the amount exceeds R$2000', async () => {
    const accountController = new AccountController(stubAccountService);
    const { result, error } = await accountController.deposit(VALID_CPF, INVALID_TOO_HIGH_MONTANTE);

    expect(result).toBe(undefined);
    expect(error).toMatchObject({ code: 403, message: 'Deposits cant exceed R$2000' });
  });

  test('deposit - Should return an error if account doesnt exists', async () => {
    const modifiedStubAccountService = {
      ...stubAccountService,
      doesAccountExists: (cpf: string) => {
        return 0;
      },
    } as unknown as AccountService;

    const accountController = new AccountController(modifiedStubAccountService);
    const { result, error } = await accountController.deposit(VALID_CPF, VALID_MONTANTE);

    expect(result).toBe(undefined);
    expect(error).toMatchObject({
      code: 404,
      message: 'User not found',
    });
  });

  test('deposit - Should return an error if amount is an negative number', async () => {
    const accountController = new AccountController(stubAccountService);
    const { result, error } = await accountController.deposit(VALID_CPF, INVALID_NEGATIVE_MONTANTE);

    expect(result).toBe(undefined);
    expect(error).toMatchObject({ code: 400, message: 'Invalid parameters' });
  });

  test('deposit - Should return an error if amount is NaN', async () => {
    const accountController = new AccountController(stubAccountService);
    const { result, error } = await accountController.deposit(VALID_CPF, INVALID_NAN_MONTANTE);

    expect(result).toBe(undefined);
    expect(error).toMatchObject({ code: 400, message: 'Invalid parameters' });
  });

  test('transfer - Should work if everything is correct.', async () => {
    const accountController = new AccountController(stubAccountService);
    const { result, error } = await accountController.transfer(VALID_CPF, VALID_CPF2, VALID_LOW_MONTANTE);

    expect(result).toBe(true);
    expect(error).toBe(undefined);
  });

  test('transfer - Should return an error if given cpf is the same for both accounts', async () => {
    const accountController = new AccountController(stubAccountService);
    const { result, error } = await accountController.transfer(VALID_CPF, VALID_CPF, VALID_LOW_MONTANTE);

    expect(result).toBe(undefined);
    expect(error).toMatchObject({ code: 400, message: 'Invalid parameters' });
  });

  test('transfer - Should return an error if any of the two cpfs doesnt exists.', async () => {
    const modifiedStubAccountService = {
      ...stubAccountService,
      doesAccountExists: (cpf: string) => {
        return 0;
      },
    } as unknown as AccountService;

    const accountController = new AccountController(modifiedStubAccountService);
    const { result, error } = await accountController.transfer(VALID_CPF, VALID_CPF, VALID_LOW_MONTANTE);

    expect(result).toBe(undefined);
    expect(error).toMatchObject({ code: 400, message: 'Invalid parameters' });
  });

  test('transfer - Should return an error if the origin account doesnt have enough money', async () => {
    const accountController = new AccountController(stubAccountService);
    const { result, error } = await accountController.transfer(VALID_CPF, VALID_CPF2, VALID_MONTANTE);

    expect(result).toBe(undefined);
    expect(error).toMatchObject({ code: 403, message: 'User doesnt have enough money for this transfer' });
  });
});
