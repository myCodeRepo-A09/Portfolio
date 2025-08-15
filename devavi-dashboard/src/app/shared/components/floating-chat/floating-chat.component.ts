import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Fuse from 'fuse.js';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { io, Socket } from 'socket.io-client';
import { ChatSocketService } from '../../../core/services/chat.service';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../core/environments/environment';
import { SnackbarService } from '../../../core/services/snackbar.service';
interface User {
  name: string;
  online: boolean;
  unreadCount: number;
  _id?: string; // Optional for users fetched from the server
}

interface Message {
  from: string; // Display name (e.g., "Me", "User1")
  sender: string; // Actual sender ID
  receiver?: string; // Optional receiver ID
  content?: string; // Optional since file messages won't have this
  time: string;
  messageType: 'text' | 'file';
  fileMeta?: {
    path: string;
    originalName: string;
  };
  read?: boolean;
  createdAt?: string; // Timestamp for the message
}

@Component({
  selector: 'app-floating-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, PickerModule],
  templateUrl: './floating-chat.component.html',
  styleUrls: ['./floating-chat.component.scss'],
})
export class FloatingChatComponent implements OnInit {
  //hiding functionlity using env
  showChat = environment.chatAttachments;

  //SHOWRDFLAG
  showMessageFlag: boolean = false;
  socket!: Socket;
  messageText = '';
  showChatPopup = false;
  selectedFiles: File[] = [];
  messages: Message[] = [];
  searchTerm = '';
  showEmojiPicker = false;
  activeUser: User = {
    _id: 'defaultUserId', // Default user ID for initial state
    name: 'Admin',
    online: true,
    unreadCount: 0,
  };
  currentUserId: string = ''; // Replace with actual user ID from auth service
  allUsers: User[] = [];
  filteredUsers: User[] = [];

  fuse!: Fuse<User>;
  @ViewChild('chatBox') chatBox!: ElementRef;
  constructor(
    private chatSocket: ChatSocketService,
    private authService: AuthService,
    private snackbarService: SnackbarService
  ) {}
  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    this.currentUserId = userId || 'defaultUserId'; // Replace with actual user ID logic
    this.chatSocket.registerUser(userId);
    this.chatSocket.getAllUsers();
    this.chatSocket.onAllUsers((users: User[]) => {
      this.allUsers = users.map((user) => ({
        ...user,
        unreadCount: 0, // Initialize unread count
      }));
      this.filteredUsers = [...this.allUsers];
      this.activeUser = this.filteredUsers.find(
        (u) => u._id === this.currentUserId
      ) || {
        name: 'Admin',
        online: true,
        unreadCount: 0,
      };
      this.fuse = new Fuse(this.filteredUsers, {
        keys: ['name'],
        threshold: 0.3,
      });

      this.loadMoreMessages();
      // this.scrollToBottom();
    });
    this.chatSocket.onMessageReceived((msg) => {
      if (msg.sender === this.currentUserId) {
      } else if (msg.sender === this.activeUser._id && this.showChatPopup) {
        // User is actively chatting with this person
        this.messages.push(msg);
      } else {
        // It's from another user, or chat popup is closed
        const user = this.allUsers.find((u) => u._id === msg.sender);
        if (user) user.unreadCount++;

        // 🟡 Highlight the chat icon if popup is closed
        if (!this.showChatPopup && this.authService.isAuthenticated()) {
          this.showMessageFlag = true;
        }
      }

      this.scrollToBottom();
    });

    this.chatSocket.onMessageSent((msg) => {
      this.messages.push({
        ...msg,
        from:
          msg.sender === this.currentUserId
            ? 'Me'
            : this.getUserNameById(msg.sender),
      });
      this.scrollToBottom();
    });
    this.chatSocket.onUserStatus(({ userId, online }) => {
      const user = this.allUsers.find((u) => u._id === userId);
      if (user) user.online = online;
    });
    this.chatSocket.onMessageRead(({ messageId, userId }) => {
      if (userId === this.activeUser._id) {
        this.messages.forEach((msg) => {
          if (msg.receiver === this.activeUser._id) {
            msg.read = true;
          }
        });
      }
      this.scrollToBottom();
    });
    this.chatSocket.userMessages((msg) => {
      this.messages = msg.map((m: Message) => ({
        ...m,
        from:
          m.sender === this.currentUserId
            ? 'Me'
            : this.getUserNameById(m.sender),
      }));
      this.messages.sort(
        (a, b) =>
          new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
      );
      console.log('Received message:', msg);
      this.scrollToBottom();
    });
  }

  sendMessage() {
    const msg = {
      senderId: this.currentUserId,
      receiverId: this.activeUser._id,
      content: this.messageText,
      messageType: 'text',
    };
    this.chatSocket.sendMessage(msg);
    this.messageText = '';
  }
  toggleChat() {
    if (!this.authService.isAuthenticated()) {
      this.showChatPopup = false;
      this.snackbarService.warn('Please log in to chat');
    } else {
      this.showChatPopup = !this.showChatPopup;

      if (this.showChatPopup) {
        this.showMessageFlag = false; // ✅ Clear new message highlight
      }
    }
  }

  getUserNameById(id: string): string {
    const user = this.filteredUsers.find((u) => u._id === id);
    return user ? user.name : 'You';
  }

  openChat(user: any) {
    this.activeUser = this.filteredUsers.find((u) => u.online === true) || {
      name: 'Admin',
      online: true,
      unreadCount: 0,
    };
    this.loadMoreMessages();
    // this.markMessagesAsRead();
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
    this.messages = []; // Clear messages when switching users
    //this.chatSocket.getUserById(user._id);
    this.loadMoreMessages();
    this.scrollToBottom();
    this.showMessageFlag = false;
  }

  loadMoreMessages() {
    this.chatSocket.getUserMessagesById(
      this.activeUser._id,
      this.currentUserId
    );
    this.chatSocket.userMessages((message) => {
      this.messages = (message || []).sort(
        (a: Message, b: Message) =>
          new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
      );
      this.scrollToBottom();
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      this.chatBox?.nativeElement?.scrollTo({
        top: this.chatBox.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);
  }

  onEnter(event: any) {
    if (!event.shiftKey) {
      event.preventDefault();
      this.sendMessage(); // Send on Enter
    }
    // Else, allow Shift+Enter for newline
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

  // markMessagesAsRead() {
  //   this.socket.emit('mark-as-read', {
  //     senderId: this.activeUser.name, // person you're chatting with
  //     receiverId: this.currentUserId, // you
  //   });
  // }
}
