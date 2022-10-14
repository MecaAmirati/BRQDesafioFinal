import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AdminServiceService } from 'src/app/service/admin-service/admin-service.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  adm:boolean=true;
  constructor(
    public router: Router,
    private admService: AdminServiceService
    ) { }

  ngOnInit(): void {
  //variavel para ver se o usuario é adm ou não
    this.admService.GetAdmin().subscribe(Dadoadm=>{
      this.adm=Dadoadm
    })
  }
  Sair(){
    this.admService.Clear()
  }
}
