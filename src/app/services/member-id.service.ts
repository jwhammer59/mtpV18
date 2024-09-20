import { Injectable, inject } from '@angular/core';
import { MemberId } from '../models/member-id';

import {
  Firestore,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  collectionData,
  docData,
} from '@angular/fire/firestore';

import { collection } from '@firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberIdService {
  private fs = inject(Firestore);

  dbPath: string = 'mtp_member-ids';

  getMemberIds(): Observable<MemberId[]> {
    let memberIdRef = collection(this.fs, `${this.dbPath}`);
    return collectionData(memberIdRef, { idField: 'id' }) as Observable<
      MemberId[]
    >;
  }

  getMemberId(id: string): Observable<MemberId> {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<MemberId>;
  }

  addMemberId(memberId: MemberId) {
    return addDoc(collection(this.fs, `${this.dbPath}`), memberId);
  }

  updateMemberId(id: string, memberIds: any) {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return updateDoc(docRef, memberIds);
  }

  deleteMemberId(id: string) {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return deleteDoc(docRef);
  }
}
