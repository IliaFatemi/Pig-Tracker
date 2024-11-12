import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  baseUrl:string = "https://272.selfip.net/apps/biQd1IY6lS/collections/"
  key:string = "VcFwScmcWqOsi0x8x5zjW3X6Hs1Up5/"
  db:string = 'documents/'
  constructor(private http:HttpClient){}
  
  postPig(data:any){
    return this.http.post<any>("https://272.selfip.net/apps/biQd1IY6lS/collections/VcFwScmcWqOsi0x8x5zjW3X6Hs1Up5/documents/", data); 
  }

  getPig(){
    return this.http.get("https://272.selfip.net/apps/biQd1IY6lS/collections/VcFwScmcWqOsi0x8x5zjW3X6Hs1Up5/documents/", {observe: 'response'})
  }

  changeData(data:any){
    return this.http.put("https://272.selfip.net/apps/biQd1IY6lS/collections/VcFwScmcWqOsi0x8x5zjW3X6Hs1Up5/documents/"+data.key, data)
  }

  getNumData(){
    return this.http.get("https://272.selfip.net/apps/biQd1IY6lS/collections/numDataCreated/documents/"+"numData/", {observe: 'response'})
  }

  setNumData(data:any){
    return this.http.put("https://272.selfip.net/apps/biQd1IY6lS/collections/numDataCreated/documents/"+"numData/", data)
  }

  deletePig(data:any){
    return this.http.delete("https://272.selfip.net/apps/biQd1IY6lS/collections/VcFwScmcWqOsi0x8x5zjW3X6Hs1Up5/documents/"+data.key+"/")
  }

  verify_password(enteredPass:string){
    return this.http.get<Object>('https://api.hashify.net/hash/md5/hex?value='+enteredPass)
  }
}

