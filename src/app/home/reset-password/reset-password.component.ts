import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetForm!: FormGroup
  passwordMismatch = false;

  constructor(private route: Router, private srevice: LoginService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.resetForm = new FormGroup({
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required)
    })

    this.resetForm.get('confirmPassword')?.setValidators([
      Validators.required,
      this.passwordMatchValidator()
    ]);
  }

  onSubmit() {
    this.resetForm.markAllAsTouched();
    const formValues = {
      password: this.resetForm.get('password')?.value
    }
    if (this.resetForm.valid && !this.passwordMismatch) {
      const stringfyUrlData = JSON.stringify(formValues)
      const formURlData = new URLSearchParams();
      formURlData.set('updateJson', stringfyUrlData)
      this.srevice.signupUser(formURlData).subscribe(
        (result) => {
          console.log(result);
          this.route.navigateByUrl("/home/login")
        },
        (err: Error) => {
          console.log(err.message)
        }
      );
      console.log("Form submitted successfully:", this.resetForm.value);
    }
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = this.resetForm.get('password')?.value;
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

}
