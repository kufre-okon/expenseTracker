
export interface RecurrentExpense {
    recurrentId: number;
    isActive: boolean;
    recurrentDate?: Date;
    frequency?: number;
    interval?: number;
    duration?: number;
}
