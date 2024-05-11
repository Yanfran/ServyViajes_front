import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormArray, FormGroup, UntypedFormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ThemePalette } from '@angular/material/core';
import { fuseAnimations } from '@fuse/animations';
import { HotelsService } from 'app/services/hotels/hotels.service';
import { AlertService } from 'app/services/alert/alert.service';
import { CommonModule } from '@angular/common';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedService } from 'app/services/shared/shared.service';
import { environment } from 'environments/environment';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { LandingEventosService } from 'app/services/landing-eventos/landing-eventos.service';
import { DomSanitizer } from '@angular/platform-browser';
//import para calendarios
import { Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
//mascara de telefono
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-edit',
  animations: fuseAnimations,
  standalone: true,
  imports: [
    CarouselModule, 
    CommonModule, 
    MatTableModule, 
    MatIconModule, 
    MatButtonModule, 
    RouterLink, 
    MatIconModule, 
    FormsModule, 
    MatFormFieldModule, 
    NgClass, 
    MatInputModule, 
    TextFieldModule, 
    ReactiveFormsModule, 
    MatButtonToggleModule, 
    MatButtonModule, 
    MatSelectModule, 
    MatOptionModule, 
    MatChipsModule, 
    MatDatepickerModule, 
    MatCheckboxModule, 
    MatSlideToggleModule,
    MatNativeDateModule,
    NgxMaskDirective,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
    provideNgxMask(),
  ],
  templateUrl: './edit.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {

  @ViewChild('signUpNgForm') signUpNgForm: NgForm;

  color: ThemePalette = 'primary';  
  idEdit = 0;
  sharedData: any;  
  base64Strings: string[] = [];  
  slides: any[] = [];  
  createForm: UntypedFormGroup;
  serviciosArray: UntypedFormArray;
  private URL = environment.urlImg;

  slideEvento = [];
  slideAsociacion = [];
  slidesBanners = [];
  slidesPatrocinadores = [];
  slideEventoBase64: string[] = [];
  slideAsociacionBase64: string[] = [];
  slidesBannersBase64: string[] = [];
  slidesPatrocinadoresBase64: string[] = [];
  pdfPrograma: string[] = [];
  programaForm: FormGroup;
  dataSource = [];
  listaEventos = [];
  slug: string = '';
  pdfUrl: any = null;

  programaEnEdicion: any = {};
  

  constructor(
    private _shareService: SharedService,
    private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private _landingEventosService: LandingEventosService,
    private alertService: AlertService,
    private sanitizer: DomSanitizer,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string
    ) {      

      this.sharedData = this._shareService.getSharedData();
      this.serviciosArray = this._formBuilder.array([]);
      console.log(this.sharedData);

      if (!this.sharedData) {
        this._router.navigateByUrl('/landing/eventos');
      }  

    }


    ngOnInit(): void {
      //importante: configuracion de calendarios en español
      //formato: DD-MM-yyyy
      this._locale = 'es';
      this._adapter.setLocale(this._locale);

      // Create the form
      this.createForm = this._formBuilder.group({
        color_fondo: ['', Validators.required],
        event_id: ['', Validators.required],
        logo_evento: [''],
        logo_asociacion: [''],
        que_incluye: ['', Validators.required],
        pdf_programa: [''],
        status: [false],
        dias: ['', Validators.required],
        conferencias: ['', Validators.required],
        profesores: ['', Validators.required], 
        slug: ['', Validators.required],
        facebook: ['', Validators.required],
        instagram: ['',],
        whatsapp: ['', Validators.required],
        twitter: ['',], 
        iframe_maps: ['', Validators.required], 
        show_hotel: [false, Validators.required],
        show_event: [false, Validators.required],    
      });

      this.programaForm = this._formBuilder.group({
        //dia: ['', Validators.required],
        fecha: ['', Validators.required],
        horario: ['', Validators.required],
        modulo_conferencia: ['', Validators.required],
        coordinador_profesor: ['', Validators.required]
    }); 
    
    this.getEventos();

      if (this.sharedData) {
          this.idEdit = this.sharedData.id,
          this.createForm.patchValue({              
              color_fondo: this.sharedData.color_fondo,              
              event_id: this.sharedData.event_id,
              logo_evento: this.sharedData.logo_evento,
              logo_asociacion: this.sharedData.logo_asociacion,
              que_incluye: this.sharedData.que_incluye,
              pdf_programa: this.sharedData.pdf_programa,
              status: this.sharedData.status,
              dias: this.sharedData.dias,
              conferencias: this.sharedData.conferencias,
              profesores: this.sharedData.profesores,
              slug: this.revertSlug(this.sharedData.slug ? this.sharedData.slug : ''),
              facebook: this.sharedData.facebook,
              instagram: this.sharedData.instagram,
              whatsapp: this.sharedData.whatsapp,
              twitter: this.sharedData.twitter,
              iframe_maps: this.sharedData.iframe_maps,
              show_hotel: this.sharedData.show_hotel,
              show_event: this.sharedData.show_event
          });

          //logo evento
          const srcLogoEvento = this.URL + '/assets/images/' + this.sharedData.logo_evento;
          this.slideEvento.push({
            id: this.slideEvento.length + 1,
            src: srcLogoEvento,
            alt: 'Image Alt Text',
            title: 'Image Title'
          });
          //logo asociacion
          const srcLogoAsociacion = this.URL + '/assets/images/' + this.sharedData.logo_asociacion;
          this.slideAsociacion.push({
            id: this.slideAsociacion.length + 1,
            src: srcLogoAsociacion,
            alt: 'Image Alt Text',
            title: 'Image Title'
          });
          //programas
          if(this.sharedData.pdf_programa) {
            const urlProgramaPdf = this.URL + '/assets/programas/' + this.sharedData.pdf_programa;
            this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(urlProgramaPdf);
          }
          
          this.dataSource = this.sharedData.programas;
          //banners
          this.sharedData.banners.forEach(banner => {
            const srcBanner = this.URL + '/assets/images/' + banner.banner;
            this.slidesBanners.push({
              id: banner.id,
              src: srcBanner,
              img: banner.banner,
              alt: 'Image Alt Text',
              title: 'Image Title'
            });
          });
          
          //patrocinadores
          this.sharedData.patrocinadores.forEach(patrocinador => {
            const srcPatrocinador = this.URL + '/assets/images/' + patrocinador.patrocinador;
            this.slidesPatrocinadores.push({
              id: patrocinador.id,
              src: srcPatrocinador,
              img: patrocinador.patrocinador,
              alt: 'Image Alt Text',
              title: 'Image Title'
            });
          });
                                    
      }
        
    }
  

    getEventos() {
      this._landingEventosService.getEventos().subscribe(
          (response: any) => {
              if (response.result) {
                  this.listaEventos = response.data;// Asegúrate de que el servidor devuelve las categorías en el formato correcto
                  // console.log(this.dataSource.data);
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
    
    generarId(): number {
      return Math.floor(10000 + Math.random() * 90000);
    }

    edit(): void {
      if(this.createForm.value.color_fondo == '') {
        let messageColorFondo = "Por favor, seleccione un color de fondo"
        this.alertService.alertConfirmation('error', messageColorFondo);
        return;
      }     
      // Do nothing if the form is invalid
      if ( this.createForm.invalid )
      {
          return;
      }         
      
      // Disable the form
      //this.createForm.disable();          
      
      var datos = {
        color_fondo: this.createForm.value.color_fondo,
        event_id: this.createForm.value.event_id,
        logo_evento: this.createForm.value.logo_evento,
        logo_asociacion: this.createForm.value.logo_asociacion,
        que_incluye: this.createForm.value.que_incluye,
        pdf_programa: this.createForm.value.pdf_programa,
        status: this.createForm.value.status,
        dias: this.createForm.value.dias,
        conferencias: this.createForm.value.conferencias,
        profesores: this.createForm.value.profesores,
        slug: this.slug,
        facebook: this.createForm.value.facebook,
        instagram: this.createForm.value.instagram,
        whatsapp: this.createForm.value.whatsapp,
        twitter: this.createForm.value.twitter,
        iframe_maps: this.createForm.value.iframe_maps,
        show_hotel: this.createForm.value.show_hotel,
        show_event: this.createForm.value.show_event,
        programas: this.dataSource,
        banners: this.slidesBanners.map((slide) => slide.img),
        patrocinadores: this.slidesPatrocinadores.map((slide) => slide.img),
      };
      
    //   console.log(datos);
    //   return;
                      
      try {
          // Create category
          this._landingEventosService.update(this.idEdit,datos).subscribe(
              // (response: any) => {
              ({ result, message }: { result: boolean; message: string }) => {
                  if (result) {
                      if (result) {                        
                          this.alertService.alertConfirmation('success', message);                                                                        
                          this._router.navigateByUrl('/landing/eventos');
                      } else {
                          this.alertService.alertConfirmation('error', message);
                      }
                  } else {
                      this.alertService.alertConfirmation('error', message);                        
                  }
              },                
          );
      } catch (error) {
          this.alertService.alertConfirmation('error', error);                                    
      }
    }

  
    cancel(): void {        
      Swal.fire({
          title: '¿Estas seguro?',
          text: 'Este proceso es irreversible.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí',
          cancelButtonText: 'No',
      }).then((result) => {
          if (result.isConfirmed) {                    
              this._router.navigateByUrl('/landing/eventos');
          }
      });    
    }                

    customOptions: OwlOptions = {
      autoWidth: true,
      loop: true,
      mouseDrag: true,
      touchDrag: false,
      pullDrag: true,
      dots: false,
      navSpeed: 700,        
      margin: 10,     
      responsive: {
        0: {
          items: 1
        },
        400: {
          items: 1
        },
        740: {
          items: 1
        },
        940: {
          items: 1
        },   
        1440: {
          items: 1,
      },     
      },
      navText: ['<', '>'],    
      nav: true
    }


    alertConfirmation(icon: SweetAlertIcon, title: string): void {
        this.alertService.alertConfirmation(icon, title);
    }

    agregarPrograma() {
      // agregar validaciones de todos los controles
      Object.keys(this.programaForm.controls).forEach(key => {
        this.programaForm.get(key)?.setValidators([Validators.required]);
        this.programaForm.get(key)?.updateValueAndValidity();
      });

      if (this.programaForm.invalid) {
          return;
      }
      let programa = this.programaForm.value;
      let fecha = new Date(programa.fecha);
      let dia = fecha.getDate();
      let mes = fecha.getMonth() + 1;
      let year = fecha.getFullYear();

      let nuevaFecha = `${year}-${mes}-${dia}`;
      //console.log(nuevaFecha);

      //editar programa
      if(this.programaEnEdicion?.id) {
        let index = this.dataSource.findIndex(programa => programa.id === this.programaEnEdicion.id);
        this.dataSource[index].fecha = nuevaFecha;
        this.dataSource[index].horario = programa.horario;
        this.dataSource[index].modulo_conferencia = programa.modulo_conferencia;
        this.dataSource[index].coordinador_profesor = programa.coordinador_profesor;
        //limpiamos la variable
        this.programaEnEdicion = {};
      }else {
        //generar id unico
        let numAleatorioUno = Math.floor(Math.random() * 100) + 1;
        let numAleatorioDos = Math.floor(Math.random() * 100) + 1;
        let nuevoId = `${numAleatorioUno}${numAleatorioDos}`;
        
        let data = {
            id: nuevoId,
            //dia: programa.dia,
            fecha: nuevaFecha,
            horario: programa.horario,
            modulo_conferencia: programa.modulo_conferencia,
            coordinador_profesor: programa.coordinador_profesor
        };
        this.dataSource.push(data);

      }

      //reinciar formulario
      this.programaForm.reset();
      // Elimina las validaciones de todos los controles
      Object.keys(this.programaForm.controls).forEach(key => {
        this.programaForm.get(key)?.clearValidators();
        this.programaForm.get(key)?.updateValueAndValidity();
      }); 
  }

  selectLogoEvento(event: any) {
      if(event.target.files && event.target.files.length > 0) {
          let imagenSeleccionada = event.target.files[0];
          
          const reader = new FileReader();
          reader.onload = (e: any) => {
           let imagenBase64 = e.target.result;
           this.slideEventoBase64.push(imagenBase64); 
          }
          reader.readAsDataURL(imagenSeleccionada);
       }
  }

  agregarLogoEvento() {
      // console.log('Agregando imágenes...');
      this.createForm.patchValue({
          logo_evento: ''
      });
      this.slideEvento = []; // Limpia los slides existentes si es necesario
      this.slideEvento.push({
          id: this.slideEvento.length + 1,
          src: this.slideEventoBase64[0],
          alt: `Imagen ${this.slideEvento.length + 1}`,
          title: `Imagen ${this.slideEvento.length + 1}`,
      });
      this.createForm.patchValue({
          logo_evento: this.slideEventoBase64[0]
      });
      this.slideEventoBase64 = [];
      // console.log('Imágenes agregadas:', this.slides);
  }

  eliminarLogoEvento(id: number): void {
      this.slideEvento = this.slideEvento.filter((slide) => slide.id !== id);
      this.createForm.patchValue({
          logo_evento: ''
      });
  }

  selectLogoAsociacion(event: any) {
      if(event.target.files && event.target.files.length > 0) {
          let imagenSeleccionada = event.target.files[0];
          
          const reader = new FileReader();
          reader.onload = (e: any) => {
           let imagenBase64 = e.target.result;
           this.slideAsociacionBase64.push(imagenBase64); 
          }
          reader.readAsDataURL(imagenSeleccionada);
      }
      
  }

  agregarLogoAsociacion() {
      // console.log('Agregando imágenes...');
      this.createForm.patchValue({
          logo_asociacion: ''
      });
      this.slideAsociacion = []; // Limpia los slides existentes si es necesario
      this.slideAsociacion.push({
          id: this.slideAsociacion.length + 1,
          src: this.slideAsociacionBase64[0],
          alt: `Imagen ${this.slideAsociacion.length + 1}`,
          title: `Imagen ${this.slideAsociacion.length + 1}`,
      });
      this.createForm.patchValue({
          logo_asociacion: this.slideAsociacionBase64[0]
      });
      this.slideAsociacionBase64 = [];
      // console.log('Imágenes agregadas:', this.slides);
  }

  eliminarLogoAsociacion(id: number): void {
      this.slideAsociacion = this.slideAsociacion.filter((slide) => slide.id !== id);
      this.createForm.patchValue({
          logo_asociacion: ''
      });
  }

    selectBanners(event: any) {
      const selectedFiles: FileList = event.target.files;

      for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];

          const reader = new FileReader();
          reader.onload = (e: any) => {
              const base64String = e.target.result;
              this.slidesBannersBase64.push(base64String);
          };

          reader.readAsDataURL(file);
      }
  }

  agregarBanners() {
      // console.log('Agregando imágenes...');
      //this.slidesBanners = []; // Limpia los slides existentes si es necesario
      this.slidesBannersBase64.forEach((base64String) => {
          this.slidesBanners.push({
              id: this.slidesBanners.length + 1,
              src: base64String,
              img: base64String,
              alt: `Imagen ${this.slidesBanners.length + 1}`,
              title: `Imagen ${this.slidesBanners.length + 1}`,
          });
      });

      this.slidesBannersBase64 = [];
      // console.log('Imágenes agregadas:', this.slides);
  }

  eliminarBanner(id: number): void {
      this.slidesBanners = this.slidesBanners.filter((slide) => slide.id !== id);
  }

    selectPatrocinadores(event: any): void {
      const selectedFiles: FileList = event.target.files;

      for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];

          const reader = new FileReader();
          reader.onload = (e: any) => {
              const base64String = e.target.result;
              this.slidesPatrocinadoresBase64.push(base64String);
          };

          reader.readAsDataURL(file);
      }
  }

  agregarPatrocinadores(): void {
      // console.log('Agregando imágenes...');
      //this.slidesPatrocinadores = []; // Limpia los slides existentes si es necesario
      this.slidesPatrocinadoresBase64.forEach((base64String) => {
          this.slidesPatrocinadores.push({
              id: this.slidesPatrocinadores.length + 1,
              src: base64String,
              img: base64String,
              alt: `Imagen ${this.slidesPatrocinadores.length + 1}`,
              title: `Imagen ${this.slidesPatrocinadores.length + 1}`,
          });
      });

      this.slidesPatrocinadoresBase64 = [];
      // console.log('Imágenes agregadas:', this.slides);
  }

  eliminarPatrocinador(id: number): void {
      this.slidesPatrocinadores = this.slidesPatrocinadores.filter((slide) => slide.id !== id);
  }

  agregarPdfPrograma(event: any) {
    if(event.target.files && event.target.files.length > 0) {
      let pdfSeleccionado = event.target.files[0];
      //console.log(pdfSeleccionado);
      if(pdfSeleccionado.type === "application/pdf" ){
          const reader = new FileReader();
          reader.onload = (e: any) => {
              let pdfBase64 = e.target.result;
              //console.log(pdfBase64);
              this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfBase64);
              this.pdfPrograma.push(pdfBase64);
              this.createForm.patchValue({
                  pdf_programa: pdfBase64
              });
          }
          reader.readAsDataURL(pdfSeleccionado);
      }else {
          let message = "solo se admiten archivos PDF";
          this.alertService.alertConfirmation('error', message);
          event.target.value = '';
          //console.log(event);
      }
      
    }   
  }

  eliminarPrograma(item: any) {
    this.dataSource = this.dataSource.filter((programa) => programa.id !== item.id);
  }


  editarPrograma(item: any) {
    let programa = this.dataSource.find(programa => programa.id === item.id);
    // console.log(programa);
    this.programaEnEdicion = programa;
    this.programaForm.patchValue({
        fecha: this.formatearFecha(programa.fecha),
        horario: programa.horario,
        modulo_conferencia: programa.modulo_conferencia,
        coordinador_profesor: programa.coordinador_profesor
    });
  }

  formatearFecha(fecha: string): string {
      const fechaNumerica = fecha;
      const newFecha: Date = new Date(fechaNumerica);
      newFecha.setUTCHours(23, 0, 0, 0);
      const fechaFormateada: string = newFecha.toISOString();

      //console.log(fechaFormateada);
      return fechaFormateada;
  }

  convertSlug(event: any) {
    let slug = event.target.value;

    let convertSLug = slug
    .toLowerCase() // Convertir todo a minúsculas
    .normalize("NFD") // Eliminar caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Remover acentos
    .replace(/\s+/g, "-") // Reemplazar espacios por guiones
    .replace(/[^\w-]+/g, "") // Remover caracteres especiales
    .replace(/--+/g, "-") // Remover múltiples guiones seguidos
    .replace(/^-+/, "") // Remover guiones al inicio
    .replace(/-+$/, ""); // Remover guiones al final

    //console.log(convertSlug);
    this.slug = convertSLug;
  }

  revertSlug(slug: string = ''): string {
    this.slug = slug;
    return slug.replace(/-/g, " ");
  }

}
