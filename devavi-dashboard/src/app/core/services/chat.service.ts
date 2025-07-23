import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:4000');
  }

  joinRoom(userId: string, friendId: string) {
    this.socket.emit('joinRoom', { userId, friendId });
  }

  sendMessage(data: any) {
    this.socket.emit('sendMessage', data);
  }

  onNewMessage(callback: (msg: any) => void) {
    this.socket.on('newMessage', callback);
  }

  uploadAttachment(formData: FormData) {
    return this.http.post<{ fileUrl: string }>(
      'http://localhost:4000/upload',
      formData
    );
  }

  getChatHistory(userId: string, friendId: string) {
    return this.http.get<any[]>(
      `http://localhost:4000/api/chats/${userId}/${friendId}`
    );
  }
}
