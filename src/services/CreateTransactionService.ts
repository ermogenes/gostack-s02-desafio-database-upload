import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute(request: Request): Promise<Transaction> {
    const { title, value, type, category } = request;

    // Get repositories
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    // Check balance for outcome transactions
    if (type === 'outcome') {
      const balance = await transactionsRepository.getBalance();

      if (value > balance.total) {
        throw new AppError(
          'Operation not permitted. Insufficient balance.',
          400,
        );
      }
    }

    // Get category
    const preexistentCategory = await categoriesRepository.findByTitle(
      category,
    );

    let category_id = null;

    if (!preexistentCategory) {
      // Create the category
      const newCategory = categoriesRepository.create({ title: category });
      await categoriesRepository.save(newCategory);
      category_id = newCategory.id;
    } else {
      // Reuse category
      category_id = preexistentCategory.id;
    }

    // Create new transaction
    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
