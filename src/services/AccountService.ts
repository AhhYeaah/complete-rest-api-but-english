import { AppDataSource } from '../database/data-source';
import { Account } from '../database/entities/Account';

export class AccountService {
  constructor(private AccountRepository = AppDataSource.getRepository(Account)) {}

  async doesAccountExists(cpf: string): Promise<boolean> {
    return (await this.AccountRepository.count({ where: { cpf: cpf } })) > 0;
  }

  async saveAccount(name: string, cpf: string): Promise<Account> {
    return this.AccountRepository.save({ cpf, name });
  }

  async checkAccountBalance(cpf: string): Promise<number> {
    return (await this.AccountRepository.findOneOrFail({ where: { cpf: cpf } })).balance;
  }

  async changeAccountBalance(cpf: string, amount: number) {
    const Account = await this.AccountRepository.findOneOrFail({ where: { cpf: cpf } });
    Account.balance += amount;

    return this.AccountRepository.save(Account);
  }

  async transfer(senderCpf: string, receiverCpf: string, amount: number): Promise<true> {
    await this.changeAccountBalance(senderCpf, 0 - amount);
    await this.changeAccountBalance(receiverCpf, amount);

    return true;
  }
}
