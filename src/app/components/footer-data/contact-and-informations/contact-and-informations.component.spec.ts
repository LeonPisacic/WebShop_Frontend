import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAndInformationsComponent } from './contact-and-informations.component';

describe('ContactAndInformationsComponent', () => {
  let component: ContactAndInformationsComponent;
  let fixture: ComponentFixture<ContactAndInformationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactAndInformationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactAndInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
