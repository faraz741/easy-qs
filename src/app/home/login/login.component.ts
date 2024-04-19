import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from 'src/app/services/core.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  request1: any = {
    success: false,
    msg: null,
    status: null,
  };

  disableSubmitBtn = true
  isPasswordVisible: boolean = false;
  loginForm!: FormGroup
  projectData: any[] = []
  projectDataLength: any;
  loading: boolean = false;


  constructor(private route: Router, private srevice: LoginService, private coreSer: CoreService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initForm();
  }

  // getProList() {
  //   this.coreSer.getProjectList().subscribe({
  //     next: (resp) => {
  //       console.log('project resp',resp)
  //       this.projectData = resp.projectsDetails
  //       console.log('project length', this.projectData.length)
  //     }
  //   })
  // }

  initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      rememberMe: new FormControl(false, Validators.required)
    })
  }

  // getProListAndLogin() {
  //   this.loading = true; 
  //   this.coreSer.getProjectList().subscribe({
  //     next: (resp) => {
  //       console.log('project resp', resp);
  //       this.projectData = resp.projectsDetails;
  //       console.log("Project Data Length:", this.projectData?.length);
  //       this.login();
  //     },
  //     error: (error) => {
  //       console.error('Error fetching project list:', error);
  //     }
  //   });
  // }

  loginAndFetchData() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.resetRequest();
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('email', this.loginForm.value.email);
      formURlData.set('password', this.loginForm.value.password);
      this.srevice.loginUser(formURlData.toString()).subscribe({
        next: (resp) => {
          this.request1.msg = resp.message;
          if (resp.success == true) {
            localStorage.setItem('userDetail', JSON.stringify(resp.user_info));
            this.srevice.setToken(resp.token);
            this.toastr.success(resp.message);
            this.loading = false;
            this.fetchProjectList(); // Call the function to fetch project list after successful login
          } else {
            this.toastr.warning(resp.message);
            this.loading = false;
          }
        },
        error: (error) => {
          this.toastr.warning('Something went wrong.');
          console.error('Login error:', error.message);
        }
      });
    }
  }

  fetchProjectList() {
    this.coreSer.getProjectList().subscribe({
      next: (resp) => {
        console.log('project resp', resp);
        this.projectData = resp.projectsDetails;
        console.log('project length', this.projectData.length);
        this.redirectBasedOnProjectData();
      },
      error: (error) => {
        console.error('Error fetching project list:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  redirectBasedOnProjectData() {
    if (this.projectData.length == 0) {
      this.route.navigateByUrl("/core/admin/new");
    } else {
      console.log("coming here");
      this.route.navigateByUrl("/core/admin/all-project");
    }
  }

  // login2() {
  //   this.loginForm.markAllAsTouched();
  //   if (this.loginForm.valid) {
  //     this.resetRequest();
  //     //this.loading = true; 
  //     const formURlData = new URLSearchParams();
  //     formURlData.set('email', this.loginForm.value.email);
  //     formURlData.set('password', this.loginForm.value.password);
  //     this.srevice.loginUser(formURlData.toString()).subscribe({
  //       next: (resp) => {
  //         this.request1.msg = resp.message
  //         if (resp.success == true) {
  //           localStorage.setItem('userDetail', JSON.stringify(resp.user_info))
  //           this.srevice.setToken(resp.token)
  //           this.toastr.success(resp.message);
  //           console.log("Project Data Length:", this.projectData?.length);
  //           if (this.projectData?.length == 0) {
  //             this.route.navigateByUrl("/core/admin/new")
  //           } else {
  //             console.log("coming here")
  //             this.route.navigateByUrl("/core/admin/all-project")
  //           }
  //         }
  //         else {
  //           this.toastr.warning(resp.message);
  //         }
  //       },
  //       error: error => {
  //         this.toastr.warning('Something went wrong.');
  //         console.log(error.message)
  //       },
  //       complete: () => {
  //         this.loading = false; 
  //       }
  //     });
  //   }
  // }


  // login() {
  //   this.loginForm.markAllAsTouched();
  //   if (this.loginForm.valid) {
  //     this.resetRequest();
  //     const formURlData = new URLSearchParams();
  //     formURlData.set('email', this.loginForm.value.email);
  //     formURlData.set('password', this.loginForm.value.password);
  //     this.srevice.loginUser(formURlData.toString()).subscribe({
  //       next: (resp) => {
  //         this.request1.msg = resp.message
  //         if (resp.success == true) {
  //           localStorage.setItem('userDetail', JSON.stringify(resp.user_info))
  //           this.srevice.setToken(resp.token)
  //           this.toastr.success(resp.message);
  //           console.log("Project Data Length:", this.projectData?.length);
  //           if (this.projectData?.length == 0 ) {
  //             this.route.navigateByUrl("/core/admin/new")
  //           } else {
  //             console.log("coming here")
  //             this.route.navigateByUrl("/core/admin/all-project")
  //           }
  //         }
  //         else{
  //           this.toastr.warning(resp.message);
  //         }
  //       },
  //       error: error => {
  //         this.toastr.warning('Something went wrong.');
  //         console.log(error.message)
  //       }
  //     });
  //   }
  // }

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
