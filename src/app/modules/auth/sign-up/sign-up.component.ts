import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    UntypedFormControl,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { AlertService } from 'app/services/alert/alert.service';
import { AssistantsService } from 'app/services/assistants/assistants.service';
import { RegisterService } from 'app/services/register/register.service';
import { SharedService } from 'app/services/shared/shared.service';

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        RouterLink,
        NgIf,
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
    ],
})
export class AuthSignUpComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    name: string = '';
    email: string = '';
    password: string = '';
    passwordVerify: string = '';

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    // signUpForm: UntypedFormGroup;
    signUpForm = new UntypedFormGroup({
        email: new UntypedFormControl('', []),
        password: new UntypedFormControl('', []),
        passwordVerify: new UntypedFormControl('', []),
        rememberMe: new UntypedFormControl('', []),
    });
    showAlert: boolean = false;
    sharedData: any;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _registroService: RegisterService,
        private _shareService: SharedService,
        private _assistantsService: AssistantsService,
        private alertService: AlertService,
        private router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signUpForm = this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            passwordVerify: ['', Validators.required],
            company: [''],
            agreements: ['', Validators.requiredTrue],
        });

        // this.sharedData = this._shareService.getSharedData();
        // console.log('intentando obtener datos');
        // console.log(this.sharedData);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void {
        // Do nothing if the form is invalid
        if (this.signUpForm.invalid) {
            return;
        }


        if (this.signUpForm.value.password != this.signUpForm.value.passwordVerify) {
            this.alert = {
                type: 'error',
                message: 'Las claves deben ser iguales',
            };            
            this.signUpForm.enable();                        
            this.showAlert = true;

            return;
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;

        var datos = {
            name: this.signUpForm.value.name,
            email: this.signUpForm.value.email,
            password: this.signUpForm.value.password,
        };

        console.log(datos);
       

        try {
            // Sign up
            this._registroService.createRegistro(datos).subscribe(
                (response: any) => {
                    if (response.result) {
                        // console.log(response.result)
                        // if(this.sharedData) {
                        //     this.registerAssistantEvent(this.sharedData);
                        // }
                        // Set the redirect url.
                        const redirectURL =
                            this._activatedRoute.snapshot.queryParamMap.get(
                                'redirectURL'
                            ) || '/sign-in';

                        // Navigate to the redirect url
                        this._router.navigateByUrl(redirectURL);
                    } else {
                        // console.log(response)
                        this.alert = {
                            type: 'error',
                            message: response.message,
                        };
                        // Re-enable the form
                        this.signUpForm.enable();

                        // Reset the form
                        // this.signInNgForm.resetForm();

                        // Show the alert
                        this.showAlert = true;
                    }
                },
                (error) => {
                    this.alert = {
                        type: 'error',
                        message: error,
                    };

                    // Re-enable the form
                    this.signUpForm.enable();

                    // Reset the form
                    // this.signInNgForm.resetForm();

                    // Show the alert
                    this.showAlert = true;
                }
            );
        } catch (error) {
            this.alert = {
                type: 'error',
                message: error,
            };

            // Re-enable the form
            this.signUpForm.enable();

            // Reset the form
            // this.signInNgForm.resetForm();

            // Show the alert
            this.showAlert = true;
        }
    }

    // registerAssistantEvent(data: any) {
    //     this._assistantsService.create(data).subscribe(
    //         (response: any) => {
    //             if(response.result) {
    //                 this.router.navigate(['/menu']);
    //                 let message = "Registro creado con éxito";
    //                 this.alertService.alertConfirmation('success', message);
    //             }else{
    //                 this.alertService.alertConfirmation('error', response.message);
    //             }
    //         },
    //         (error) => {
    //             console.log('Error al registrarse al evento', error);
    //         }
    //     )
    // }
}
