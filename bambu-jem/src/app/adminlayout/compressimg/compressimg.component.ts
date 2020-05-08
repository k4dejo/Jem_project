import { Component, OnInit } from '@angular/core';
import {NgxImageCompressService} from 'ngx-image-compress';

@Component({
  selector: 'app-compressimg',
  templateUrl: './compressimg.component.html',
  styleUrls: ['./compressimg.component.css']
})
export class CompressimgComponent implements OnInit {

  imgResultBeforeCompress:string;
  imgResultAfterCompress:string;
  public sizeBeforeCompress;
  public sizeAfterCompress;

  constructor(private imageCompress: NgxImageCompressService) {}

  compressFile() {
    this.imageCompress.uploadFile().then(({image, orientation}) => {
      this.imgResultBeforeCompress = image;
      this.sizeBeforeCompress = this.formatBytes(this.imageCompress.byteCount(image))
      //console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
      this.imageCompress.compressFile(image, orientation, 75, 50).then(
        result => {
          this.imgResultAfterCompress = result;
          //console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
          this.sizeAfterCompress = this.formatBytes(this.imageCompress.byteCount(result));
        }
      );
    });
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
 }

  ngOnInit(): void {
  }

}
