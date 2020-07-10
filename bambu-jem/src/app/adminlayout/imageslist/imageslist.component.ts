import { Component, OnInit } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { AdminService } from '../../services/admin.service';
import { ImgUrl } from '../../models/imgUrl';
import 'rxjs/Rx' ;

@Component({
  selector: 'app-imageslist',
  providers: [ImageService, AdminService],
  templateUrl: './imageslist.component.html',
  styleUrls: ['./imageslist.component.css']
})
export class ImageslistComponent implements OnInit {

  public token;
  public identity;
  public listImage;
  public imgUrl = ImgUrl;
  public p;
  public arrayDownload = [];

  constructor(private imageService: ImageService, private adminService: AdminService) {
    this.token = this.adminService.getToken();
    this.identity = this.adminService.getIdentity();
  }

  getAllImages() {
    this.imageService.getAllImages().subscribe(
      response => {
        this.listImage = response.imagesP;
        this.addPhotoList();
      }, error => {
        console.log(<any> error);
      }
    );
  }

  addPhotoList() {
    for (let i = 0; i < this.listImage.length; ++i) {
      this.listImage[i].photo = this.imgUrl.url + this.listImage[i].photo;
    }
  }

  addToDownload(image: any) {
    this.arrayDownload.push(image);
  }

  download() {
    console.log(this.arrayDownload);
    for (let index = 0; index < this.arrayDownload.length; index++) {
      const array = this.arrayDownload[index].photo.split('/');
      this.imageService.downloadImage(array[5]).subscribe(
        response => {
          const blob = 'data:image/jpeg;base64,' + response.download;
          this.downloadFile(blob, array[5]);
        }, error => {
          console.log(<any> error);
        }
      );
    }
  }

  downloadFile(data, fileName) {
    let a: any = document.createElement('a');
    a.href = data;
    a.download = fileName;
    document.body.appendChild(a);
    a.style = 'display: none';
    a.click();
    a.remove();
    this.arrayDownload = [];
  }

  ngOnInit(): void {
    this.getAllImages();
  }

}
