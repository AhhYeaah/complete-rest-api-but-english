import { Account } from '../database/entities/Account';
import { AccountService } from '../services/AccountService';
import { resolveErrorObject } from '../utils/errors/errors';
import { isCPF } from '../utils/validation/isCpf';
import { isNotEmpty } from '../utils/validation/isNotEmpty';
import { isValidAmount } from '../utils/validation/isValidAmount';

interface ControlerResponse<T> {
  result?: T;
  error?: { code: number; message: string };
}

export class AccountController {
  constructor(private accountService = new AccountService()) {}

  async createAccount(name: string, cpf: string): Promise<ControlerResponse<Account>> {
    if (!isNotEmpty(name) || !isCPF(cpf)) {
      return resolveErrorObject(400);
    }

    try {
      if (await this.accountService.doesAccountExists(cpf)) {
        return resolveErrorObject(403, 'User already exists');
      }

      return { result: await this.accountService.saveAccount(name, cpf) };
    } catch (error) {
      return resolveErrorObject(500);
    }
  }
  //beaware of the typescript type nerd
  async deposit(cpf: string, amount: number): Promise<ControlerResponse<Pick<Account, 'cpf' | 'balance'>>> {
    if (!isValidAmount(amount) || !isCPF(cpf)) {
      return resolveErrorObject(400);
    }

    try {
      if (amount > 2000) {
        return resolveErrorObject(403, 'Deposits cant exceed R$2000');
      }
      if (!(await this.accountService.doesAccountExists(cpf))) {
        return resolveErrorObject(404, 'User not found');
      }

      const { balance } = await this.accountService.changeAccountBalance(cpf, amount);
      return { result: { cpf, balance } };
    } catch (error) {
      return resolveErrorObject(500);
    }
  }

  async transfer(senderCpf: string, receiverCpf: string, amount: number): Promise<ControlerResponse<true>> {
    if (!isValidAmount(amount) || !isCPF(senderCpf) || !isCPF(receiverCpf) || senderCpf === receiverCpf) {
      return resolveErrorObject(400);
    }

    try {
      if (
        !(await this.accountService.doesAccountExists(senderCpf)) ||
        !(await this.accountService.doesAccountExists(receiverCpf))
      ) {
        return resolveErrorObject(404, 'User not found');
      }

      const balanceAccountOrigem = await this.accountService.checkAccountBalance(senderCpf);

      if (balanceAccountOrigem - amount < 0) {
        return resolveErrorObject(403, 'User doesnt have enough money for this transfer');
      }

      return { result: await this.accountService.transfer(senderCpf, receiverCpf, amount) };
    } catch (error) {
      if (error) return resolveErrorObject(500);
    }
  }
}
