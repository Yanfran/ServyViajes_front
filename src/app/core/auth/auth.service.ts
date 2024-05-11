import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from "../../../environments/environment";
import { jwtDecode } from 'jwt-decode';

@Injectable({providedIn: 'root'})
export class AuthService
{
    private URL = environment.apiUrl;
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(data: any): Observable<any>
    {
        return this._httpClient.post(`${this.URL}/auth/forgot-password`, data);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(data: any): Observable<any>
    {
        return this._httpClient.post(`${this.URL}/auth/reset-password`, data);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        // return this._httpClient.post('api/auth/sign-in', credentials).pipe(
        //     switchMap((response: any) =>
        //     {                

        //         // Store the access token in the local storage
        //         this.accessToken = response.accessToken;                

        //         // Set the authenticated flag to true
        //         this._authenticated = true;

        //         // console.log(response);

        //         // Store the user on the user service
        //         this._userService.user = response.user;

        //         // Return a new observable with the response
        //         return of(response);
        //     }),
        // );

        return this._httpClient.post(`${this.URL}/login`, credentials).pipe(
            switchMap((response: any) =>
            {
                if(response.result){
                
                    // console.log("Token del back", response.access_token);
                    // const { access_token } = response.data.original;

                    // Store the access token in the local storage
                    this.accessToken = response.access_token;                

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = response.user.user;

                    // Return a new observable with the response
                    return of(response);

                } else {
                    return throwError('Datos incorrectos.');
                }
            }),
        );
    }
   
    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {


        const storage = localStorage.getItem('accessToken');                

        const decodedToken = jwtDecode(storage) as any;
        // console.log("console.log", decodedToken);    
        // console.log("console.log", decodedToken.user);    
        

        if ( storage )
        {
            this.accessToken = storage;
        }

        // Set the authenticated flag to true
        this._authenticated = true;

        // Store the user on the user service
        this._userService.user = decodedToken.user;

        // Return true
        return of(true);


        // Sign in using the token
        // return this._httpClient.post('api/auth/sign-in-with-token', {
        //     accessToken: this.accessToken,
        // }).pipe(
        //     catchError(() =>

        //         // Return false
        //         of(false),
        //     ),
        //     switchMap((response: any) =>
        //     {

        //         console.log("api/auth/sign-in-with-token", response)
        //         // Replace the access token with the new one if it's available on
        //         // the response object.
        //         //
        //         // This is an added optional step for better security. Once you sign
        //         // in using the token, you should generate a new one on the server
        //         // side and attach it to the response object. Then the following
        //         // piece of code can replace the token with the refreshed one.
        //         if ( response.accessToken )
        //         {
        //             this.accessToken = response.accessToken;
        //         }

        //         // Set the authenticated flag to true
        //         this._authenticated = true;

        //         // Store the user on the user service
        //         this._userService.user = response.user;

        //         // Return true
        //         return of(true);
        //     }),
        // );


    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {

        // console.log("entro en el singOut");
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }

        // If the access token exists, and it didn't expire, sign in using it
        return this.signInUsingToken();
    }


    hasRole(expectedRole: any): boolean {
        // const userRole = this.getUserRole();
        const userRole = +this.getUserRole(); 
    
        if (Array.isArray(expectedRole) && expectedRole.includes(userRole)) {
            return true;
        } else {
            return userRole === expectedRole;
        }
    }


    // hasRole(expectedRole: string): boolean {
    //     // Aquí implementa la lógica para verificar si el usuario tiene el rol esperado.
    //     // Puedes obtener el rol del usuario desde donde lo almacenes en tu servicio.
    //     const userRole = this.getUserRole(); // Debes implementar el método getUserRole.
        
    
    //     return userRole === expectedRole;
    // }


    getUserRole(): string
    {
        const storage = localStorage.getItem('accessToken');                
        const decodedToken = jwtDecode(storage) as any;         
        return decodedToken.user.id_rol;       
    }

}
