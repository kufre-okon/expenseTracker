import { ExpenseTypeEnum } from './expense-enum';

export interface Category {
    id: number;
    name: string;
    type: ExpenseTypeEnum;
}
