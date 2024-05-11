import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Subject, takeUntil, finalize } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RoleBasedVisibilityComponent } from 'app/modules/role-based-visibility/role-based-visibility/role-based-visibility.component';
import { FuseValidators } from '@fuse/validators';
import { ProfileService } from 'app/services/profile/profile.service';
import { AlertService } from 'app/services/alert/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'profile',
  standalone   : true,
  imports      : [RoleBasedVisibilityComponent, MatCheckboxModule, NgIf, NgFor, MatMenuModule, MatTabsModule, MatIconModule, FormsModule, MatFormFieldModule, NgClass, MatInputModule, TextFieldModule, ReactiveFormsModule, MatButtonToggleModule, MatButtonModule, MatSelectModule, MatOptionModule, MatChipsModule, MatDatepickerModule],
  templateUrl: './profile.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./profile.component.scss']
})


export class ProfileComponent {
  @ViewChild('signUpNgForm') signUpNgForm: NgForm;
  isScreenSmall: boolean;
  navigation: Navigation;
  user: User;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  createForm: FormGroup; //formulario para editar perfil admin
  formAssistant: FormGroup; //formulario para editar perfil asistente

  formFieldHelpers: string[] = [''];  

  constructor(
    private _formBuilder: UntypedFormBuilder,    
    private _userService: UserService,
    private _profileService: ProfileService,
    private _alertService: AlertService,
    private _router: Router
    )
    {
      this.createForm = this._formBuilder.group(
        {
          name: ['', Validators.required],
          email: [''],
          telefono_movil: ['', 
            [ 
              Validators.required, 
              Validators.minLength(10),
              Validators.maxLength(10),
              Validators.pattern(/^[0-9]+$/)
            ]
          ],
          password: [''],
          passwordConfirm: [''],        
        },
        {
          validators: FuseValidators.mustMatch('password', 'passwordConfirm'),
        },
      );

      this.formAssistant = this._formBuilder.group(
        {
          nombre: [''],
          apellido_paterno: [''],
          apellido_materno: [''],
          email: [''],
          telefono_movil: ['', 
            [ 
              Validators.required, 
              Validators.minLength(10),
              Validators.maxLength(10),
              Validators.pattern(/^[0-9]+$/)
            ]
          ],
          ciudad: ['', Validators.required],
          password: [''],
          passwordConfirm: [''],
        },
        {
          validators: FuseValidators.mustMatch('password', 'passwordConfirm'),
        }
      );
    }


    /**
     * On init
     */
    ngOnInit(): void
    {      

      // Subscribe to the user service
      this._userService.user$
        .pipe((takeUntil(this._unsubscribeAll)))
        .subscribe((user: User) =>
        {
          this.user = user;
          //console.log(this.user)
        });
      
      //obtener los datos del usuario
      this.getUserById();
      
      //Admin: detectar cuando se ingresa una contraseña requerir la repeticion
      this.createForm.get('password').valueChanges.subscribe( value => {
        const passwordConfirm = this.createForm.get('passwordConfirm');
        const password = this.createForm.get('password');
        //console.log(value);
        if(value) {
          password.setValidators(Validators.minLength(6));
          passwordConfirm.setValidators(Validators.required);
        }else {
          password.setValidators(null);
          passwordConfirm.setValidators(null);
        }

        passwordConfirm.updateValueAndValidity();
      });

      //Assistant: detectar cuando se ingresa una contraseña requerir la repeticion
      this.formAssistant.get('password').valueChanges.subscribe( value => {
        const passwordConfirm = this.formAssistant.get('passwordConfirm');
        const password = this.formAssistant.get('password');
        if(value) {
          password.setValidators(Validators.minLength(6));
          passwordConfirm.setValidators(Validators.required);
        }else {
          password.setValidators(null);
          passwordConfirm.setValidators(null);
        }

        passwordConfirm.updateValueAndValidity();
      });
       
    }

    getFormFieldHelpersAsString(): string
    {
        return this.formFieldHelpers.join(' ');
    }

    getUserById() {
      this._profileService.getUserById(this.user.id).subscribe(
        (response: any) => {
          if(response.result) {
            this.addValues(response.data);
          }else {
            let message = response.message ? response.message : 'Error al obtener datos';
            this._alertService.alertConfirmation('error', message);
          }
        },
        (error) => {
          console.error('Error en la peticion', error);
        }
      )
    }

    addValues(data: any) {
      //Admin: actualizamos los valores del usuario
      this.createForm.patchValue({
        name: data.name,
        email: data.email,
        telefono_movil: data.telefono_movil,                 
      });

      //Assistant: Actualizamos los valores del usuario
      this.formAssistant.patchValue({
        nombre: data.nombre,
        apellido_paterno: data.apellido_paterno,
        apellido_materno: data.apellido_materno,
        email: data.email,
        telefono_movil: data.telefono_movil,
        ciudad: data.ciudad
      });
    }

    updateAdmin() {
      const password = this.createForm.get('password');
      password.updateValueAndValidity();
      //validar formulario
      if (this.createForm.invalid) {
        return;
      }

      const data = {
        id: this.user.id,
        name: this.createForm.get('name').value,
        telefono_movil: this.createForm.get('telefono_movil').value,
        password: this.createForm.get('password').value
      };

      // console.log(data);
      // return;

      this._profileService.updateAdmin(data).subscribe(
        (response: any) => {
          if(response.result) {
            //limpiar campos de contraseña
            this.createForm.patchValue({
              password: '',
              passwordConfirm: ''
            });

            this._alertService.alertConfirmation('success', response.message);
          }else {
            let message = response.message ? response.message : 'Error en la petición'
            this._alertService.alertConfirmation('error', message);
          }
        },
        (error) => {
          console.error('Error en la peticion', error);
        }
      )
    }

    updateAssistant() {
      //validar formulario
      if (this.formAssistant.invalid) {
        return;
      }

      const data = {
        id: this.user.id,
        telefono_movil: this.formAssistant.get('telefono_movil').value,
        ciudad: this.formAssistant.get('ciudad').value,
        password: this.formAssistant.get('password').value
      };

      // console.log(data);
      // return;

      this._profileService.updateAssistant(data).subscribe(
        (response: any) => {
          if(response.result) {
            //limpiar los campos de contraseña
            this.formAssistant.patchValue({
              password: '',
              passwordConfirm: ''
            });

            this._alertService.alertConfirmation('success', response.message);
          }else {
            let message = response.message ? response.message : 'Error en la petición'
            this._alertService.alertConfirmation('error', message);
          }
        },
        (error) => {
          console.error('Error en la peticion', error);
        }
      )
    }

    //importante evitar bucle infinito, al actualizar campo password
    updateFieldPasswordAdmin() {
      const password = this.createForm.get('password');
      password.updateValueAndValidity();
    }

    updateFieldPasswordAssistant() {
      const password = this.formAssistant.get('password');
      password.updateValueAndValidity();
    }

    //redirigir a menu
    redirectToMenu() {
      this._router.navigate(['/menu']);
    }

}
