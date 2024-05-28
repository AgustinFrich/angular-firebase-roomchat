import { Injectable } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
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
  setDoc,
} from '@angular/fire/firestore';
import { User } from '../classes/user';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { updateDoc } from '@firebase/firestore';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loading = false;
  emitChangeSource = new Subject<User | null>();
  usuarioCambio$ = this.emitChangeSource.asObservable();

  user: User | null = null;
  private usersCol = collection(this.fs, 'users');

  constructor(
    private fs: Firestore,
    private auth: AngularFireAuth,
    private storage: Storage,
    private router: Router
  ) {
    this.cambio();
  }

  postUser(mail: string, password: string, name: string, image?: File) {
    this.user = new User(name, mail.toLowerCase(), password);
    this.auth
      .createUserWithEmailAndPassword(mail.toLowerCase(), password)
      .then(() => {
        this.auth
          .signInWithEmailAndPassword(mail.toLowerCase(), password)
          .then((user) => {
            this.createUser(this.user!, image);
          });
      })
      .catch((err: any) => {
        if (err.code === 'auth/email-already-in-use') {
          console.log('err');
        }
      });
  }

  async createUser(user: User, image?: File) {
    if (image !== undefined) {
      const filePath = 'profiles/users/' + user.name + '-' + Date.now();
      const storageRef = ref(this.storage, filePath);
      await uploadBytes(storageRef, image);
      const url = await getDownloadURL(storageRef);
      user.profileImg = url;
      const d = doc(this.usersCol);
      user.id = d.id;
      setDoc(d, { ...user });
      this.user = user;
    } else {
      const d = doc(this.usersCol);
      user.id = d.id;
      setDoc(d, { ...user });
      this.user = user;
    }
  }

  async login(mail: string, password: string) {
    await this.auth.signOut();
    this.auth
      .signInWithEmailAndPassword(mail.toLowerCase(), password)
      .then(async (user) => {
        const q = query(
          collection(this.fs, 'Usuarios'),
          where('mail', '==', mail.toLocaleLowerCase())
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((document) => {
          this.user = document.data() as User;
        });
      })
      .catch((err: any) => {});
  }

  cambio() {
    this.auth.onAuthStateChanged(async (user) => {
      this.loading = true;
      if (user !== null) {
        console.log(user);
        const q = query(this.usersCol, where('mail', '==', user.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
          this.user = doc.data() as User;
        });
      }

      if (this.user !== null) {
        console.log(this.user);
        this.emitChangeSource.next(this.user);
        this.router.navigateByUrl('chat').then(() => {
          this.loading = false;
        });
      } else {
        this.emitChangeSource.next(null);
        this.router.navigateByUrl('login').then(() => {
          this.loading = false;
        });
      }
      this.loading = false;
    });
  }

  salir() {
    this.emitChangeSource.next(null);
    this.user = null;
    this.auth.signOut();
  }

  setOnline() {
    if (this.user !== null) {
      const d = doc(this.usersCol, this.user.id);
      updateDoc(d, { connected: true });
    }
  }

  setOffline() {
    if (this.user !== null) {
      const d = doc(this.usersCol, this.user.id);
      updateDoc(d, { connected: false, updatedAt: Date.now() });
    }
  }
}
