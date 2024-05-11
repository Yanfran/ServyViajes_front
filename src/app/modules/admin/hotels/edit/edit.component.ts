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
    NgxMaskDirective
  ],
  providers: [
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
  

  constructor(
    private _shareService: SharedService,
    private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private _hotelsService: HotelsService,
    private alertService: AlertService
    ) {      

      this.sharedData = this._shareService.getSharedData();
      this.serviciosArray = this._formBuilder.array([]);
      console.log(this.sharedData);

      if (!this.sharedData) {
        this._router.navigateByUrl('/hotels');
      }  

    }


    ngOnInit(): void {
      
      // Create the form
      this.createForm = this._formBuilder.group({
        nombre: ['', Validators.required],
        servicios: this.serviciosArray,
        galleries: this._formBuilder.array([]),
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

      if (this.sharedData) {
          this.idEdit = this.sharedData.id,
          this.createForm.patchValue({              
              nombre: this.sharedData.nombre,              
              direccion: this.sharedData.direccion,
              descripcion: this.sharedData.descripcion,
              politicas: this.sharedData.politicas,
              check_in: this.sharedData.check_in,
              check_out: this.sharedData.check_out,
              estatus: this.sharedData.estatus,
              beneficiario: this.sharedData.beneficiario,
              banco: this.sharedData.banco,
              numero_cuenta: this.sharedData.numero_cuenta,
              clabe_interbancaria: this.sharedData.clabe_interbancaria,
          });

          

          
          this.sharedData.servicios.forEach(servicio => {
            this.serviciosArray.push(this._formBuilder.group({
              servicio: [servicio.descripcion, Validators.required],
              id: [servicio.id],
            }));
          });
          


          this.sharedData.galleries.forEach(gallerie => {
            const src = this.URL + '/assets/images/' + gallerie.ruta;
            this.slides.push({
              id: gallerie.id,
              src: src,
              alt: 'Image Alt Text',
              title: 'Image Title'
            });
          });         
                                    
      }
        
    }
  

    agregarServicio() {
      const nuevoServicio = this._formBuilder.group({
        servicio: ['', Validators.required],
        id: this.generarId()
      });
  
      this.serviciosArray.push(nuevoServicio);
    }
  

    eliminarServicio(servicioId: number) {
      
      const servicioControl = this.serviciosArray.controls.find(control => control.get('id')?.value === servicioId);
    
      if (servicioControl) {
        this.serviciosArray.removeAt(this.serviciosArray.controls.indexOf(servicioControl));
      }
    }


    generarId(): number {
      return Math.floor(10000 + Math.random() * 90000);
    }


    edit(): void {        
      // Do nothing if the form is invalid
      if ( this.createForm.invalid )
      {
          return;
      }         
      
      // Disable the form
      this.createForm.disable();          
  
      var datos = {
          nombre: this.createForm.value.nombre,
          servicios: this.createForm.value.servicios.map((servicio: any) => ({ servicio: servicio.servicio })),          
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
          // imagenes: this.slides.map(slide => slide.src),    
      };                         
                      
      try {
          // Create category
          this._hotelsService.update(this.idEdit,datos).subscribe(
              // (response: any) => {
              ({ result, message }: { result: boolean; message: string }) => {
                  if (result) {
                      if (result) {                        
                          this.alertService.alertConfirmation('success', message);                                                                        
                          this._router.navigateByUrl('/hotels');
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

      
      this.base64Strings.forEach(base64String => {
        this.slides.push({
          id: this.slides.length + 1,
          src: base64String,
          alt: `Imagen ${this.slides.length + 1}`,
          title: `Imagen ${this.slides.length + 1}`
        });
        
        const imagenes: any[] = this.base64Strings;
        // console.log(imagenes)
        this.base64Strings = [];
        
            
        this._hotelsService.agregarImagenAlHotel(this.idEdit, imagenes).subscribe(
          ({ result, message, } : { result: boolean; message: string; }) => {                
            if (result) {                    
              this.alertService.alertConfirmation(
                'success',
                message
              );                            
            } else {
              this.alertService.alertConfirmation('error', message);
            }     
          },
          error => {
            this.alertService.alertConfirmation('error', error);
            console.error('Error al agregar imagen:', error);
          }
        );
      });
      
            

      // Forzar una actualización de la vista
      // this.slides = [...this.slides];
  
    }
    
    
    eliminarImagen(id: number): void {
        Swal.fire({
            title: '¿Estas seguro?',
            text: 'Este proceso es irreversible.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {

              this._hotelsService.eliminarImagenDeHotel(this.idEdit, id).subscribe(
                ({ result, message, } : { result: boolean; message: string; }) => {                
                  
                  if (result) {                    
                    this.alertService.alertConfirmation(
                      'success',
                      message
                    );

                    // Ahora, elimina la imagen localmente en el array de slides
                    this.slides = this.slides.filter(slide => slide.id !== id);
                    
                  } else {
                    this.alertService.alertConfirmation('error', message);
                  }                    

                },
                error => {
                  this.alertService.alertConfirmation('error', error);
                  console.error('Error al eliminar imagen del backend:', error);
                }
              );

            }
        });
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
