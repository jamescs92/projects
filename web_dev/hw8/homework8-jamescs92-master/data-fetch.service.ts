import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataFetchService {

	url = 'http://localhost:3000/stateseal?state=California';
  	constructor(private httpClient: HttpClient) { }
  
  	public getData(link) 
  	{
    	return this.httpClient.get(link);
  	}
}
