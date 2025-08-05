import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.chatSocketUrl, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      timeout: 10000,
    });
  }

  registerUser(userId: string) {
    this.socket.emit('register-user', userId);
  }

  sendMessage(message: any) {
    this.socket.emit('send-message', message);
  }

  onMessageReceived(callback: (msg: any) => void) {
    this.socket.on('receive-message', callback);
  }

  onMessageSent(callback: (msg: any) => void) {
    this.socket.on('message-sent', callback);
  }

  onMessageRead(callback: (data: any) => void) {
    this.socket.on('message-read', callback);
  }

  readMessage(data: { messageId: string; userId: string }) {
    this.socket.emit('read-message', data);
  }

  onUserStatus(
    callback: (status: { userId: string; online: boolean }) => void
  ) {
    this.socket.on('user-status-update', callback);
  }

  disconnect() {
    this.socket.disconnect();
  }

  uploadFile(file: File, userId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();

      formData.append('file', file);
      formData.append('userId', userId);
      this.socket.emit('upload-file', formData, (response: any) => {
        if (response.error) {
          reject(response.error);
        }
        resolve(response.fileUrl);
      });
    });
  }
}
