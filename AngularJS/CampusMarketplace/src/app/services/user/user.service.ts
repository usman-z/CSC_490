import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListingData } from 'src/app/models/listing/listing.model';
import { PersonnelData } from 'src/app/models/personnel/personnel.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserInfo(userId: number){
    const url = 'http://173.230.140.95:8080/info';
    const request ={
      "userId": userId
    }

    return this.http.post<PersonnelData>(url, request);

  };

  rateUser(user_id: number, rating: number) {
    const url = 'http://173.230.140.95:8080/rate';

    const request = {
      "studentId": user_id,
      "rating": rating
    };
    
    return this.http.post<PersonnelData>(url, request);
  };

  addListing(title: string, condition: string, price: number, description: string, seller_id: number, images_folder_path: string) {
    const url = 'http://localhost:8080/addListing';

    const request = {
        "title":  title,
        "condition":condition,
        "price": price,
        "description": description,
        "seller_id": seller_id,
        "images_folder_path": images_folder_path
    };
    
    return this.http.post<ListingData>(url, request);
  }
}
