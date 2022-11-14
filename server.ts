import * as dotenv from 'dotenv';
dotenv.config();
import * as express from 'express';
import { AppDataSource } from './src/./database/data-source';
import { AccountController } from './src/controllers/AccountController';
import { createAccountTypes, depositTypes, transferTypes } from './src/utils/types/endpointTypes';

console.log('\n\t 🔥 Starting engines... 🔥');
AppDataSource.initialize().then(async () => {
  console.log('   Connection with database established.');

  const app = express();
  app.use(express.json());

  app.post('/createAccount', async ({ body: { name, cpf } }: createAccountTypes, res) => {
    const { error, result } = await new AccountController().createAccount(name, cpf);

    if (error) {
      res.status(error.code).send(error.message);
    } else {
      res.status(200).send(result);
    }
  });

  app.put('/deposit', async ({ body: { cpf, amount } }: depositTypes, res) => {
    const { error, result } = await new AccountController().deposit(cpf, Number(amount));

    if (error) {
      res.status(error.code).send(error.message);
    } else {
      res.status(200).send(result);
    }
  });

  app.put('/transfer', async ({ body: { senderCpf, receiverCpf, amount } }: transferTypes, res) => {
    const { error, result } = await new AccountController().transfer(senderCpf, receiverCpf, Number(amount));

    if (error) {
      res.status(error.code).send(error.message);
    } else {
      res.status(200).send(result);
    }
  });

  app.listen(3000);
  console.log('     Server started at localhost:3000');
  console.log('\t   🚀 To the moon! 🚀\n');
});
