import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-questionbank',
  templateUrl: './questionbank.component.html',
  styleUrls: ['./questionbank.component.less']
})
export class QuestionbankComponent implements OnInit {
	navType: number=4 //1-班级学生；2-班级教师；3-班级作业；4班级题库；5-班级助教；6-班级信息；
  constructor() { }

  ngOnInit() {
  }

}
