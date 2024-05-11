import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LandingHomeService } from 'app/services/landing-home/landing-home.service';
import { environment } from 'environments/environment';
import { LandingEventosService } from 'app/services/landing-eventos/landing-eventos.service';

@Component({
  selector: 'app-terminos-condiciones',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './terminos-condiciones.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./terminos-condiciones.component.scss']
})
export class TerminosCondicionesComponent {

  showListEvents: boolean = false;
  showMobileMenu: boolean = false;

  landing: any;
  URL = environment.urlImg;


  constructor(private _landingHomeService: LandingHomeService,
    private router: Router,
    private _landingEventosService: LandingEventosService) {
    this.landing = {
      nosotros: '',
      mensaje: '',
      telefono_fijo: '',
      telefono_movil: '',
      correo_contacto: '',
      url_facebook: '',
      domicilio: '',
      imagen: '',
      imagen_mensaje: '',
    };

    this.getLanding();
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

  asignarValores(data: any) {
    const srcNosotros = this.URL + '/assets/images/' + data.imagen;
    const srcMensaje = this.URL + '/assets/images/' + data.imagen_mensaje;
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
    this.landing.imagen_mensaje = srcMensaje;

    //console.log(this.landing);
  }

  scrollToSection(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  redirectSingUp() {
    this.router.navigate(['/menu']);
  }

}
