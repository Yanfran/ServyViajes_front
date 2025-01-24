import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LandingHomeService } from 'app/services/landing-home/landing-home.service';
import { environment } from 'environments/environment';
import { LandingEventosService } from 'app/services/landing-eventos/landing-eventos.service';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

// import * as pdfjsLib from 'pdfjs-dist';
// import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { PDFDocument } from 'pdf-lib';

import { loadStripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'landing-home',
    templateUrl: './home.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [
        MatButtonModule,
        RouterLink,
        MatIconModule,
        CommonModule,
        CarouselModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonToggleModule,
        MatSelectModule,
        MatOptionModule,
        MatChipsModule,
        MatDatepickerModule,
        MatCheckboxModule,
    ],
})
export class LandingHomeComponent {
    showListEvents: boolean = false;
    showMobileMenu: boolean = false;

    landing: any;
    URL = environment.urlImg;
    banners: any[] = [];

    carouselOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: true,
        navSpeed: 700,
        navText: ['Anterior', 'Siguiente'],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            992: {
                items: 1
            }
        },
        autoplay: true, // Habilita el autoplay
        toplayTimeout: 3000 // Cambia las imágenes cada 3 segundos (3000 milisegundos)

    };
    /**
     * Constructor
     */

    form: FormGroup;
    total: number = 0;

    // Stripe
    // Public
    stripePromise = loadStripe('pk_test_51Qko6pRJhPntHxRGR7lwL1gTN5EHkLU0XYYBPbNjxWaHHWtftbrLhtbgLTxuwqESOaQ9WnS1qsl1ceIYJcjdxTRI00DTdHpv8D');
    elements: any;
    cardNumber: any;
    cardExpiry: any;
    cardCvc: any;

    constructor(private _landingHomeService: LandingHomeService,
        private router: Router,
        private _landingEventosService: LandingEventosService,
        private fb: FormBuilder,
        private http: HttpClient
    ) {
        this.landing = {
            nosotros: '',
            mensaje: '',
            telefono_fijo: '',
            telefono_movil: '',
            correo_contacto: '',
            url_facebook: '',
            domicilio: '',
            imagen: '',
            imagen_mensaje: '',
        };

        this.getLanding();

        this.form = this.fb.group({
            name: [''],
            phone: [''],
            languageToTranslate: [false],
            email: [''],
            file: [null],
            numberOfPages: [0],
            certificationOptions: [false],
            legalizationApostille: [false],
        });
    }

    async ngOnInit() {
        const stripe = await this.stripePromise;
        this.elements = stripe.elements();

        const style = {
            base: {
              color: '#32325d',
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px',
              '::placeholder': {
                color: '#aab7c4'
              }
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a'
            }
          };
        
        this.cardNumber = this.elements.create('cardNumber', { style: style });
        this.cardNumber.mount('#card-number-element');

        this.cardExpiry = this.elements.create('cardExpiry', { style: style });
        this.cardExpiry.mount('#card-expiry-element');

        this.cardCvc = this.elements.create('cardCvc', { style: style });
        this.cardCvc.mount('#card-cvc-element');
    }

    getLanding() {
        this._landingHomeService.getLanding().subscribe(
            (response: any) => {
                if (response.result) {
                    const data = response.data;
                    this.asignarValores(data);
                } else {
                    console.error(
                        'Error al obtener la lista:',
                        response.message
                    );
                }
            },
            (error) => {
                console.error('Error al obtener la lista:', error);
            }
        );
    }

    asignarValores(data: any) {
        const srcNosotros = this.URL + '/assets/images/' + data.imagen;
        const srcMensaje = this.URL + '/assets/images/' + data.imagen_mensaje;
        const telMovilFormateado = data.telefono_movil.slice(0, 3) + '-' + data.telefono_movil.slice(3, 6) + '-' + data.telefono_movil.slice(6);
        const telFijoFormateado = data.telefono_fijo.slice(0, 3) + '-' + data.telefono_fijo.slice(3, 6) + '-' + data.telefono_fijo.slice(6);
        this.landing.nosotros = data.nosotros;
        this.landing.mensaje = data.mensaje;
        this.landing.telefono_fijo = telFijoFormateado;
        this.landing.telefono_movil = telMovilFormateado;
        this.landing.correo_contacto = data.correo_contacto;
        this.landing.url_facebook = data.url_facebook;
        this.landing.domicilio = data.domicilio;
        this.landing.imagen = srcNosotros;
        this.landing.imagen_mensaje = srcMensaje;
        this.banners = data?.banners ? data?.banners : [];

        //console.log(this.landing);
    }

    scrollToSection(id: string): void {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    redirectSingUp() {
        this.router.navigate(['/menu']);
    }

    onFileSelected(event: Event): void {

        const input = event.target as HTMLInputElement;

        if (input.files && input.files[0]) {

            const file = input.files[0];

            if (file.type === 'application/pdf') {
                this.form.patchValue({ file: file });
                this.countPages(file);
            } else {
                alert('Please upload a PDF file.');
            }
        }
    }

    async countPages(file: File) {

        // const reader = new FileReader();

        // reader.onload = (e) => {
        //     const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
        //     // pdfjsLib.getDocument(typedarray).promise.then((pdf) => {
        //     //     const numPages = pdf.numPages;
        //     //     this.form.patchValue({ numberOfPages: numPages });
        //     //     console.log(`Number of pages: ${numPages}`);
        //     // });
        // };

        // reader.readAsArrayBuffer(file);

        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const numPages = pdfDoc.getPageCount();
        this.form.patchValue({ numberOfPages: numPages });
        console.log(`Number of pages: ${numPages}`);
    }

    onSubmit(): void {
        console.log(this.form.value);
        // Lógica para manejar el envío del formulario y calcular el total
    }

    // async handlePayment() {
    //     const stripe = await this.stripePromise;
    //     stripe.createPaymentMethod
    //     const { error, paymentIntent } = await stripe.createPayment({
    //       amount: 1000, // Monto en centavos
    //       currency: 'usd',
    //       payment_method: {
    //         card: this.card,
    //         billing_details: {
    //           name: 'Nombre del Cliente',
    //         },
    //       },
    //     });

    //     if (error) {
    //       console.error('Error:', error);
    //     } else {
    //       console.log('Pago exitoso:', paymentIntent);
    //     }
    // }

    async handlePayment() {
        const stripe = await this.stripePromise;

        // Solicita el client_secret al backend (aquí uso un ejemplo de cómo hacerlo sin backend, pero es recomendable usar uno)
        // const clientSecret = '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';

        // Crear el PaymentIntent directamente desde el frontend (solo para pruebas, no recomendado en producción)
        // Secret
        const response = await fetch('https://api.stripe.com/v1/payment_intents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer sk_test_51Qko6pRJhPntHxRGF6sDciSXkmLH3sSNuHCuAOLohBiqaEQotoNFlD0Oghxkyn9TdGR2voPQiNDLUmt0hw2Mytze008Ly9Gj9Y'
            },
            body: new URLSearchParams({
                'amount': '1000', // Monto en centavos
                'currency': 'usd'
            })
        });

        const paymentIntent = await response.json();
        const clientSecret = paymentIntent.client_secret;

        const { error, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: this.cardNumber,
                billing_details: {
                    name: 'Nombre del Cliente',
                },
            },
        });

        // const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        //     payment_method: {
        //         card: this.card,
        //         billing_details: {
        //             name: 'Nombre del Cliente',
        //         },
        //     },
        // });

        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Pago exitoso:', paymentIntent);
        }
    }
}
