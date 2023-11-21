import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BillToReceive } from 'src/app/interfaces/bill-to-receive';
import { BillsToReceiveService } from 'src/app/services/bills-to-receive.service';
import { map } from 'rxjs';
@Component({
    templateUrl: './bills-to-receive.component.html',
    providers: [MessageService],
})
export class BillsToReceiveComponent implements OnInit {
    public cols: any[] = [];
    public rowsPerPageOptions = [5, 10, 20];
    public form!: FormGroup;
    public items: BillToReceive[] = [];
    public item!: BillToReceive;
    public itemDialog: boolean = false;
    public deleteItemDialog: boolean = false;

    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private billsToReceiveService: BillsToReceiveService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        this.onCreateForm();
        this.onLoadItems();
        this.onLoadCols();
    }

    onLoadCols() {
        this.cols = [
            { field: 'name', header: 'Nome' },
            { field: 'paymentMethod', header: 'Método de Pagamento' },
            { field: 'receiptDate', header: 'Data de Recebimento' },
            { field: 'invoiceType', header: 'Tipo de Fatura' },
            { field: 'obs', header: 'Observação' },
        ];
    }

    openNew() {
        this.itemDialog = true;
        this.form.reset();
    }

    hideDialog() {
        this.itemDialog = false;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    onCreateForm() {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            paymentMethod: ['', Validators.required],
            receiptDate: ['', Validators.required],
            invoiceType: ['', Validators.required],
            obs: ['', Validators.required],
        });
    }

    onLoadItems() {
        this.billsToReceiveService
            .getAll()
            .snapshotChanges()
            .pipe(
                map((changes) =>
                    changes.map((c) => ({
                        id: c.payload.doc.id,
                        ...c.payload.doc.data(),
                    }))
                )
            )
            .subscribe((data) => {
                this.items = data;
            });
    }

    onSaveForm() {
        if (!this.item?.id) {
            return this.createBillToReceive();
        }

        return this.updateBillToReceive(this.item.id);
    }

    createBillToReceive() {
        this.billsToReceiveService.create(this.form.value).then(() => {
            this.itemDialog = false;
            this.form.reset();

            this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Conta a receber criada!',
                life: 3000,
            });
        });
    }

    updateBillToReceive(id: string) {
        this.billsToReceiveService.update(id, this.form.value).then((res) => {
            this.itemDialog = false;

            this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Conta a receber atualizada!',
                life: 3000,
            });

            this.form.reset();
        });
    }

    deleteBillToReceive(billToReceive: BillToReceive) {
        this.deleteItemDialog = true;
        this.item = billToReceive;
    }

    confirmDeleteBillToReceive() {
        if (!this.item.id) {
            return;
        }
        this.billsToReceiveService.delete(this.item.id).then((res) => {
            this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Conta a receber deletada!',
                life: 3000,
            });

            this.deleteItemDialog = false;
        });
    }

    editBillToReceive(item: BillToReceive) {
        const id = item.id;
        this.item = item;
        delete item.id;
        this.form.setValue(item);

        this.itemDialog = true;
        this.item.id = id;
    }
}
