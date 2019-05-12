
export interface Expense {
    expenseId: number;
    categoryId: number;
    accountId: number;
    description: string;
    amount?: number;
    date?: Date;
    isRecurrent: boolean;
    recurrentId?: number;
    budgetId?: number;
}
