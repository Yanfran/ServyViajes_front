import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormGroup,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,    
    Validators,
    FormArray,
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
import { HotelsService } from 'app/services/hotels/hotels.service';
import { AlertService } from 'app/services/alert/alert.service';
import { CommonModule } from '@angular/common';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CarouselModule } from 'ngx-owl-carousel-o';
import Swal, { SweetAlertIcon } from 'sweetalert2';
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
        provideNgxMask(),
    ],
    templateUrl: './create.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
    @ViewChild('createHotel') createHotel: NgForm;

    isChecked = true;
    color: ThemePalette = 'primary';
    checked = false;
    disabled = false;
    slides = [];
    base64Strings: string[] = [];

    createForm: FormGroup;   

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _hotelsService: HotelsService,
        private alertService: AlertService
    ) {}

    ngOnInit(): void {
        // Create the form
        this.createForm = this._formBuilder.group({
            nombre: ['', Validators.required],
            servicios: this._formBuilder.array([]),
            direccion: ['', Validators.required],
            descripcion: ['', Validators.required],
            politicas: ['', Validators.required],
            check_in: [''],
            check_out: [''],
            estatus: [false],
            beneficiario: ['', Validators.required],
            banco: ['', Validators.required],
            numero_cuenta: ['', [
                Validators.required,
                Validators.pattern(/^[0-9]+$/)]
            ],
            clabe_interbancaria: ['', [
                Validators.required,
                Validators.minLength(18),
                Validators.maxLength(18),
                Validators.pattern(/^[0-9]+$/)]
            ]            
        });

        // Agregar un servicio inicialmente
        this.agregarServicio();
    }

    get serviciosArray() {
        return this.createForm.get('servicios') as FormArray;
    }

    agregarServicio() {
        const nuevoServicio = this._formBuilder.group({
            servicio: ['', Validators.required],
        });

        this.serviciosArray.push(nuevoServicio);
    }

    eliminarServicio(index: number) {
        this.serviciosArray.removeAt(index);
    }

    create(): void {
        // Do nothing if the form is invalid
        if (this.createForm.invalid) {
            return;
        }

        // Disable the form
        this.createForm.disable();        

        var datos = {
            nombre: this.createForm.value.nombre,
            servicios: this.createForm.value.servicios.map((servicio: any) => ({
                servicio: servicio.servicio,
            })),
            direccion: this.createForm.value.direccion,
            descripcion: this.createForm.value.descripcion,
            politicas: this.createForm.value.politicas,
            estatus: this.createForm.value.estatus,
            check_in: this.createForm.value.check_in,
            check_out: this.createForm.value.check_out,
            beneficiario: this.createForm.value.beneficiario,
            banco: this.createForm.value.banco,
            numero_cuenta: this.createForm.value.numero_cuenta,
            clabe_interbancaria: this.createForm.value.clabe_interbancaria,
            imagenes: this.slides.map((slide) => slide.src),
        };

        // console.log(datos);
        // return;
        

        try {
            // Create category
            this._hotelsService.create(datos).subscribe(
                // (response: any) => {
                ({ result, message }: { result: boolean; message: string }) => {
                    if (result) {
                        if (result) {
                            this.alertService.alertConfirmation(
                                'success',
                                message
                            );
                            this._router.navigateByUrl('/hotels');
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
                this._router.navigateByUrl('/hotels');
            }
        });    
    }            

    onFileSelected(event: any): void {
        const selectedFiles: FileList = event.target.files;

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];

            const reader = new FileReader();
            reader.onload = (e: any) => {
                const base64String = e.target.result;
                this.base64Strings.push(base64String);
            };

            reader.readAsDataURL(file);
        }
    }

    agregarImagenes(): void {
        // console.log('Agregando imágenes...');
        this.slides = []; // Limpia los slides existentes si es necesario
        this.base64Strings.forEach((base64String) => {
            this.slides.push({
                id: this.slides.length + 1,
                src: base64String,
                alt: `Imagen ${this.slides.length + 1}`,
                title: `Imagen ${this.slides.length + 1}`,
            });
        });

        this.base64Strings = [];
        // console.log('Imágenes agregadas:', this.slides);
    }

    eliminarImagen(id: number): void {
        this.slides = this.slides.filter((slide) => slide.id !== id);
    }

    customOptions: OwlOptions = {
        autoWidth: true,
        loop: false,
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

    alertConfirmation(icon: SweetAlertIcon, title: string): void {
        this.alertService.alertConfirmation(icon, title);
    }
}
