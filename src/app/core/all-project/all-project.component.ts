import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-all-project',
  templateUrl: './all-project.component.html',
  styleUrls: ['./all-project.component.css']
})
export class AllProjectComponent implements OnInit {

  //@Input() project!: any[]; 

  projects: any;
  searchTerm: string = '';
  userName: any = ''

  constructor(private route: Router, private service: CoreService, private loginService: LoginService) { }

  ngOnInit(): void {
    this.getAllProject()
    this.userName = this.service.getUserName()
  }

  navigateToProjectDetails(projectId: string) {
    localStorage.setItem('projectDetails', JSON.stringify(projectId))
    this.route.navigate(['/core/main/dashboard', projectId]);
  }

  getAllProject() {
    this.service.getProjectList().subscribe({
      next: (resp) => {
        this.projects = resp.projectsDetails;
      }
    })
    //this.route.navigateByUrl('/core/main/dashboard')
  }

  logout() {
    this.loginService.logout();
  }

}
