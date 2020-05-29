import { Component, OnInit } from "@angular/core";
import * as Permissions from "nativescript-permissions";
declare var android: any;

@Component({
    selector: "ns-app",
    templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit { 

    ngOnInit(): void {
        this.getPermission();
    }

    getPermission() {

        let arrayPermissions = [android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
                                android.Manifest.permission.READ_PHONE_STATE,
                                android.Manifest.permission.NFC,
                                android.Manifest.permission.BLUETOOTH_ADMIN,
                                android.Manifest.permission.BLUETOOTH];

        Permissions.requestPermission(arrayPermissions, "WRITE_EXTERNAL_STORAGE for connectivity status").then(() => {
            console.log("WRITE_EXTERNAL_STORAGE granted!");
        }).catch(() => {
            console.log("Permission is not granted (sadface)");
        });
    }
}
