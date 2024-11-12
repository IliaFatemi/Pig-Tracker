import { Component, Inject, OnInit } from '@angular/core';
import { ApiService } from '../pigTrackerService/api.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialog,MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-status-change',
  templateUrl: './status-change.component.html',
  styleUrls: ['./status-change.component.css']
})
export class StatusChangeComponent implements OnInit{
  hide = true;
  statusForm!:FormGroup
  constructor(private api:ApiService, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data:any, public dialog: MatDialog, public dialogRef: MatDialogRef<StatusChangeComponent>){}
  ngOnInit(): void {
    this.statusForm = this.formBuilder.group({
      password:['', Validators.required]
    })
  }

  validatePass(){
    if(this.statusForm.valid){
      console.log(this.statusForm.value.password)
      this.api.verify_password(this.statusForm.value.password).subscribe((data:any)=>{
        if (data.Digest == '84892b91ef3bf9d216bbc6e88d74a77c'){
          this.data.data.status = "RETRIEVED"
          this.api.changeData(this.data).subscribe(res=>({}))
          alert("SUCCESS: Pig retrieved ")
          this.dialogRef.close()
        }else{
          alert("INCORRECT PASSWORD: Dialog terminated")
        }
      })
    }else{
      alert("FIELD CANNOT BE EMPTY")
    }
  } 
}
