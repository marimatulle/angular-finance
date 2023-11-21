import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { BillToReceive } from '../interfaces/bill-to-receive';

@Injectable({
    providedIn: 'root',
})
export class BillsToReceiveService {
    private dbPathBillToReceive = 'bill-to-receive';
    private billToReceiveRef: AngularFirestoreCollection<any>;

    constructor(private db: AngularFirestore) {
        this.billToReceiveRef = db.collection(this.dbPathBillToReceive);
    }

    getAll(): AngularFirestoreCollection<any> {
        return this.billToReceiveRef;
    }

    create(billToReceive: BillToReceive) {
        return this.billToReceiveRef.add(billToReceive);
    }

    update(id: string, data: BillToReceive): Promise<void> {
        return this.billToReceiveRef.doc(id).update(data);
    }

    delete(id: string): Promise<void> {
        return this.billToReceiveRef.doc(id).delete();
    }
}
