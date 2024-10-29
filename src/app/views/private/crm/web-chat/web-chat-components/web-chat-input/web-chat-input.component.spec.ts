import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebChatInputComponent } from './web-chat-input.component';

describe('WebChatInputComponent', () => {
  let component: WebChatInputComponent;
  let fixture: ComponentFixture<WebChatInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebChatInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WebChatInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
