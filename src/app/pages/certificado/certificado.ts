import { Component, ElementRef, ViewChild } from '@angular/core';
import { SecondaryButton } from "../../_components/secondary-button/secondary-button";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CertificadoService } from '../../_services/certificado';
import { Certificado as CertificadoInterface } from '../../interfaces/certificado';
import html2canvas from 'html2canvas';
import { estiloElementoCertificado } from '../../interfaces/estiloElementoCertificado';

@Component({
  selector: 'app-certificado',
  imports: [SecondaryButton, RouterLink],
  templateUrl: './certificado.html',
  styleUrl: './certificado.css',
})
export class Certificado {
  id: String | null = null;
  certificado: CertificadoInterface | undefined;
  elementosHTML: estiloElementoCertificado[] = [];
  elementosHtmlEstiloAntigo: estiloElementoCertificado[] = [];

  @ViewChild('certificadoContainer') certificadoElement!: ElementRef;
  @ViewChild('conteudoCertificado') conteudoCertificadoElement!: ElementRef;
  @ViewChild('listaAtividades') listaAtividadesElement!: ElementRef;

  constructor(private certificadoService: CertificadoService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.certificado = this.certificadoService.certificados.find(item => item.id == this.id);
    })
  }

  // Alimentar meu array com os elementos HTML
  ngAfterViewInit(): void {
    const elementos = [
      this.certificadoElement.nativeElement,
      this.conteudoCertificadoElement.nativeElement,
      this.listaAtividadesElement.nativeElement
    ];

    this.elementosHTML = elementos.map(el => {
      const estilo = getComputedStyle(el);
      return {
        elemento: el,
        className: el.className,
        width: estilo.width,
        maxWidth: estilo.maxWidth
      }
    });
  }

  /* Salva as configurações de estilo atuais dos elementos HTML para que eu possa aplicar o estilo
  necessário para o certificado e depois voltar para o estilo antigo */
  pegarEstiloAntigo() {
    this.elementosHtmlEstiloAntigo = this.elementosHTML.map(el => {
      return {
        elemento: el.elemento,
        className: el.className,
        width: el.elemento.style.width,
        maxWidth: el.elemento.style.maxWidth
      }
    })
  }

  // Essa função aplica o estilo que eu preciso que o certificado tenha na hora gerar ele
  aplicarEstiloCertificado() {
    this.elementosHTML.forEach(el => {
      el.elemento.classList.remove('w-100');
      el.elemento.style.width = el.maxWidth;
      el.elemento.style.maxWidth = 'none';
    })
  }

  // Essa função volta o estilo dos elementos HTML para o estilo que eles tinham antes de gerar o certificado (Util para mobile)
  voltarEstiloAntigo() {
    this.elementosHtmlEstiloAntigo.forEach(el => {
      el.elemento.classList.add('w-100');
      el.elemento.style.width = el.width;
      el.elemento.style.maxWidth = el.maxWidth;
      el.elemento.style.width = "none";
    })
  }

  downloadCertificado() {
    this.pegarEstiloAntigo();
    this.aplicarEstiloCertificado();

    if(this.certificado == undefined) {
      return;
    }
    html2canvas(this.certificadoElement.nativeElement, {scale: 2}).then(
      canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `certificado_${this.certificado?.nome.replaceAll(" ", "_")}.png`; //certicado_luan.png
        link.click();
      }
    )

    this.voltarEstiloAntigo();
  }
}
