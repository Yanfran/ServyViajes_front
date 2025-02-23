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

import Swal, { SweetAlertIcon } from 'sweetalert2';

import { PdfService } from 'app/services/pdf/pdf.service';

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
    formStripe: FormGroup;
    total: number = 0;

    // Stripe
    // Public
    stripePromise = loadStripe('pk_test_51Qko6pRJhPntHxRGR7lwL1gTN5EHkLU0XYYBPbNjxWaHHWtftbrLhtbgLTxuwqESOaQ9WnS1qsl1ceIYJcjdxTRI00DTdHpv8D');
    elements: any;
    cardNumber: any;
    cardExpiry: any;
    cardCvc: any;

    sub: number = 0;
    iva: number = 0;

    // validator inputs

    i_v_name: boolean = true;
    i_v_phone: boolean = true;
    i_v_language: boolean = true;
    i_v_email: boolean = true;
    i_v_file: boolean = true;
    i_v_certification: boolean = true;
    i_v_apostille: boolean = true;
    lang_v_1: boolean = true;
    lang_v_2: boolean = true;

    // validator stripe
    i_v_s_email: boolean = true;
    i_v_s_country: boolean = true;
    i_v_s_number: boolean = true;
    i_v_s_expiry: boolean = true;
    i_v_s_cvc: boolean = true;

    isModalOpen = false;
    translate : any = {};

    priceOfPage: number = 0;

    constructor(private _landingHomeService: LandingHomeService,
        private router: Router,
        private _landingEventosService: LandingEventosService,
        private fb: FormBuilder,
        private http: HttpClient,
        private _pdfService: PdfService,
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
            lang_1: "",
            lang_2: "",
            certificationOptions: [false],
            legalizationApostille: [false],
            cupon: [''],
        });
        this.formStripe = this.fb.group({
            email: [''],
            country: ['']
        });
    }

    async ngOnInit() {

        console.log(1, this.translate);
        await this.loadTranslations("de");
        console.log(2, this.translate);

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

                console.log(response);
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
                // alert('Please upload a PDF file.');
                const msg = 'Please upload a PDF file.';
                this.ErrorSwal(msg);
            }
        }
    }

    async countPages(file: File) {

        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const numPages = pdfDoc.getPageCount();

        this.form.patchValue({ numberOfPages: numPages });

        if (numPages >= 1 && numPages <= 50) {
            this.priceOfPage = 50;
        } else if (numPages > 50 && numPages <= 100) {
            this.priceOfPage = 40;
        } else if (numPages > 100 && numPages <= 150) {
            this.priceOfPage = 30;
        } else if (numPages > 150) {
            this.priceOfPage = 25;
        }

        console.log(`Number of pages: ${numPages}`);
        console.log(`Price of pages: ${this.priceOfPage}`);
    }

    async handlePayment() {

        if (this.ValInputs()) {

            var paymentIntent;

            try {

                const total = this.obtenerMonto();

                const monto = total * 100;

                const stripe = await this.stripePromise;

                // Secret
                const response = await fetch('https://api.stripe.com/v1/payment_intents', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Bearer sk_test_51Qko6pRJhPntHxRGF6sDciSXkmLH3sSNuHCuAOLohBiqaEQotoNFlD0Oghxkyn9TdGR2voPQiNDLUmt0hw2Mytze008Ly9Gj9Y'
                    },
                    body: new URLSearchParams({
                        'amount': monto + '', // Monto en centavos
                        'currency': 'eur'
                    })
                });

                paymentIntent = await response.json();
                const clientSecret = paymentIntent.client_secret;

                const { error, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: this.cardNumber,
                        billing_details: {
                            // name: this.form.get('name').value,
                            email: this.formStripe.get('email').value,
                            address: {
                                country: this.formStripe.get('country').value, // Asegúrate de que "country" es el nombre del campo en tu formulario
                            },
                        },
                    },
                });

                if (error) {
                    console.warn('Error:', error);
                    throw new Error(error.message);

                }

                const base64 = await this.convertFileToBase64(this.form.get('file').value);

                console.log("base64: ", base64);

                if (base64 == "") {
                    throw new Error("Error al cargar el archivo, por favor intente subirlo nuevamente.");
                }

                const data = {
                    'name': this.form.get('name').value,
                    'email': this.form.get('email').value,
                    'phone': this.form.get('phone').value,
                    'file': base64,
                    'lang_1': this.form.get('lang_1').value,
                    'lang_2': this.form.get('lang_2').value,
                    'number_page': this.form.get('numberOfPages').value,
                    'certification': this.form.get('certificationOptions').value,
                    'apostille': this.form.get('legalizationApostille').value,
                    'cupon': this.form.get('cupon').value,
                    'email_stripe': this.formStripe.get('email').value,
                    'transaction_stripe': paymentIntent.id,
                    'total': total,
                };

                await this.SavePdf(data);

                console.log('Pago exitoso:', paymentIntent);

            }
            catch (error) {

                console.log(paymentIntent.id);
                if (paymentIntent.id) {
                    await this.refundPayment(paymentIntent.id);
                }

                this.ErrorSwal(error);
            }
        }


    }

    SubTotal(): number {

        var sub = 0;

        sub = this.form.get('numberOfPages').value * this.priceOfPage;

        if (this.form.get('certificationOptions').value) {
            sub += 100;
        }

        if (this.form.get('legalizationApostille').value) {
            sub += 100;
        }

        this.sub = sub;
        return sub;
    }

    Iva(): number {
        var iva = 0;

        iva = this.sub * 0.16;

        this.iva = iva;
        return iva;
    }

    ValInputs(): boolean {

        let val = true;

        const i_name = this.form.get('name').value;
        const i_phone = this.form.get('phone').value;
        const i_email = this.form.get('email').value;
        const i_file = this.form.get('file').value;

        const lang_1 = this.form.get('lang_1').value;
        const lang_2 = this.form.get('lang_2').value;

        // Stripe
        const i_s_email = this.formStripe.get('email').value;
        const i_s_country = this.formStripe.get('country').value;

        const cardElement = this.cardNumber;
        const valCard = cardElement ? cardElement._complete : false;

        const expiryElement = this.cardExpiry;
        const valExpiry = expiryElement ? expiryElement._complete : false;

        const cvcElement = this.cardCvc;
        const valCvc = cvcElement ? cvcElement._complete : false;

        if (!i_name) {
            this.i_v_name = false;
            val = false;
        }

        if (!i_phone) {
            this.i_v_phone = false;
            val = false;
        }

        if (!i_email) {
            this.i_v_email = false;
            val = false;
        }

        if (!i_file) {
            this.i_v_file = false;
            val = false;
        }

        if (!lang_1) {
            this.lang_v_1 = false;
            val = false;
        }

        if (!lang_2) {
            this.lang_v_2 = false;
            val = false;
        }

        if (lang_1 == lang_2) {
            this.lang_v_1 = false;
            this.lang_v_2 = false;
            val = false;
        }

        if (!i_s_email) {
            this.i_v_s_email = false;
            val = false;
        }

        if (!i_s_country) {
            this.i_v_s_country = false;
            val = false;
        }

        if (!valCard) {
            this.i_v_s_number = false;
            val = false;
        }

        if (!valExpiry) {
            this.i_v_s_expiry = false;
            val = false;
        }

        if (!valCvc) {
            this.i_v_s_cvc = false;
            val = false;
        }

        setTimeout(() => {
            this.resetValid();
        }, 3000);

        return val;
    }

    resetValid() {
        this.i_v_name = true;
        this.i_v_phone = true;
        this.i_v_email = true;
        this.i_v_file = true;
        this.lang_v_1 = true;
        this.lang_v_2 = true;

        // Stripe
        this.i_v_s_email = true;
        this.i_v_s_country = true;
        this.i_v_s_number = true;
        this.i_v_s_expiry = true;
        this.i_v_s_cvc = true;
    }

    async refundPayment(paymentIntentId: string) {
        const response = await fetch(`https://api.stripe.com/v1/refunds`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer sk_test_51Qko6pRJhPntHxRGF6sDciSXkmLH3sSNuHCuAOLohBiqaEQotoNFlD0Oghxkyn9TdGR2voPQiNDLUmt0hw2Mytze008Ly9Gj9Y'
            },
            body: new URLSearchParams({
                'payment_intent': paymentIntentId
            })
        });

        const refund = await response.json();
        if (refund.error) {
            console.error('Error en el reembolso:', refund.error);
        } else {
            console.log('Reembolso exitoso:', refund);
        }
    }

    obtenerMonto(): number {

        var total = 0;

        total = this.form.get('numberOfPages').value * this.priceOfPage;

        if (this.form.get('certificationOptions').value) {
            total += 100;
        }

        if (this.form.get('legalizationApostille').value) {
            total += 100;
        }

        var iva = total * 0.16;

        total += iva;

        return total;
    }

    ErrorSwal(msg: string) {
        Swal.fire({
            title: 'Error',
            text: msg,
            icon: 'error',
            confirmButtonText: 'Ok'
        }).then((result) => {
        });
    }

    async convertFileToBase64(file: File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64File = reader.result as string;
                resolve(base64File);
            };
            reader.onerror = (error) => {
                console.log('Error: ', error);
                reject("");
            };
            reader.readAsDataURL(file);
        });
    }

    SavePdf(data) {
        this._pdfService.saveOrder(data).subscribe(
            (response: any) => {

                if (response.result) {

                    // const data = response.data;
                    // this.asignarValores(data);

                    Swal.fire({
                        title: 'Correcto',
                        text: "",
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    }).then((result) => {
                    });

                } else {
                    console.error(
                        'Error al obtener al guardar:',
                        response.message
                    );

                    this.ErrorSwal(response.message);
                }
            },
            (error) => {
                console.error('Error al obtener al guardar:', error);
                this.ErrorSwal(error.message);
            }
        );
    }

    async loadTranslations(lang: string) {
        try {
          const data = await this._landingHomeService.getTranslation(lang).toPromise();
          this.translate = data;
        } catch (error) {
          console.error('Error loading translations:', error);
        }
      }
}
