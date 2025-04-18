import { Component, Inject, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../pigTrackerService/api.service';
@Component({
  selector: 'app_delete_report-dialog',
  templateUrl: './delete-report-dialog.component.html',
  styleUrls: ['./delete-report-dialog.component.css']
})

export class DeleteReportDialogComponent implements OnInit{
  passwordForm!:FormGroup
  hide = true
  constructor(private api:ApiService, @Inject(MAT_DIALOG_DATA) public data:any, public dialog: MatDialog, private formBuilder: FormBuilder, public dialogRef: MatDialogRef<DeleteReportDialogComponent>){}

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      password:['', Validators.required]
    })
  }

  validatePass(){
    console.log(this.data.data.location)
    if(this.passwordForm.valid){
      console.log(this.passwordForm.value.password)
      this.api.verify_password(this.passwordForm.value.password).subscribe((data:any)=>{
        if (data.Digest == '9731e89f01c1fb943cf0baa6772d2875'){
          this.api.deletePig(this.data).subscribe(res=>({}))
          this.dialogRef.close()
        }else{
          alert("INCORRECT PASSWORD")
        }
      })
    }else{
      alert("FIELD CANNOT BE EMPTY")
    }
  }

}
