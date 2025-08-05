import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Fuse from 'fuse.js';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { io, Socket } from 'socket.io-client';
import { ChatSocketService } from '../../../core/services/chat.service';

interface User {
  name: string;
  online: boolean;
  unreadCount: number;
}

interface Message {
  from: string;
  text: string;
  time: string;
}

@Component({
  selector: 'app-floating-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, PickerModule],
  templateUrl: './floating-chat.component.html',
  styleUrls: ['./floating-chat.component.scss'],
})
export class FloatingChatComponent implements OnInit {
  socket!: Socket;
  messageText = '';
  selectedFiles: File[] = [];
  messages: Message[] = [];
  searchTerm = '';
  showEmojiPicker = false;
  activeUser: User = { name: 'Admin', online: true, unreadCount: 0 };
  currentUserId = 'current-user-id'; // Replace with actual user ID from auth service
  allUsers: User[] = [
    { name: 'Admin', online: true, unreadCount: 0 },
    { name: 'User1', online: false, unreadCount: 2 },
    { name: 'User2', online: true, unreadCount: 5 },
    { name: 'User3', online: true, unreadCount: 0 },
  ];
  filteredUsers: User[] = [];

  fuse!: Fuse<User>;
  @ViewChild('chatBox') chatBox!: ElementRef;
  constructor(private chatSocket: ChatSocketService) {}
  ngOnInit(): void {
    const userId = '...'; // load from auth or service
    this.chatSocket.registerUser(userId);

    this.chatSocket.onMessageReceived((msg) => {
      if (msg.sender === this.activeUser.name) {
        this.messages.push(msg);
      } else {
        const user = this.allUsers.find((u) => u.name === msg.sender);
        if (user) user.unreadCount++;
      }
      this.scrollToBottom();
    });

    this.chatSocket.onMessageSent((msg) => {
      this.messages.push(msg);
      this.scrollToBottom();
    });

    this.chatSocket.onUserStatus(({ userId, online }) => {
      const user = this.allUsers.find((u) => u.name === userId);
      if (user) user.online = online;
    });

    this.chatSocket.onMessageRead(({ messageId, userId }) => {
      if (userId === this.activeUser.name) {
        this.messages.forEach((msg) => {
          // if (msg.receiver === data.by) {
          //   msg.read = true;
          // }
        });
      }
    });
    this.openChat('Admin'); // Open chat with default user
    this.filteredUsers = [...this.allUsers];
    this.fuse = new Fuse(this.allUsers, {
      keys: ['name'],
      threshold: 0.3,
    });
  }

  sendMessage() {
    const msg = {
      senderId: this.currentUserId,
      receiverId: this.activeUser.name,
      content: this.messageText,
      messageType: 'text',
    };
    this.chatSocket.sendMessage(msg);
    this.messageText = '';
  }

  openChat(user: any) {
    this.activeUser = user;
    this.loadMoreMessages();
    this.markMessagesAsRead();
  }

  handleFileChange(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  addEmoji(event: any) {
    this.messageText += event.emoji.native;
  }

  onSearchChange() {
    if (this.searchTerm.trim()) {
      this.filteredUsers = this.fuse
        .search(this.searchTerm)
        .map((result) => result.item);
    } else {
      this.filteredUsers = [...this.allUsers];
    }
  }

  selectUser(user: User) {
    this.activeUser = user;
    user.unreadCount = 0;
    // Load conversation if needed
    this.messages = []; // Reset for now
  }

  loadMoreMessages() {
    // Lazy load older messages
    const newMessages: Message[] = Array.from({ length: 5 }).map((_, i) => ({
      from: 'User',
      text: `Old message ${i + 1}`,
      time: new Date().toLocaleTimeString(),
    }));
    this.messages = [...newMessages, ...this.messages];
  }

  scrollToBottom() {
    setTimeout(() => {
      this.chatBox?.nativeElement?.scrollTo({
        top: this.chatBox.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('senderId', this.currentUserId);
    formData.append('receiverId', this.activeUser.name);
    formData.append('messageType', 'file');

    this.chatSocket
      .uploadFile(file, this.currentUserId)
      .then((fileUrl) => {
        const msg = {
          senderId: this.currentUserId,
          receiverId: this.activeUser.name,
          content: fileUrl,
          messageType: 'file',
        };
        this.chatSocket.sendMessage(msg);
      })
      .catch((error) => {
        console.error('File upload error:', error);
      });
    this.messageText = '';
    this.selectedFiles = [];
  }

  markMessagesAsRead() {
    this.socket.emit('mark-as-read', {
      senderId: this.activeUser.name, // person you're chatting with
      receiverId: this.currentUserId, // you
    });
  }
}
