import { Component } from '@angular/core';
import { ChatService } from '../../../core/services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-floating-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './floating-chat.component.html',
  styleUrl: './floating-chat.component.scss',
})
export class FloatingChatComponent {
  chatOpen = false;
  friends = [
    { id: 'admin', name: 'Admin' },
    { id: 'user2', name: 'User 2' },
  ];
  selectedFriend = this.friends[0];
  messages: any[] = [];
  newMessage = '';
  userId = 'currentUserId';
  selectedFile: File | null = null;

  constructor(private chatService: ChatService) {
    this.loadChat();
    this.chatService.joinRoom(this.userId, this.selectedFriend.id);
    this.chatService.onNewMessage((msg) => {
      this.messages.push(msg);
    });
  }

  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }

  selectFriend(friend: any) {
    this.selectedFriend = friend;
    this.messages = [];
    this.loadChat();
    this.chatService.joinRoom(this.userId, friend.id);
  }

  loadChat() {
    this.chatService
      .getChatHistory(this.userId, this.selectedFriend.id)
      .subscribe((data: any) => {
        this.messages = data;
      });
  }

  sendMessage() {
    if (!this.newMessage) return;
    const msg = {
      senderId: this.userId,
      receiverId: this.selectedFriend.id,
      message: this.newMessage,
      type: 'text',
    };
    this.chatService.sendMessage(msg);
    this.messages.push(msg);
    this.newMessage = '';
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  sendAttachment() {
    if (!this.selectedFile) return;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.chatService.uploadAttachment(formData).subscribe((res: any) => {
      const msg = {
        senderId: this.userId,
        receiverId: this.selectedFriend.id,
        message: res.fileUrl,
        type: 'attachment',
      };
      this.chatService.sendMessage(msg);
      this.messages.push(msg);
      this.selectedFile = null;
    });
  }
}
