import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebChatConversaComponent } from './web-chat-conversa.component';

describe('WebChatConversaComponent', () => {
  let component: WebChatConversaComponent;
  let fixture: ComponentFixture<WebChatConversaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebChatConversaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WebChatConversaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
