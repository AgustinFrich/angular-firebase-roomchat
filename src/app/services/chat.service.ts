import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../classes/user';
import {
  doc,
  Firestore,
  query,
  where,
  collectionData,
  docData,
  getDocs,
  Timestamp,
  collection,
  addDoc,
  orderBy,
} from '@angular/fire/firestore';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Chat } from '../classes/chat';
import { getDoc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private fs: Firestore) {}

  chatCol = collection(this.fs, 'chats');
  usersCol = collection(this.fs, 'users');

  //Obtiene la lista de usuarios excluyendo al que la solicita
  getUserList(myId: string) {
    const q = query(this.usersCol, where('id', '!=', myId));
    return collectionData(q) as Observable<User[]>;
  }

  getChat(senderId: string, receiverId: string) {
    const q = query(
      this.chatCol,
      where(`room`, 'in', [senderId + receiverId, receiverId + senderId])
    );
    return collectionData(q) as Observable<Chat[]>;
  }

  async getUserStatus(id: string) {
    const d = doc(this.usersCol, '/' + id);
    return (await getDoc(d)).data() as User;
  }

  sendMsg(usr: User, other: User, message: string) {
    const msg = new Chat(usr.id, other.id, usr.name, message);
    addDoc(this.chatCol, { ...msg });
  }
}
