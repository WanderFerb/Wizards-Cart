import { Component, OnInit } from '@angular/core';
import { UsersDataService } from 'src/app/services/users-data.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})

export class PrintComponent {
  title = '';
  generatePdf(){
    window.print();
  }
 
  users:any;
  constructor(private userData:UsersDataService)
  {
    userData.users().subscribe((data)=>{
      console.warn("data",data);
      this.users=data;
    });
 
  }
}
