import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
    FormArray,
    FormGroup,
} from '@angular/forms';
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
import { LandingHomeService } from 'app/services/landing-home/landing-home.service';
import { AlertService } from 'app/services/alert/alert.service';
import { CommonModule } from '@angular/common';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CarouselModule } from 'ngx-owl-carousel-o';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { environment } from 'environments/environment';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
    selector: 'app-create',
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
        NgxMaskDirective
    ],
    providers: [
        provideNgxMask()
    ],
    templateUrl: './create.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
    @ViewChild('createHotel') createHotel: NgForm;

    color: ThemePalette = 'accent';
    checked = false;
    disabled = false;
    slides = [];
    base64Strings: string[] = [];

    respaldoData: any = {};

    createForm: FormGroup;
    private URL = environment.urlImg;

    // createForm = new UntypedFormGroup({
    //     nombre: new UntypedFormControl('', []),
    //     direccion: new UntypedFormControl('', []),
    //     descripcion: new UntypedFormControl('', []),
    //     politicas: new UntypedFormControl('', []),
    //     estatus: new UntypedFormControl('', []),
    // });   
    
    slidesBanners = [];
    slidesBannersBase64: string[] = [];
    slidesMensaje = [];
    base64StringsMensaje: string[] = [];

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _landingHomeService: LandingHomeService,
        private alertService: AlertService
    ) {}

    ngOnInit(): void {
        // Create the form
        this.createForm = this._formBuilder.group({
            nosotros: ['', Validators.required],
            mensaje: ['', Validators.required],
            telefono_fijo: ['', [ 
                Validators.required, 
                Validators.minLength(10),
                Validators.maxLength(10),
                Validators.pattern(/^[0-9]+$/) ]
            ],
            telefono_movil: ['', [ 
                Validators.required, 
                Validators.minLength(10),
                Validators.maxLength(10),
                Validators.pattern(/^[0-9]+$/) ]
            ],
            correo_contacto: ['', Validators.required],
            url_facebook: ['', Validators.required],
            domicilio: ['', Validators.required],
            imagen: ['', Validators.required],
            imagen_mensaje: ['', Validators.required],            
        });

        this.index();
    }

    index() {
        this._landingHomeService.index().subscribe(
            (response: any) => {
                if (response.result) {
                    const data = response.data;
                    this.respaldoData = data;
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
        this.createForm.patchValue({
            nosotros: data.nosotros,
            mensaje: data.mensaje,
            telefono_fijo: data.telefono_fijo,
            telefono_movil: data.telefono_movil,
            correo_contacto: data.correo_contacto,
            url_facebook: data.url_facebook,
            domicilio: data.domicilio,
            imagen: data.imagen,
            imagen_mensaje: data.imagen_mensaje           
        });

        this.slides = [];
        const src = this.URL + '/assets/images/' + data.imagen;
        this.slides.push({
            id: this.slides.length + 1,
            src: src,
            alt: `Imagen ${this.slides.length + 1}`,
            title: `Imagen ${this.slides.length + 1}`,
        });

        //mensaje
        this.slidesMensaje = [];
        const srcMensaje = this.URL + '/assets/images/' + data.imagen_mensaje;
        this.slidesMensaje.push({
            id: this.slidesMensaje.length + 1,
            src: srcMensaje,
            alt: `Imagen ${this.slidesMensaje.length + 1}`,
            title: `Imagen ${this.slidesMensaje.length + 1}`,
        });

        //banners
        data.banners.forEach(banner => {
            const srcBanner = this.URL + '/assets/images/' + banner.banner;
            this.slidesBanners.push({
              id: banner.id,
              src: srcBanner,
              img: banner.banner,
              alt: 'Image Alt Text',
              title: 'Image Title'
            });
          });
    }
    

    create(): void {
        // Do nothing if the form is invalid
        if (this.createForm.invalid) {
            return;
        }

        // Disable the form
        //this.createForm.disable();        

        var datos = this.createForm.value;
        datos.banners = this.slidesBanners.map((slide) => slide.img);

        // console.log(datos);
        // return;
        

        try {
            // Create category
            this._landingHomeService.store(datos).subscribe(
                // (response: any) => {
                ({ result, message }: { result: boolean; message: string }) => {
                    if (result) {
                        if (result) {
                            this.alertService.alertConfirmation(
                                'success',
                                message
                            );
                        } else {
                            this.alertService.alertConfirmation(
                                'error',
                                message
                            );
                        }
                    } else {
                        this.alertService.alertConfirmation('error', message);
                    }
                }
            );
        } catch (error) {
            this.alertService.alertConfirmation('error',  error);
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
                this._router.navigateByUrl('/menu');
            }
        });    
    }            

    onFileSelected(event: any): void {
        if(event.target.files && event.target.files.length > 0) {
           let imagenSeleccionada = event.target.files[0];
           
           const reader = new FileReader();
           reader.onload = (e: any) => {
            let imagenBase64 = e.target.result;
            this.base64Strings.push(imagenBase64); 
           }
           reader.readAsDataURL(imagenSeleccionada);
        }
    }

    agregarImagenes(): void {
        // console.log('Agregando imágenes...');
        this.createForm.patchValue({
            imagen: ''
        });
        this.slides = []; // Limpia los slides existentes si es necesario
        this.slides.push({
            id: this.slides.length + 1,
            src: this.base64Strings[0],
            alt: `Imagen ${this.slides.length + 1}`,
            title: `Imagen ${this.slides.length + 1}`,
        });
        this.createForm.patchValue({
            imagen: this.base64Strings[0]
        });
        this.base64Strings = [];
        // console.log('Imágenes agregadas:', this.slides);
    }

    eliminarImagen(id: number): void {
        this.slides = this.slides.filter((slide) => slide.id !== id);
        this.createForm.patchValue({
            imagen: ''
        });
    }

    onFileSelectedMensaje(event: any): void {
        if(event.target.files && event.target.files.length > 0) {
           let imagenSeleccionada = event.target.files[0];
           
           const reader = new FileReader();
           reader.onload = (e: any) => {
            let imagenBase64 = e.target.result;
            this.base64StringsMensaje.push(imagenBase64); 
           }
           reader.readAsDataURL(imagenSeleccionada);
        }
    }

    agregarImagenesMensaje(): void {
        // console.log('Agregando imágenes...');
        this.createForm.patchValue({
            imagen_mensaje: ''
        });
        this.slidesMensaje = []; // Limpia los slides existentes si es necesario
        this.slidesMensaje.push({
            id: this.slidesMensaje.length + 1,
            src: this.base64StringsMensaje[0],
            alt: `Imagen ${this.slidesMensaje.length + 1}`,
            title: `Imagen ${this.slidesMensaje.length + 1}`,
        });
        this.createForm.patchValue({
            imagen_mensaje: this.base64StringsMensaje[0]
        });
        this.base64StringsMensaje = [];
        // console.log('Imágenes agregadas:', this.slides);
    }

    eliminarImagenMensaje(id: number): void {
        this.slidesMensaje = this.slidesMensaje.filter((slide) => slide.id !== id);
        this.createForm.patchValue({
            imagen_mensaje: ''
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
            items: 3
          },
          740: {
            items: 3
          },
          940: {
            items: 4
          },   
          1440: {
            items: 4,
        },     
        },
        navText: ['<', '>'],    
        nav: true
      }

      customOptions2: OwlOptions = {
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
}
