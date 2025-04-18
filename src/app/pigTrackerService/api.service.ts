import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private pigStorageKey = 'pigs';
  private numDataKey = 'numData';

  constructor(private http: HttpClient) {}

  postPig(data: any) {
    const pigs = this.getLocalPigs();
    pigs.push(data);
    this.setLocalPigs(pigs);
    return of({ status: 'success' });
  }

  getPig() {
    return of({ body: this.getLocalPigs() });
  }

  changeData(updatedData: any) {
    const pigs = this.getLocalPigs();
    const index = pigs.findIndex((pig: any) => pig.key === updatedData.key);
    if (index !== -1) {
      pigs[index] = updatedData;
      this.setLocalPigs(pigs);
    }
    return of({ status: 'updated' });
  }

  deletePig(data: any) {
    const pigs = this.getLocalPigs().filter((pig: any) => pig.key !== data.key);
    this.setLocalPigs(pigs);
    return of({ status: 'deleted' });
  }

  getNumData() {
    const num = localStorage.getItem(this.numDataKey);
    return of({ body: { data: num ?? '0' } });
  }

  setNumData(data: any) {
    localStorage.setItem(this.numDataKey, data.data);
    return of({ status: 'set' });
  }

  verify_password(enteredPass:string){
    return this.http.get<Object>('https://api.hashify.net/hash/md5/hex?value='+enteredPass)
  }

  private getLocalPigs(): any[] {
    const pigs = localStorage.getItem(this.pigStorageKey);
    return pigs ? JSON.parse(pigs) : [];
  }

  private setLocalPigs(pigs: any[]) {
    localStorage.setItem(this.pigStorageKey, JSON.stringify(pigs));
  }
}
