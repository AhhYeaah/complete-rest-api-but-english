export interface createAccountTypes {
  body: {
    name: string;
    cpf: string;
  };
}

export interface depositTypes {
  body: {
    cpf: string;
    amount: number;
  };
}

export interface transferTypes {
  body: {
    senderCpf: string;
    receiverCpf: string;
    amount: number;
  };
}
