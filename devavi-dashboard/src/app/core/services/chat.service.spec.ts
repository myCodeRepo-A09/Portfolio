import { TestBed } from '@angular/core/testing';

import { ChatSocketService } from './chat.service';

describe('ChatService', () => {
  let service: ChatSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
