import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LatlongFetchService{
	private SERVER = "http://ip-api.com/json";
  	constructor(private httpClient: HttpClient) { }

  	public sendReq(){
    return this.httpClient.get(this.SERVER);
  }
}
