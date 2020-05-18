import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

import silentTryToDeleteFile from '../util/silentTryToDeleteFile';
import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface CsvLine {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  private async parseCsv(csvPath: string): Promise<CsvLine[]> {
    const lines: CsvLine[] = [];

    const fileStream = fs.createReadStream(csvPath);
    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });
    const csvStream = fileStream.pipe(parseStream);

    csvStream.on('data', async line => {
      lines.push({
        title: line[0],
        type: line[1],
        value: line[2],
        category: line[3],
      });
    });

    await new Promise(resolve => {
      csvStream.on('end', resolve);
    });

    return lines;
  }

  async execute(csvFileName: string): Promise<Transaction[]> {
    const csvPath = path.resolve(uploadConfig.directory, csvFileName);
    const transactions: Transaction[] = [];

    try {
      const parsedLines = await this.parseCsv(csvPath);

      const createTransaction = new CreateTransactionService();

      // eslint-disable-next-line no-restricted-syntax
      for await (const parsedLine of parsedLines) {
        const transaction = await createTransaction.execute(parsedLine);
        transactions.push(transaction);
      }
    } finally {
      await silentTryToDeleteFile(csvPath);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
