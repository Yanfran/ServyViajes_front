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
import { Router, RouterLink } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CategoriesService } from 'app/services/categories/categories.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemePalette } from '@angular/material/core';
import { fuseAnimations } from '@fuse/animations';
import { AlertService } from 'app/services/alert/alert.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-create',
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
        MatSlideToggleModule
    ],
    templateUrl: './create.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./create.component.scss'],
})
export class CreateComponent {

    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    isChecked = true;
    color: ThemePalette = 'primary';
    checked = false;
    disabled = false;
    descripcion: string = '';
    estatus: string = '';
    location: any;

    createForm = new UntypedFormGroup({
        descripcion: new UntypedFormControl('', []),
        estatus: new UntypedFormControl('', []),
    });        

    constructor(    
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _categoriesService: CategoriesService,
        private alertService: AlertService
    ) {}

    
    ngOnInit(): void {
        // Create the form
        this.createForm = this._formBuilder.group({
            descripcion: ['', Validators.required],
            estatus: [false], 
            // estatus: ['', Validators.required],
        });
    }
        

    createCategories(): void {        
        // Do nothing if the form is invalid
        if ( this.createForm.invalid )
        {
            return;
        }         
        
        // Disable the form
        this.createForm.disable();    

        var datos = {
            descripcion: this.createForm.value.descripcion,
            estatus: this.createForm.value.estatus,            
        };       
                        

        try {
            // Create category
            this._categoriesService.create(datos).subscribe(
                // (response: any) => {
                ({ result, message }: { result: boolean; message: string }) => {
                    if (result) {
                        if (result) {                        
                            this.alertService.alertConfirmation('success', message);                                                                        
                            this._router.navigateByUrl('/categories');
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
                this._router.navigateByUrl('/categories');
            }
        });    
    }        
    
}
