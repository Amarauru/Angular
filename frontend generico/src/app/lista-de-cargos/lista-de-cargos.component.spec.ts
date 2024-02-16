import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDeCargosComponent } from './lista-de-cargos.component';

describe('ListaDeCargosComponent', () => {
  let component: ListaDeCargosComponent;
  let fixture: ComponentFixture<ListaDeCargosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaDeCargosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaDeCargosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
