import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LandingHomeService } from 'app/services/landing-home/landing-home.service';
import { environment } from 'environments/environment';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { LandingEventosService } from 'app/services/landing-eventos/landing-eventos.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector     : 'landing-home',
    templateUrl  : './evento.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./evento.component.scss'],
    standalone   : true,
    imports      : [MatButtonModule, RouterLink, MatIconModule, CommonModule, CarouselModule],
})
export class LandingEventoComponent
{
    showListEvents: boolean = false;
    showMobileMenu: boolean = false;

    landing: any;
    URL = environment.urlImg;
    slugLandingEvento: any = '';
    landingEvento: any = {};

    banners: string[] = [];

    galleryHotel: string[] = [];

    availableCategories = [];
    hotel: any = {};
    programas = [];
    programasAgrupados: any;
    cronograma = [];
    arrayQueIncluye = [];

    colorFondo: any = '';

    carouselOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: true,
        navSpeed: 700,
        navText: ['Anterior', 'Siguiente'],
        responsive: {
          0: {
            items: 1
          },
          768: {
            items: 1
          },
          992: {
            items: 1
          }
        },
        autoplay: true, // Habilita el autoplay
        toplayTimeout: 3000 // Cambia las imágenes cada 3 segundos (3000 milisegundos)
      };

    iframe: any = '';
    iframeSanitizer: any;
    serviciosHotel: string = '';

    /**
     * Constructor
     */
    constructor(private _landingHomeService: LandingHomeService,
        private router: Router,
        private _landingEventosService: LandingEventosService,
        private activatedRoute: ActivatedRoute,
        private _sanitizer: DomSanitizer)
    {
        this.landing = {
            nosotros: '',
            mensaje: '',
            telefono_fijo: '',
            telefono_movil: '',
            correo_contacto: '',
            url_facebook: '',
            domicilio: '',
            imagen: ''
        };

        this.getLanding();
        this.activatedRoute.parent.params.subscribe(async params => {
            this.slugLandingEvento = (params['slug']);
            //console.log(this.slugLandingEvento);
            this.getLandingEvento();  
        });  
    }

    getLanding() {
        this._landingHomeService.getLanding().subscribe(
            (response: any) => {
                if (response.result) {
                    const data = response.data;
                    this.asignarValores(data);
                } else {
                    console.error(
                        'Error al obtener la lista:',
                        response.message
                    );
                }
            },
            (error) => {
                console.error('Error al obtener la lista:', error);
            }
        );
    }

    getLandingEvento() {
        this._landingEventosService.getLandingEvento(this.slugLandingEvento).subscribe(
            (response: any) => {
                if (response.result) {
                    const data = response.data;
                    //validacion si no se encuentra el evento
                    if(data === null) {
                        this.router.navigate(['/home']);
                    }
                    this.landingEvento = data;
                    this.banners = this.landingEvento.banners.map(objeto => objeto.banner);
                    this.availableCategories = this.landingEvento.evento.available_categories;
                    this.hotel = this.landingEvento.evento.hotel;
                    this.galleryHotel = this.hotel?.galleries ? this.hotel?.galleries : [];
                    this.programas = this.landingEvento.programas;
                    this.colorFondo = this.landingEvento.color_fondo;
                    this.iframe = this.landingEvento.iframe_maps;
                    this.iframeSanitizer = this._sanitizer.bypassSecurityTrustHtml(this.iframe);
                    this.organizarProgramas(this.programas);
                    this.organizarQueIncluye(this.landingEvento.que_incluye);
                    this.convertServicesToText(this.hotel?.servicios);
                    console.log(this.landingEvento);
                } else {
                    console.error(
                        'Error al obtener la lista:',
                        response.message
                    );
                }
            },
            (error) => {
                console.error('Error al obtener la lista:', error);
            }
        );
    }

    convertServicesToText(arrayServicios: any[] = []) {
        //obtenemos todos los nombres de los servcios en un array
        let servicios = arrayServicios.map(objeto => objeto.descripcion);
        //unimos todos los nombres de los servicios en una cadena
        let serviciosText = servicios.length > 0 ? servicios.join(', ') : '';

        this.serviciosHotel = serviciosText;
    }

    organizarQueIncluye(que_incluye: any) {
        let partes = que_incluye.split('-').map(item => item.trim()).filter(Boolean);
        this.arrayQueIncluye = partes;
    }

    organizarProgramas(programas: any) {
        const diasAgrupados = programas.reduce((agrupados, objeto) => {
            const fecha = objeto.fecha;
            if (!agrupados[fecha]) {
                agrupados[fecha] = [];
            }
            agrupados[fecha].push(objeto);
            return agrupados;
        }, {});

        let fechasKeys = Object.keys(diasAgrupados);
        
        let fechaOrdenadas = fechasKeys.sort();
        
        let programasOrdenados = {};

        fechaOrdenadas.forEach(function(fecha) {
            programasOrdenados[fecha] = diasAgrupados[fecha];
        });

        this.programasAgrupados = programasOrdenados;

        const primerPropiedad = Object.keys(this.programasAgrupados)[0];
        
        this.cronograma = this.programasAgrupados[primerPropiedad];

        //console.log(this.programasAgrupados);
    }

    asignarValores(data: any) {
        const srcNosotros = this.URL + '/assets/images/' + data.imagen;
        const telMovilFormateado = data.telefono_movil.slice(0, 3) + '-' + data.telefono_movil.slice(3, 6) + '-' + data.telefono_movil.slice(6);
        const telFijoFormateado = data.telefono_fijo.slice(0, 3) + '-' + data.telefono_fijo.slice(3, 6) + '-' + data.telefono_fijo.slice(6);
        this.landing.nosotros = data.nosotros;
        this.landing.mensaje = data.mensaje;
        this.landing.telefono_fijo = telFijoFormateado;
        this.landing.telefono_movil = telMovilFormateado;
        this.landing.correo_contacto = data.correo_contacto;
        this.landing.url_facebook = data.url_facebook;
        this.landing.domicilio = data.domicilio;
        this.landing.imagen = srcNosotros;

        //console.log(this.landing);
    }

    scrollToSection(id: string): void {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    redirectSingUp() {
        const accessToken = localStorage.getItem('accessToken');
        if(accessToken) {
            this.router.navigate(['/menu']);
        }else {
            this.router.navigate(['/sign-up']);
        }
    }

    redirectToRegisterEvent() {
        this.router.navigate(['/registro/evento/'+ this.slugLandingEvento]);
    }

    descargarPdf() {
        const nombreArchivo = this.landingEvento.pdf_programa;
        const data = {
            nombre_pdf: nombreArchivo
        };
        this._landingEventosService.descargarPdf(data).subscribe(
            (response: any) => {
                if (response.result) {
                    const pdfBase64 = response.data.pdf_base64;
                    console.log(response);
                    this.descargarArchivo(pdfBase64);
                } else {
                    console.error(
                        'Error al obtener la lista:',
                        response.message
                    );
                }
            },
            (error) => {
                console.error('Error al obtener la lista:', error);
            }
        );
    }
    
    descargarArchivo(pdfBase64: string) {
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${pdfBase64}`;
        link.download = 'programa.pdf';
        link.click();
    }

    seleccionarDia(event: any) {
        const dia = event.target.value;
        const cronograma = this.programasAgrupados[dia];

        this.cronograma = cronograma;
    }

    formatearFecha(fecha: string): string {
        const fechaNumerica = fecha;
        const newFecha: Date = new Date(fechaNumerica);
        newFecha.setUTCHours(0, 0, 0, 0);
        const opcionesFormato: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC'
        };
        const fechaFormateada: string = newFecha.toLocaleDateString('es-Es', opcionesFormato);

        return fechaFormateada;
    }

    formattedDateWithDay(fecha: string): string {
        if(fecha) {
            const fechaNumerica = fecha;
            const newFecha: Date = new Date(fechaNumerica);
            newFecha.setUTCHours(0, 0, 0, 0);
            const opcionesFormato: Intl.DateTimeFormatOptions = {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC'
            };
            const fechaFormateada: string = newFecha.toLocaleDateString('es-Es', opcionesFormato);

            return fechaFormateada;
        }
        
        return '';
    }

    getDay(text: string): string {
        const texto = text;
        const partes = texto.split(' ');

        if(partes.length > 0) {
            return partes[0].toUpperCase();
        }
        return '';
    }

    getTextDay(text: string): string {
        const texto = text;
        const partes = texto.split(' ');

        if(partes.length > 1) {
            return partes[1].toUpperCase();
        }
        return '';
    }

    redirectToReservationHotel() {
        this.router.navigate(['/reservacion-hotel/evento/'+ this.slugLandingEvento]);
    }
}
