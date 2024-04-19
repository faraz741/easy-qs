import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  resetForm!: FormGroup

  constructor(private route: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.resetForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    })
  }

  onSubmit() {
    this.resetForm.markAllAsTouched();
    if (this.resetForm.valid) {
      this.route.navigateByUrl('home/reset-password')
    }
  }

}
