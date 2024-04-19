import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  request1: any = {
    success: false,
    msg: null,
    status: null,
  };

  signupForm!: FormGroup
  passwordMismatch = false;
  isPasswordVisible: boolean = false;

  constructor(private route: Router, private srevice: LoginService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.signupForm = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      company: new FormControl('', Validators.required),
      username: new FormControl('test', Validators.required),
      //phone_number: new FormControl('9876543456', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
      age: new FormControl(true, Validators.required),
      condition: new FormControl(true, Validators.required),
    })

    this.signupForm.get('confirmPassword')?.setValidators([
      Validators.required,
      this.passwordMatchValidator()
    ]);
  }

  onSubmit() {
    this.signupForm.markAllAsTouched();
    // const formValues = {
    //   firstName: this.signupForm.get('firstName')?.value,
    //   lastName: this.signupForm.get('lastName')?.value,
    //   company: this.signupForm.get('company')?.value,
    //   email: this.signupForm.get('email')?.value,
    //   password: this.signupForm.get('password')?.value
    // }
    if (this.signupForm.valid && !this.passwordMismatch) {
      this.resetRequest();
      const concat = (this.signupForm.value.firstname + this.signupForm.value.lastname)
      //const stringfyUrlData = JSON.stringify(formValues)
      const formURlData = new URLSearchParams();
      formURlData.set('firstname', this.signupForm.value.firstname)
      formURlData.set('lastname', this.signupForm.value.lastname)
      formURlData.set('company', this.signupForm.value.company)
      formURlData.set('username', concat)
      //formURlData.set('phone_number', this.signupForm.value.phone_number)
      formURlData.set('email', this.signupForm.value.email)
      formURlData.set('password', this.signupForm.value.password)

      this.srevice.signupUser(formURlData.toString()).subscribe({
        next: (resp) => {
          //console.log(resp);
          //this.request1.msg = resp.message
          if (resp.success === true) {
            this.signupForm.reset();
            this.toastr.success(resp.message);
            //this.route.navigateByUrl("/home/login")
          } else {
            this.toastr.warning(resp.message);
          }
        },
        error: Error => {
          this.toastr.warning('Something went wrong.');
          console.log(Error.message)
        }
      });
    }
    //this.route.navigateByUrl("/home/login")
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = this.signupForm.get('password')?.value;
      const confirmPassword = control.value;
      if (password !== confirmPassword) {
        this.passwordMismatch = true;
        return { passwordMismatch: true };
      } else {
        this.passwordMismatch = false;
        return null;
      }
    };
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  resetRequest() {
    this.request1 = {
      success: false,
      msg: null,
      status: null,
    };
  }


}
