import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBudgetGeneratedComponent } from './dialog-budget-generated.component';

describe('DialogBudgetGeneratedComponent', () => {
  let component: DialogBudgetGeneratedComponent;
  let fixture: ComponentFixture<DialogBudgetGeneratedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogBudgetGeneratedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogBudgetGeneratedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
