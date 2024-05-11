import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, formatDate } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormArray, FormGroup, UntypedFormArray, FormControl } from '@angular/forms';
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
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedService } from 'app/services/shared/shared.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { CategoriesService } from 'app/services/categories/categories.service';
import { EventsService } from 'app/services/events/events.service';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
//import para calendarios
import { Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-edit',
  animations: fuseAnimations,
  standalone: true,
  imports: [
    MatNativeDateModule, 
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
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
  ],
  templateUrl: './edit.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {

  @ViewChild('signUpNgForm') signUpNgForm: NgForm;

  color: ThemePalette = 'primary';  
  idEdit = 0;
  // hotel_id = 0;
  sharedData: any;  
  categories: any[] = []; 
  grados: any[] = []; 
  hoteles: any[] = []; 
  createForm: FormGroup;  
  

  constructor(
    private _shareService: SharedService,
    private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private _hotelsService: HotelsService,
    private alertService: AlertService,
    private _categoriesService: CategoriesService,
    private _eventsService: EventsService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string
    ) {      

      this.sharedData = this._shareService.getSharedData();      
      // console.log("hola aca en eventos", this.sharedData);

      if (!this.sharedData) {
        this._router.navigateByUrl('/events');
      }  

    }


    ngOnInit(): void {
      //importante: configuracion de calendarios en español
      //formato: DD-MM-yyyy
      this._locale = 'es';
      this._adapter.setLocale(this._locale);
      
      // Create the form
      this.createForm = this._formBuilder.group({
        nombre: ['', Validators.required],
        sede: ['', Validators.required],
        fecha_inicio: ['', Validators.required],
        fecha_termino: ['', Validators.required],
        direccion: ['', Validators.required],
        descripcion: ['', Validators.required],
        politicas: ['', Validators.required],
        hoteles: [''],
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
        ],
        categorias: this._formBuilder.array([]),     
        grados: this._formBuilder.array([]),              
        estatus: [false],
      });

      if (this.sharedData) {        
        this.idEdit = this.sharedData.id,
        // this.hotel_id = this.sharedData.hotel_id,
        this.createForm.patchValue({              
            nombre: this.sharedData.nombre,   
            sede: this.sharedData.sede,              
            fecha_inicio: this.formatearFecha(this.sharedData.fecha_inicio),
            fecha_termino: this.formatearFecha(this.sharedData.fecha_termino),
            descripcion: this.sharedData.descripcion,
            politicas: this.sharedData.politicas,
            estatus: this.sharedData.estatus,
            beneficiario: this.sharedData.beneficiario,
            banco: this.sharedData.banco,
            numero_cuenta: this.sharedData.numero_cuenta,
            clabe_interbancaria: this.sharedData.clabe_interbancaria
        });
        
        
        this.sharedData.available_categories.forEach(category => {
          this.serviciosArray.push(this._formBuilder.group({
            category_id: new FormControl(category.category_id, Validators.required),
            costo: new FormControl(category.costo, Validators.required),
          }));
        });     

        this.sharedData.grados.forEach(grado => {
          this.gradosArray.push(this._formBuilder.group({
            grado_academico: new FormControl(grado.descripcion, Validators.required),            
          }));
        });     
        
        
      }      


      this.hotelesApi();      

      this._categoriesService.getCategories().subscribe(
        (response: any) => {
          if (response.result) {
            this.categories = response.data;            
          } else {
            console.error('Error al obtener la lista:', response.message);
          }
        },
        (error) => {
          console.error('Error al obtener la lista:', error);
        }
      );
         
    }
    

    
    get serviciosArray() {
      return this.createForm.get('categorias') as FormArray;
    }

    agregarServicio() {
        const nuevoServicio = this._formBuilder.group({
            category_id: ['', Validators.required],
            costo: ['', Validators.required],
            id: this.generarId()
        });
    
        this.serviciosArray.push(nuevoServicio);
    }        
        
    eliminarServicio(index: number) {
      this.serviciosArray.removeAt(index);
    }     
    

    
    get gradosArray() {
        return this.createForm.get('grados') as FormArray;
    }

    agregarGradoAcademico() {
        const nuevosGradosAcademico = this._formBuilder.group({            
            grado_academico: ['', Validators.required],
            id: this.generarId()
        });
    
        this.gradosArray.push(nuevosGradosAcademico);
    }        

    eliminarGradoAcademico(index: number) {
        this.gradosArray.removeAt(index);
    }


    generarId(): number {
      return Math.floor(10000 + Math.random() * 90000);
    }


    edit(): void {        
      // Do nothing if the form is invalid
      // if ( this.createForm.invalid )
      // {
      //     return;
      // }         
      
      // Disable the form
      this.createForm.disable();  

      const fechaInicioFormatted = formatDate(this.createForm.value.fecha_inicio, 'yyyy-MM-dd', 'en-US');
      const fechaTerminoFormatted = formatDate(this.createForm.value.fecha_termino, 'yyyy-MM-dd', 'en-US');        
  
      var datos = {
          nombre: this.createForm.value.nombre,
          sede: this.createForm.value.sede,
          fecha_inicio: fechaInicioFormatted,
          fecha_termino: fechaTerminoFormatted,          
          descripcion: this.createForm.value.descripcion,
          politicas: this.createForm.value.politicas,
          hotel_id: this.createForm.value.hoteles,
          beneficiario: this.createForm.value.beneficiario,
          banco: this.createForm.value.banco,
          numero_cuenta: this.createForm.value.numero_cuenta,
          clabe_interbancaria: this.createForm.value.clabe_interbancaria,
          categorias: this.createForm.value.categorias.map((category: any) => ({
            category_id: category.category_id,
            costo: category.costo
          })),      
          grados: this.createForm.value.grados.map((grado_academico: any) => ({                
              grado_academico: grado_academico.grado_academico,
          })),       
          estatus: this.createForm.value.estatus,              
      };      
            

      // console.log(datos)
      // return;
      
                      
      try {
          // Create category
          this._eventsService.update(this.idEdit,datos).subscribe(
              // (response: any) => {
              ({ result, message }: { result: boolean; message: string }) => {
                  if (result) {
                      if (result) {                        
                          this.alertService.alertConfirmation('success', message);                                                                        
                          this._router.navigateByUrl('/events');
                      } else {
                          this.createForm.enable();       
                          this.alertService.alertConfirmation('error', message);
                      }
                  } else {
                    this.createForm.enable();       
                      this.alertService.alertConfirmation('error', message);                        
                  }
              },                
          );
      } catch (error) {
          this.createForm.enable();       
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
            this._router.navigateByUrl('/events');
          }
      });    
    }                

    alertConfirmation(icon: SweetAlertIcon, title: string): void {
        this.alertService.alertConfirmation(icon, title);
    }


    hotelesApi(){
      const selectedId = this.sharedData ? this.sharedData.hotel_id : ''; 
      this._hotelsService.getHotels().subscribe(          
            ({ result, message, data  }: { result: boolean; message: string; data: any[] }) => {
              if (result) {  
                  this.hoteles = data; 
                  
                  if(this.sharedData){                                                                      
                      const selectedRegimen = this.hoteles.find(taxRegime => taxRegime.id === selectedId);                                              
                      if (selectedRegimen) {                            
                          this.createForm.get('hoteles').setValue(selectedRegimen.id); 
                      } else {                        
                      }                        
                  } else {
                        this.createForm.get('hotel').setValue(data[0].id); 
                  }                                         

              } else {
                  console.error(
                      'Error al obtener la lista:',
                      message
                  );
              }
          },
          (error) => {
              console.error('Error al obtener la lista:', error);
          }
      );   
    }
  
  formatearFecha(fecha: string): string {
    const fechaNumerica = fecha;
    const newFecha: Date = new Date(fechaNumerica);
    newFecha.setUTCHours(23, 0, 0, 0);
    const fechaFormateada: string = newFecha.toISOString();

    //console.log(fechaFormateada);
    return fechaFormateada;
  }

}
