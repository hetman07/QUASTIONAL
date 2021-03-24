import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

import * as _moment from 'moment';

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-my-form-question',
  templateUrl: './my-form-question.component.html',
  styleUrls: ['./my-form-question.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class MyFormQuestionComponent implements OnInit {
  questionForm: FormGroup;
  titleAlert: string = 'This field is required';
  post: any = '';
  frameworkVersionList: any = [];

  frameworkList: any = [
    {
      frameworkName: 'angular',
      frameworkVersionList: ['1.1.1', '1.2.1', '1.3.3'],
    },
    {
      frameworkName: 'react',
      frameworkVersionList: ['2.1.2', '3.2.4', '4.3.1'],
    },
    {
      frameworkName: 'vue',
      frameworkVersionList: ['3.3.1', '5.2.1', '5.1.3'],
    },
  ];

  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    this.questionForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      dateOfBirth: [moment(), Validators.required],
      framework: [null, Validators.required],
      frameworkVersion: [null, Validators.required],
      email: [
        null,
        [Validators.required, Validators.email, Validators.pattern(emailregex)],
        this.myAsyncCheckInUseEmail,
      ],
      hobby: this.formBuilder.array([this.getHobby()]),
    });
  }

  private getHobby() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      duration: ['', Validators.required],
    });
  }

  frameworkChangeAction(framework) {
    this.questionForm.get('frameworkVersion').patchValue('');

    let dropDownData = this.frameworkList.find(
      (data: any) => data.frameworkName === framework
    );

    if (dropDownData) {
      this.frameworkVersionList = dropDownData.frameworkVersionList;

      if (this.frameworkVersionList) {
        let data_vers = this.frameworkVersionList[0];
        this.questionForm.get('frameworkVersion').patchValue(data_vers);
      }
    } else {
      this.frameworkVersionList = [];
    }
  }

  myAsyncCheckInUseEmail(conrol) {
    let emailDb = 'test@test.test';
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let result = conrol.value === emailDb ? { alreadyInUse: true } : null;
        return resolve(result);
      }, 3000);
    });
  }

  getErrorEmail() {
    return this.questionForm.get('email').hasError('required')
      ? 'Field is required'
      : this.questionForm.get('email').hasError('pattern')
      ? 'Not a valid emailaddress'
      : this.questionForm.get('email').hasError('alreadyInUse')
      ? 'This email address is already in use'
      : '';
  }

  onAddHobby() {
    const control = <FormArray>this.questionForm.controls['hobby'];
    control.push(this.getHobby());
  }

  removeHobby(i: number) {
    const control = <FormArray>this.questionForm.controls['hobby'];
    control.removeAt(i);
  }

  onSubmit(post) {
    this.post = {
      firstName: post.firstName,
      lastName: post.lastName,
      dateOfBirth: this.datePipe.transform(post.dateOfBirth, 'dd-MM-yyyy'),
      framework: post.framework,
      frameworkVersion: post.frameworkVersion,
      email: post.email,
      hobby: post.hobby,
    };
  }
}
