import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { ArticleService } from "../../services/article.service";
import { AdminService } from "../../services/admin.service";
import { Tag } from "../../models/tag";

@Component({
  selector: "app-tag",
  providers: [ArticleService, AdminService],
  templateUrl: "./tag.component.html",
  styleUrls: ["./tag.component.css"],
})
export class TagComponent implements OnInit {
  public identity;
  public token;
  public tag: Tag;
  public tags;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ArticleService,
    private adminService: AdminService
  ) {
    this.token = this.adminService.getToken();
    this.identity = this.adminService.getIdentity();
    this.tag = new Tag("");
  }

  saveTag(dataTag: any) {
    this.productService.addTag(this.token, this.tag).subscribe(
      (response) => {
        this.getTags();
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }

  getTags() {
    this.productService.getAllTag().subscribe(
      (response) => {
        this.tags = response.tag;
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }

  deleteTag(idTag: any) {
    console.log(idTag);
    this.productService.deleteTag(idTag).subscribe(
      (response) => {
        if (response.status === "Delete success") {
          this.getTags();
        }
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }

  ngOnInit() {
    if (this.identity == null) {
      this.router.navigate(["LoginAdmin"]);
    } else {
      this.adminService.authAdmin(this.identity).subscribe(
        (response) => {
          if (response.status !== "admin") {
            this.router.navigate(["LoginAdmin"]);
          }
          this.getTags();
        },
        (error) => {
          console.log(<any>error);
        }
      );
    }
  }
}
