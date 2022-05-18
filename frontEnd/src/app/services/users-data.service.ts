import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersDataService {

  url="http://localhost:4200/users"
    
  
    constructor(private http:HttpClient) { }
    users()
    {
      return this.http.get(this.url)
    }
  }