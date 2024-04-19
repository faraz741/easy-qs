import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent implements OnInit {

  userName: any = '';

  constructor(private route: Router, private ser: CoreService, private service: LoginService) { }

  ngOnInit(): void {
    this.userName = this.ser.getUserName()
  }

  logout() {
    this.service.logout();
  }


}
