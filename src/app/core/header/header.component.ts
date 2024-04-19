import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private service: LoginService, private route: ActivatedRoute, private coreSer: CoreService) { }

  projectDet: any = '';
  projectId: any = '';
  projectName: any = '';
  userName: any = ''

  ngOnInit(): void {
    this.projectDet = localStorage.getItem('projectDetails');
    const parsedData = JSON.parse(this.projectDet);
    this.projectName = parsedData['name'];
    this.userName = this.coreSer.getUserName()
  }

  logout() {
    this.service.logout();
  }

}
