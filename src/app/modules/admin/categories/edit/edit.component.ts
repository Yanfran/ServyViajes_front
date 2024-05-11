import { NgIf } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CategoriesService } from 'app/services/categories/categories.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemePalette } from '@angular/material/core';
import { fuseAnimations } from '@fuse/animations';
import { AlertService } from 'app/services/alert/alert.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-edit',
    animations: fuseAnimations,
    standalone: true,
    imports: [
        NgIf,
        MatIconModule,
        MatButtonModule,
        RouterLink,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule,
    ],
    templateUrl: './edit.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./edit.component.scss'],
})
export class EditComponent {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    idCategoriaSeleccionada: number | null = null;
    // isChecked = true;
    color: ThemePalette = 'primary';    
    descripcion: string = '';
    estatus: string = '';
    location: any;

    createForm = new UntypedFormGroup({
        descripcion: new UntypedFormControl('', []),
        estatus: new UntypedFormControl('', []),
    });
        
    tieneEventosActivos: boolean = false;

    constructor(
        private _activateRoute: ActivatedRoute,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _categoriesService: CategoriesService,
        private alertService: AlertService
    ) {}    

    ngOnInit(): void {

      this._activateRoute.params.subscribe(params => {
          const id = +params['id']; // Convierte el parámetro a número si es un ID
          // Ahora puedes usar el ID para cargar la información necesaria para la edición          

          this.idCategoriaSeleccionada = +params['id'];
          this.edit(this.idCategoriaSeleccionada);        
          
      });

        // Create the form
        this.createForm = this._formBuilder.group({
            descripcion: ['', Validators.required],
            estatus: [false],            
        });
    }

        
    edit(id: number): void {

      try {
          // Sign up
          this._categoriesService.edit(id).subscribe(
              (response: any) => {
                  if (response.result) {

                    this.createForm.setValue({
                      descripcion: response.data.descripcion,
                      estatus: response.data.estatus,                      
                    });

                    this.tieneEventosActivos = response.data.tiene_eventos_activos;
                                          
                  } else {
                    this.alertService.alertConfirmation('success', 'error');
                  }
              },
              (error) => {
                this.alertService.alertConfirmation('success', error);  
              }
          );
      } catch (error) {
         
      }
    }


    update(): void {
        // Do nothing if the form is invalid
        if (this.createForm.invalid) {
            return;
        }

        // Disable the form
        this.createForm.disable();        

        var datos = {
            descripcion: this.createForm.value.descripcion,
            estatus: this.createForm.value.estatus,
            id: this.idCategoriaSeleccionada,
        };

        try {                      
          this._categoriesService.update(datos).subscribe(
            //   (response: any) => {
                ({ result, message }: { result: boolean; message: string }) => {
                  if (result) {
                      // console.log(response.result)
                      this.alertService.alertConfirmation('success', message);

                      // Navigate to the redirect url
                      this._router.navigateByUrl('/categories');
                  } else {
                        this.createForm.enable(); 
                        this.alertService.alertConfirmation('error', message);
                  }
              },
              (error) => {
                    this.createForm.enable(); 
                    this.alertService.alertConfirmation('error', error);
              }
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
                this._router.navigateByUrl('/categories');
            }
        });    
    }
    
    cambiarEstatus(event: any)
    {
        if(this.tieneEventosActivos && event.checked == false)
        {
            Swal.fire({
                title: 'Categoría en uso',
                text: `Esta categoría actualmente está asociada a uno o más eventos activos. 
                        Si decides desactivarla, los eventos seguirán utilizando esta categoría 
                        hasta que se asignen a otra categoría. Ten en cuenta que desactivar esta 
                        categoría puede afectar la funcionalidad de los eventos asociados. 
                        ¿Estás seguro de que deseas continuar y desactivar la categoría?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'No',
            }).then((result) => {
                if (result.isConfirmed) {

                }else {
                    this.createForm.patchValue({
                        estatus: true,
                    });
                }
            });
        }
    }
}
