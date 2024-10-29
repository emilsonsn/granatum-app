import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebChatHeaderComponent } from './web-chat-header.component';

describe('WebChatHeaderComponent', () => {
  let component: WebChatHeaderComponent;
  let fixture: ComponentFixture<WebChatHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebChatHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WebChatHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
