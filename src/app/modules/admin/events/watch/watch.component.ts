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
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedService } from 'app/services/shared/shared.service';
import { CategoriesService } from 'app/services/categories/categories.service';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
//import para calendarios
import { Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
    selector: 'app-watch',
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
    templateUrl: './watch.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./watch.component.scss'],
})
export class WatchComponent {
   
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    color: ThemePalette = 'primary';  
    disabled = true;
    idEdit = 0;    
    sharedData: any;  
    categories: any[] = []; 
    grados: any[] = []; 
    hoteles: any[] = []; 
    IsTheHotel: string = '';
    createForm: FormGroup;  
    
  
    constructor(
      private _shareService: SharedService,
      private _formBuilder: UntypedFormBuilder,
      private _router: Router,
      private _hotelsService: HotelsService,      
      private _categoriesService: CategoriesService,
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
          categorias: this._formBuilder.array([]),   
          grados: this._formBuilder.array([]),             
          estatus: [false],
          beneficiario: [''],
          banco: [''],
          numero_cuenta: [''],
          clabe_interbancaria: [''],
        });
  
        if (this.sharedData) {        
          this.idEdit = this.sharedData.id,          
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
        this.categoryApi();          
           
    }

    getCategoryDescripcion(categoryId: number): string {
        const category = this.categories.find(cat => cat.id === categoryId);
        return category ? category.descripcion : '';
    }
    
    get serviciosArray() {
    return this.createForm.get('categorias') as FormArray;
    }


    get gradosArray() {
        return this.createForm.get('grados') as FormArray;
    }

    // agregarGradoAcademico() {
    //     const nuevosGradosAcademico = this._formBuilder.group({            
    //         grado_academico: ['', Validators.required],
    //         id: this.generarId()
    //     });
    
    //     this.gradosArray.push(nuevosGradosAcademico);
    // }        

    // eliminarGradoAcademico(index: number) {
    //     this.gradosArray.removeAt(index);
    // }
 

    hotelesApi(){
        const selectedId = this.sharedData ? this.sharedData.hotel_id : ''; 
        this._hotelsService.getHotels().subscribe(          
              ({ result, message, data  }: { result: boolean; message: string; data: any[] }) => {
                if (result) {  
                    this.hoteles = data; 
                    
                    if(this.sharedData){                                                                      
                        const selectedHotel = this.hoteles.find(hotel => hotel.id === selectedId);                                              
                        if (selectedHotel) {                            
                            this.IsTheHotel = selectedHotel.nombre;
                            this.createForm.get('hoteles').setValue(selectedHotel.id); 
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



    categoryApi(){    
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
    
  formatearFecha(fecha: string): string {
    const fechaNumerica = fecha;
    const newFecha: Date = new Date(fechaNumerica);
    newFecha.setUTCHours(23, 0, 0, 0);
    const fechaFormateada: string = newFecha.toISOString();

    //console.log(fechaFormateada);
    return fechaFormateada;
  }
}
