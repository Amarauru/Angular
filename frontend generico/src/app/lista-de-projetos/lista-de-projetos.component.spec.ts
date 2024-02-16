import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDeProjetosComponent } from './lista-de-projetos.component';

describe('ListaDeProjetosComponent', () => {
  let component: ListaDeProjetosComponent;
  let fixture: ComponentFixture<ListaDeProjetosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaDeProjetosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaDeProjetosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
