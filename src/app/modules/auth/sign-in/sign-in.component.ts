import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
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
import { jwtDecode } from 'jwt-decode';
import { SharedService } from 'app/services/shared/shared.service';
import { AlertService } from 'app/services/alert/alert.service';
import { AssistantsService } from 'app/services/assistants/assistants.service';

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    standalone   : true,
    imports      : [RouterLink, FuseAlertComponent, NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
})
export class AuthSignInComponent implements OnInit
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    email: string = '';
    password: string = '';
    rememberMe: string = '';

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: '',
    };
    // signInForm: UntypedFormGroup;
    signInForm = new UntypedFormGroup({
        email: new UntypedFormControl('', []),
        password: new UntypedFormControl('', []),
        rememberMe: new UntypedFormControl('', []),        
    })
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
        private _shareService: SharedService,
        private _assistantsService: AssistantsService,
        private alertService: AlertService        
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email     : ['admin@gmail.com', [Validators.required, Validators.email]],
            password  : ['123456', Validators.required],
            rememberMe: [''],
        });

        // this.sharedData = this._shareService.getSharedData();
        // console.log('intentando obtener datos');
        // console.log(this.sharedData);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void
    {

        if (this.signInForm.value.email == '' || this.signInForm.value.password == '') {
            this.alert = {
                type: 'error',
                message: 'Debe llenar todos los campos',
            }; 
             // Re-enable the form
            this.signInForm.enable();                
    
            // Show the alert
            this.showAlert = true;
            return;
        }
        
        // Return if the form is invalid
        if ( this.signInForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        var datos = {
            email: this.signInForm.value.email,
            password: this.signInForm.value.password,
            rememberMe: this.signInForm.value.rememberMe,            
        };

        // Sign in
        // this._authService.signIn(this.signInForm.value)
        //     .subscribe(
        //         () =>
        //         {
        //             // Set the redirect url.
        //             // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
        //             // to the correct page after a successful sign in. This way, that url can be set via
        //             // routing file and we don't have to touch here.
        //             const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

        //             // Navigate to the redirect url
        //             this._router.navigateByUrl(redirectURL);

        //         },
        //         (response) =>
        //         {
        //             // Re-enable the form
        //             this.signInForm.enable();

        //             // Reset the form
        //             this.signInNgForm.resetForm();

        //             // Set the alert
        //             this.alert = {
        //                 type   : 'error',
        //                 message: 'Wrong email or password',
        //             };

        //             // Show the alert
        //             this.showAlert = true;
        //         },
        //     );



        try {
            // Sign in
            this._authService.signIn(datos)
            .subscribe(
                (response: any) => {
                    if (response.result) {
                        // console.log(response.result)

                        // const { access_token } = response.data.original;
                        // console.log(access_token);
                    
                        // const decodedToken = jwtDecode(access_token);
                        // console.log(decodedToken);
                    
                        // Set the redirect url.
                        // if(this.sharedData) {
                        //     this.registerAssistantEvent(this.sharedData);
                        // }

                        const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                    
                        // Navigate to the redirect url
                        this._router.navigateByUrl(redirectURL);
                        // this._router.navigate(['signed-in-redirect']);

                    } else {
                        // console.log(response) 
                        this.alert = {
                            type: 'error',
                            message: response.message,
                        }; 
                         // Re-enable the form
                        this.signInForm.enable();
                
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
                    this.signInForm.enable();
            
                    // Reset the form
                    // this.signInNgForm.resetForm();
            
                    // Show the alert
                    this.showAlert = true;
                }
            );   
        } catch (error) {
            this.alert = {
                type   : 'error',
                message: error,
            };

            // Re-enable the form
            this.signInForm.enable();
        
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
    //                 this._router.navigate(['/menu']);
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
