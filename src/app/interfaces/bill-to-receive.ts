export interface BillToReceive {
    id?: string;
    name: string;
    paymentMethod: string;
    receiptDate: Date;
    invoiceType: string;
    obs: string;
}
