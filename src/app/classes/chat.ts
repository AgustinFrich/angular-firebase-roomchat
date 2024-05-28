export class Chat {
  room: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  message: string;
  time: number;

  constructor(
    senderId: string,
    receiverId: string,
    senderName: string,
    message: string
  ) {
    this.room = senderId + receiverId;
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.senderName = senderName;
    this.message = message;
    this.time = Date.now();
  }
}
