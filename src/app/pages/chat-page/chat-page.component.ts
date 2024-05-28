import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chat } from 'src/app/classes/chat';
import { User } from 'src/app/classes/user';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss'],
})
export class ChatPageComponent implements OnInit, OnDestroy {
  userList: any[] = [];
  otherUser: User | null = null;
  messages: Chat[] = [];
  message: string = '';

  constructor(public authS: AuthService, private chatS: ChatService) {}

  unsubChat: Subscription = new Subscription();
  unsubUsr: Subscription = new Subscription();

  ngOnInit(): void {
    document.addEventListener('keydown', this.sendMessageCB, false);

    this.authS.setOnline();
    this.authS.usuarioCambio$.subscribe((usr) => {
      console.log('lo tengo');
      this.unsubUsr.unsubscribe();
      if (usr !== null) {
        this.authS.setOnline();
        this.unsubUsr = this.chatS.getUserList(usr.id).subscribe((d) => {
          this.userList = d;

          if (this.otherUser !== null) {
            console.log(this.otherUser);
            d.forEach((usr) => {
              console.log(usr.id + ' - ' + this.otherUser!.id);
              if (usr.id === this.otherUser!.id) {
                this.otherUser!.connected = usr.connected;
                this.otherUser!.updatedAt = usr.updatedAt;
              }
            });
          }
        });
      }
    });
    if (this.authS.user !== null) {
      this.unsubUsr = this.chatS
        .getUserList(this.authS.user!.id)
        .subscribe((d) => {
          this.userList = d;

          if (this.otherUser !== null) {
            console.log(this.otherUser);
            d.forEach((usr) => {
              console.log(usr.id + ' - ' + this.otherUser!.id);
              if (usr.id === this.otherUser!.id) {
                this.otherUser!.connected = usr.connected;
                this.otherUser!.updatedAt = usr.updatedAt;
              }
            });
          }
        });
    }
  }

  isMine(msg: any) {
    return msg.senderId === this.authS.user?.id; //user.id
  }

  selectOtherUser(usr: User) {
    this.unsubChat.unsubscribe();
    this.otherUser = usr;
    this.unsubChat = this.chatS
      .getChat(this.authS.user!.id, this.otherUser!.id)
      .subscribe((d) => {
        this.messages = d.sort((a, b) => {
          return a.time > b.time ? 1 : -1;
        });
      });
  }

  sendMessage() {
    if (this.message !== '') {
      this.chatS.sendMsg(this.authS.user!, this.otherUser!, this.message);
      this.message = '';
    }
  }

  sendMessageCB = (event: any) => {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  };

  ngOnDestroy(): void {
    this.unsubUsr.unsubscribe();
    this.authS.setOffline();
    document.removeEventListener('keydown', this.sendMessageCB, false);
  }

  salir() {
    this.authS.setOffline();
    this.authS.salir();
  }

  lastTime(last: number) {
    last = Date.now() - last;
    const days = last / (1000 * 60 * 60 * 24);
    const hours = last / (1000 * 60 * 60);
    const minutes = last / (1000 * 60);
    const response =
      days > 1
        ? days.toFixed(0) + ' days ago'
        : hours > 1
        ? hours.toFixed(0) + ' hours ago'
        : minutes > 1
        ? minutes.toFixed(0) + ' minutes ago'
        : 'a few seconds ago';

    return response;
  }
}
