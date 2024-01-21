import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizableDivComponent } from './resizable-div.component';

describe('ResizableDivComponent', () => {
  let component: ResizableDivComponent;
  let fixture: ComponentFixture<ResizableDivComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizableDivComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResizableDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
