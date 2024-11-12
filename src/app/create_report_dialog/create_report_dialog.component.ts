import { Component, Inject, OnInit } from '@angular/core';
import { ApiService } from '../pigTrackerService/api.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


let LISTED_LOCATIONS:any = {
  "North Vancouver":[49.3200, -123.0724],
  "West Vancouver":[49.3286, -123.1602],
  "Burnaby":[49.2488, -122.9805],
  "Vancouver":[49.2827, -123.1207],
  "New York":[40.7128, -74.0060],
  "Alberta":[53.9333, -116.5765],
  "Edmonton":[53.5461, -113.4937],
  "Coquitlam":[49.2838, -122.7932]
}

@Component({
  selector: 'app-create_report_dialog',
  templateUrl: './create_report_dialog.component.html',
  styleUrls: ['./create_report_dialog.component.css']
})


export class DialogComponent implements OnInit{

  pigForm!:FormGroup;
  date:Date = new Date();
  isChecked = true

  constructor(private formBuilder: FormBuilder, private api:ApiService, private dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) data:any){}

  ngOnInit(): void {
    if(this.isChecked){
      this.pigForm = this.formBuilder.group({
        
        name:['', Validators.required],
        phone:['', Validators.required],
        pid:['', Validators.required],
        latitude:[''],
        longitude:[''],
        location:['', Validators.required],
        status:['READY FOR PICKUP'],
        breed:['', Validators.required],
        notes:['', Validators.required],
        time:[`${this.date.getFullYear().toString()}-${this.date.getMonth().toString()}-${this.date.getDay().toString()} (${this.date.getHours().toString()}:${this.date.getMinutes().toString()})`]
      })
    }else{
      this.pigForm = this.formBuilder.group({
        
        name:['', Validators.required],
        phone:['', Validators.required],
        pid:['', Validators.required],
        latitude:['', Validators.required],
        longitude:['', Validators.required],
        location:['', Validators.required],
        status:['READY FOR PICKUP'],
        breed:['', Validators.required],
        notes:['', Validators.required],
        time:[`${this.date.getFullYear().toString()}-${this.date.getMonth().toString()}-${this.date.getDay().toString()} (${this.date.getHours().toString()}:${this.date.getMinutes().toString()})`]
      })
    }
  }

  addPig(){
    // console.log(this.isChecked)
    if(this.pigForm.valid){
      if(this.fieldIsValid()){
        if(this.isChecked){
          for(var key in LISTED_LOCATIONS){
            if(JSON.stringify(key.toString()) == JSON.stringify(this.pigForm.value.location).toString()){
              this.pigForm.value.latitude = LISTED_LOCATIONS[key][0]
              this.pigForm.value.longitude = LISTED_LOCATIONS[key][1]
            }
          }
        }
        var numData:number;
        var dataWithKey; 
        this.api.getNumData().subscribe(resp =>{
          numData = parseInt(JSON.parse(JSON.stringify(resp.body)).data)
          numData++;
          dataWithKey = JSON.parse(JSON.stringify({key:numData.toString()}))
          dataWithKey.data = this.pigForm.value
    
          //Post data
          this.api.postPig(dataWithKey).subscribe(resp=>{})
          //set the new number of data
          this.api.setNumData({"key": "numData","data": numData.toString()}).subscribe(resp=>{})
          this.dialogRef.close(dataWithKey);
        })
      }
    }else{
      alert("REQUIRED FIELDS CANNOT BE EMPTY")
    }
  }

  fieldIsValid(): boolean{
    if(this.isNumeric(this.pigForm.value.name)){
      alert("Name must only contain characters")
      return false
    }else if(isNaN(parseFloat(this.pigForm.value.phone))){
      alert("Telephone must contain only number.")
      return false
    }else if(isNaN(parseFloat(this.pigForm.value.pid))){
      alert("PID must be a number")
      return false
    }else if(this.isNumeric(this.pigForm.value.location)){
      alert("location must contain only characters")
      return false
    }else if(!this.isChecked){
      if((isNaN(parseFloat(this.pigForm.value.latitude)) || isNaN(parseFloat(this.pigForm.value.longitude)) && this.isChecked)){
        alert("Latitude and Longitude must be numbers.")
        return false
      }
    }
    return true
  }

  isNumeric(n:any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  cancel(){
    this.dialogRef.close();
  }
}