import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({title,value,type}: Request): Transaction {
    //validando se o tipo esta dentro do esperado
    /**método tradicional de if 
     * if (type !== 'income' && type !== 'outcome') 
     * abaixo método novo
     * o includes compara se o type possui algum dos valores dentro do 
     * seu array, caso incluir o if retorna true.
     * Negando a expressão com o !(exclamação), caso o if não incluir ele 
     * retornara true, assim entrando no erro.
     * */ 
      if (!['income','outcome'].includes(type))
    {
      throw new Error('Tipo invalido, entre com um tipo valido')
    }

    //validando o valor da transação e comparando com o saldo(total),
    //porque nao pode criar uma saida se nao houver saldo positivo.
    const {total} = this.transactionsRepository.getBalance()
    
    if (type === 'outcome' && total < value) {
      throw new Error('Você não tem saldo sulficiente')
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    })
    return transaction;
  }
}

export default CreateTransactionService;
