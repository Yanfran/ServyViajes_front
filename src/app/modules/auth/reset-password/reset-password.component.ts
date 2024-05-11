import { I18nPluralPipe, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { AuthService } from 'app/core/auth/auth.service';
import { finalize, Subject, takeUntil, takeWhile, tap, timer } from 'rxjs';

@Component({
    selector     : 'auth-reset-password',
    templateUrl  : './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    standalone   : true,
    imports      : [
        NgIf, 
        FuseAlertComponent, 
        FormsModule, 
        ReactiveFormsModule, 
        MatFormFieldModule, 
        MatInputModule, 
        MatButtonModule, 
        MatIconModule, 
        MatProgressSpinnerModule, 
        RouterLink,
        I18nPluralPipe
    ],
})
export class AuthResetPasswordComponent implements OnInit
{
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: '',
    };
    resetPasswordForm: UntypedFormGroup;
    showAlert: boolean = false;
    token: string;

    //contador para redireccionar despues de restablecer contraseña
    countdown: number = 5;
    countdownMapping: any = {
        '=1'   : '# segundo',
        'other': '# segundos',
    };
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    //variable para mostrar pantalla despues de restablecer contraseña
    isResetPassword: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _activatedRoute: ActivatedRoute
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
        //capturamos el token de la url
        this._activatedRoute.queryParams.subscribe(params => {
            this.token = params['token'];
            //console.log(this.token);
        });

        // Create the form
        this.resetPasswordForm = this._formBuilder.group({
                password       : ['', 
                    [
                        Validators.required,
                        Validators.minLength(6)
                    ]
                ],
                passwordConfirm: ['', Validators.required],
            },
            {
                validators: FuseValidators.mustMatch('password', 'passwordConfirm'),
            },
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    resetPassword(): void
    {
        // Return if the form is invalid
        if ( this.resetPasswordForm.invalid )
        {
            return;
        }

        // Disable the form
        this.resetPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        //creamos un objeto que va contener el token y password
        const data = {
            token: this.token,
            password: this.resetPasswordForm.get('password').value,
        };

        // Send the request to the server
        this._authService.resetPassword(data)
            .pipe(
                finalize(() =>
                {
                    // Re-enable the form
                    this.resetPasswordForm.enable();

                    // Reset the form
                    this.resetPasswordNgForm.resetForm();

                    // Show the alert
                    this.showAlert = true;
                }),
            )
            .subscribe(
                (response) =>
                {   
                    if(response.result) {
                        this.alert = {
                            type   : 'success',
                            message: response.message,
                        };
                        this.autoRedirectToLogin();
                    }else {
                        this.alert = {
                            type   : 'error',
                            message: response ? response.message : 'Error inesperado en la respuesta.',
                        };
                    }
                    
                },
                (error) =>
                {
                    console.error('Error en la solicitud:', error);
                },
            );
    }

    autoRedirectToLogin() {
        this.isResetPassword = true;
        timer(1000, 1000)
            .pipe(
                finalize(() =>
                {
                    this._router.navigate(['sign-in']);
                }),
                takeWhile(() => this.countdown > 0),
                takeUntil(this._unsubscribeAll),
                tap(() => this.countdown--),
            )
            .subscribe();
    }

    redirectToLogin() {
        this._router.navigate(['/sign-in']);
    }
}
