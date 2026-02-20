import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificadoForm } from './certificado-form';

describe('CertificadoForm', () => {
  let component: CertificadoForm;
  let fixture: ComponentFixture<CertificadoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificadoForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificadoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
