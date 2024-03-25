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
      "userId": user_id,
      "newRating": rating
    };

    return this.http.post<PersonnelData>(url, request);
  };

  addListing(title: string, condition: string, price: number, description: string, seller_id: number, images: File[]) {
    const url = 'http://localhost:8080/addListing';

    const formData = new FormData();
    formData.append('title', title);
    formData.append('condition', condition);
    formData.append('price', String(price));
    formData.append('description', description);
    formData.append('seller_id', String(seller_id));
    for(let img of images){
      formData.append('images', img);
    }

    return this.http.post<any>(url, formData);
  }

  verifyUser(userToVerify: number) {
    const url = 'http://173.230.140.95:8080/verify';

    const request = {
      "userId": userToVerify,
    };

    return this.http.post(url, request);
  }

  deleteUser(userToDelete: number) {
    const url = 'http://173.230.140.95:8080/removeUser';
    const request = {
      "userId": userToDelete,
    };

    return this.http.post(url, request);
  }

  searchListings(searchTerm: string) {
    const url = 'http://173.230.140.95:8080/search';
    const request = {
        "searchTerm": searchTerm
    };

    return this.http.post<ListingData[]>(url, request);
  }

  getListing(listingId: number) {
    const url = 'http://173.230.140.95:8080/getListing';
    const request = {
        "id": listingId
    };

    return this.http.post<ListingData[]>(url, request);
  }

}
