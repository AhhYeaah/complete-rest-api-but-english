This was an simple API rest made as a code challenge, it was supposed to be done in a period of one week, did it in 8 hours

This repository is a a

# Backend code-challenge

Your **objective** is **creating a REST API** with some fundamental functions regarding the managment of bank accounts. This project can be made in one of the following languages: **Java, Kotlin, Python, Node.js, .NET**

- Only name and cpf (brazilian id) is necessary to create a bank account. One person can have only one account;
- With this account it is possible to make transfers to other accounts and deposit;
- We do not accept negative amounts in the accounts;
- For security reasons, each deposit transaction cannot exceed R$2,000;
- Transfers between accounts are free and unlimited;

You decide how you will make the database.

Dont forget to put instructions in how to run your code on readme.

## Instructions

**Starting the api:**

1. Assign the blank variables at the `.env.example` archive and rename it to `.env`
2. Run `yarn` to download project dependencies.
3. Run `sudo docker-compose up`.
4. In another therminal, run `yarn start`.

**Running tests:**

1. Assign the blank variables at the `.env.example` archive and rename it to `.env`
2. Run `yarn` to download project dependencies.
3. In another therminal, run `yarn test`.
