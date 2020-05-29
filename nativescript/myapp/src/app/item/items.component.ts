import { Component, OnInit } from "@angular/core";
import { Nfc, NfcTagData, NfcNdefData } from "nativescript-nfc";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as application from 'tns-core-modules/application';
import { parseString } from 'nativescript-xml2js';
declare var ae:any;
declare var com:any;

import { CardData,ModifiablePublicData,NonModifiablePublicData,HomeAddress,WorkAddress } from "../models/CardData"

declare var android:any;
import {  AndroidApplication, AndroidActivityBundleEventData,
     AndroidActivityEventData } from "tns-core-modules/application";

import { Item } from "./item";
import { ItemService } from "./item.service";
import { ImageSource } from "tns-core-modules/image-source";
//import BitmapFactory = require("nativescript-bitmap-factory");

@Component({
    selector: "ns-items",
    templateUrl: "./items.component.html"
})
export class ItemsComponent implements OnInit {
    items: Array<Item>;
    private nfc: Nfc;
    publicData:any;
    toolkit:any;
    cardReader:any;
    tag : any;
    cardData:CardData;
    private _imageSource: ImageSource;
    

    base64:string ='data:image/jpeg;base64,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';

    constructor(private itemService: ItemService) {
        this.nfc = new Nfc();       
       // this.cardHolderImage =  this.base64;
        this.checksign= true;
        application.android.on("newintent", (args) => {
            android.widget.Toast.makeText(this, "newintent nativescript", android.widget.Toast.LENGTH_SHORT).show();         
        });

       application.android.on(AndroidApplication.activityResumedEvent, (args: AndroidActivityEventData) => {
            // Does log
            console.log("Event: " + args.eventName + ", Activity: " + args.activity);
            let intent = (args.activity).getIntent();
            console.log("intent value -> " + intent);

            let extras = intent.getExtras();
            if(extras) {
                let extras = args.activity.getIntent().getExtras(); 
            }

            if (!this.nfc) {
                // Gets executed once
                this.nfc = new Nfc();

                // Does log
                this.nfc.available().then((avail) => console.log("NFC is " + (avail ? '' : 'not ') + 'available'));
                // Does log
                this.nfc.enabled().then((isOn) => console.log("NFC is " + (isOn ? '' : 'not ') + 'on'));

                this.nfc.setOnTagDiscoveredListener((data: NfcTagData) => {
                    // Does NOT log
                    this.tag = data;
                    dialogs.alert("setOnNdefDiscoveredListener" +  data).then(()=> {
                        console.log("Dialog closed!");
                    });
                    console.log("Discovered a tag with ID " + data.id);
                }).then(() => {
                    // Does Log
                    console.log("OnTagDiscovered listener added");
                });

                this.nfc.setOnNdefDiscoveredListener((data: NfcNdefData) => {
                    // Does NOT log
                    this.tag = data;
                    dialogs.alert("setOnNdefDiscoveredListener" +  data).then(()=> {
                        console.log("Dialog closed!");
                    });
                    console.log("Discovered a tag with ID " + data.id);
                }).then(() => {
                    // Does log
                    console.log("OnNdef listener added");
                });
            }
        });
     }

    ngOnInit(): void {
       this.items = this.itemService.getItems();
    }

  

   generateRequestID() {          
       try
       {
        let byteArr = Array.create("byte", 40);
        var secureRandom = new java.security.SecureRandom();
        secureRandom.nextBytes(byteArr);       
        let requestId = android.util.Base64.encodeToString(byteArr, android.util.Base64.NO_WRAP);

        dialogs.alert("generateRequestID success : " +  requestId).then(()=> {
            console.log("Dialog closed!");
        });
        
        return requestId;
       }      
       catch(e)
       {
        dialogs.alert("generateRequestID Error " +  e.message).then(()=> {
            console.log("Dialog closed!");
        });
        return "jhN8uvfCapB1dmqKGAVoND38n7sbK1lRXAOOsFN7Tvpde7W5+AK9zg==";
       }
    }

    ShowData(event)
    {
        try
        {
            let test = new com.toolkit.readerapplication.Connector();
            let emp = test.GetEmployee();

            dialogs.alert("ShowData" +  emp).then(()=> {
                console.log("Dialog closed!");
            });

            dialogs.alert("ShowData FirstName" +  emp.FirstName).then(()=> {
                console.log("Dialog closed!");
            });
        }
        catch(e)
        {
            dialogs.alert("ShowData Error" +  e.message).then(()=> {
                console.log("Dialog closed!");
            });
        }
    }

    cardholderimage : any;
    cardHolderImage : any;
    checksign:boolean=false;
    ShowPublicData(event){

        if(this.toolkit != null && this.cardReader != null)
        {
            try
            {
    
                this.publicData = com.toolkit.readerapplication.Connector.GetPublicData
                (this.cardReader,application.android.context);            
               
                this.items=[];

                this.AddItems("CardNumber",this.publicData.getCardNumber());
                this.AddItems("IdNumber",this.publicData.getIdNumber());

                this.checksign =true;

                var bitMap = com.toolkit.readerapplication.Connector.displayPhoto(this.publicData);

                
                // var photo = android.Base64.decode(this.publicData.getCardHolderPhoto(), android.Base64.DEFAULT);
                // let loadedSource64 = this._imageSource.fromData(photo);                
                // if (loadedSource64 ) {                    
                //     this.cardHolderImage = this._imageSource;
                // }                

                // this.cardholderimage = ImageSource.fromData(photo);
                this._imageSource = new ImageSource();   
                this._imageSource.setNativeSource(bitMap);

                this.cardHolderImage = this._imageSource;
                

                this.AddItems("---------------------------","");
                this.AddItems("ModificableData","");
                this.GetModData();
                this.AddItems("---------------------------","");
                this.AddItems("ModificableData","");
                this.AddItems("---------------------------","");
                this.AddItems("NonModificableData","");
                this.GetNonModData();
                this.AddItems("NonModificableData","");
                this.AddItems("---------------------------","");
                this.AddItems("HomeAddress","");
                this.AddItems("---------------------------","");
                this.GetHomeAddress();
                this.AddItems("HomeAddress","");
                this.AddItems("---------------------------","");
                this.AddItems("GetWorkAddress","");
                this.AddItems("---------------------------","");
                this.GetWorkAddress();
                this.AddItems("GetWorkAddress","");
                this.AddItems("---------------------------","");
    
                dialogs.alert("Records Retrieved Successfully !").then(()=> {
                    console.log("Dialog closed!");
                });
            }
            catch(e)
            {
                dialogs.alert("ShowPublicData Error " +  e.message).then(()=> {
                    console.log("Dialog closed!");
                });
            }
        }
        else if(this.toolkit == null)
        {
            dialogs.alert("Toolkit is null").then(()=> {
                console.log("Dialog closed!");
            });
        }
        else if(this.cardReader == null)
        {
            dialogs.alert("CardReader is null").then(()=> {
                console.log("Dialog closed!");
            });
        }
    }

    AddItems(Entity,EntityValue)
    {
        try
        {
            if(EntityValue != null && EntityValue != undefined)
            this.items.push(
                {
                    id:this.items.length + 1,
                    name:Entity,
                    role:EntityValue
                });
        }
        catch(e)
        {

        }
        
    }

    GetWorkAddress()
    {
        this.AddItems("AddressTypeCode",this.publicData.getWorkAddress().getAddressTypeCode());
        this.AddItems("LocationCode",this.publicData.getWorkAddress().getLocationCode());
        this.AddItems("CompanyNameArabic",this.publicData.getWorkAddress().getCompanyNameArabic());
        this.AddItems("CompanyNameEnglish",this.publicData.getWorkAddress().getCompanyNameEnglish());
        this.AddItems("EmiratesCode",this.publicData.getWorkAddress().getEmiratesCode());
        this.AddItems("EmiratesDescArabic",this.publicData.getWorkAddress().getEmiratesDescArabic());
        this.AddItems("EmiratesDescEnglish",this.publicData.getWorkAddress().getEmiratesDescEnglish());
        this.AddItems("CityCode",this.publicData.getWorkAddress().getCityCode());
        this.AddItems("CityDescArabic",this.publicData.getWorkAddress().getCityDescArabic());
        this.AddItems("CityDescEnglish",this.publicData.getWorkAddress().getCityDescEnglish());
        this.AddItems("POBOX",this.publicData.getWorkAddress().getPOBOX());
        this.AddItems("StreetArabic",this.publicData.getWorkAddress().getStreetArabic());

        this.AddItems("AreaCode",this.publicData.getWorkAddress().getAreaCode());
        this.AddItems("StreetEnglish",this.publicData.getWorkAddress().getStreetEnglish());
        this.AddItems("AreaCode",this.publicData.getWorkAddress().getAreaCode());
        this.AddItems("AreaDescArabic",this.publicData.getWorkAddress().getAreaDescArabic());

        this.AddItems("AreaDescEnglish",this.publicData.getWorkAddress().getAreaDescEnglish());
        this.AddItems("BuildingNameArabic",this.publicData.getWorkAddress().getBuildingNameArabic());
        this.AddItems("BuildingNameEnglish",this.publicData.getWorkAddress().getBuildingNameEnglish());
        this.AddItems("LandPhoneNumber",this.publicData.getWorkAddress().getLandPhoneNumber());

        this.AddItems("MobilePhoneNumber",this.publicData.getWorkAddress().getMobilePhoneNumber());
        this.AddItems("Email",this.publicData.getWorkAddress().getEmail());
    }

    GetHomeAddress()
    {
        this.AddItems("AddressTypeCode",this.publicData.getHomeAddress().getAddressTypeCode());
        this.AddItems("LocationCode",this.publicData.getHomeAddress().getLocationCode());
        this.AddItems("EmiratesCode",this.publicData.getHomeAddress().getEmiratesCode());

        this.AddItems("EmiratesDescArabic",this.publicData.getHomeAddress().getEmiratesDescArabic());
        this.AddItems("EmiratesDescEnglish",this.publicData.getHomeAddress().getEmiratesDescEnglish());
        this.AddItems("CityCode",this.publicData.getHomeAddress().getCityCode());

        this.AddItems("CityDescArabic",this.publicData.getHomeAddress().getCityDescArabic());
        this.AddItems("CityDescEnglish",this.publicData.getHomeAddress().getCityDescEnglish());
        this.AddItems("StreetArabic",this.publicData.getHomeAddress().getStreetArabic());

        this.AddItems("StreetEnglish",this.publicData.getHomeAddress().getStreetEnglish());
        this.AddItems("POBOX",this.publicData.getHomeAddress().getPOBOX());
        this.AddItems("AreaCode",this.publicData.getHomeAddress().getAreaCode());

        this.AddItems("AreaDescArabic",this.publicData.getHomeAddress().getAreaDescArabic());
        this.AddItems("AreaDescEnglish",this.publicData.getHomeAddress().getAreaDescEnglish());
        this.AddItems("BuildingNameArabic",this.publicData.getHomeAddress().getBuildingNameArabic());

        this.AddItems("BuildingNameEnglish",this.publicData.getHomeAddress().getBuildingNameEnglish());
        this.AddItems("FlatNo",this.publicData.getHomeAddress().getFlatNo());
        this.AddItems("ResidentPhoneNumber",this.publicData.getHomeAddress().getResidentPhoneNumber());

        this.AddItems("MobilePhoneNumber",this.publicData.getHomeAddress().getMobilePhoneNumber());
        this.AddItems("Email",this.publicData.getHomeAddress().getEmail());
        
    }

    GetNonModData()
    {
        this.AddItems("IDType",this.publicData.getNonModifiablePublicData().getIDType());
        this.AddItems("IssueDate",this.publicData.getNonModifiablePublicData().getIssueDate());
        this.AddItems("ExpiryDate",this.publicData.getNonModifiablePublicData().getExpiryDate());
        this.AddItems("DateofBirth",this.publicData.getNonModifiablePublicData().getDateOfBirth());

        this.AddItems("TitleArabic",this.publicData.getNonModifiablePublicData().getTitleArabic());
        this.AddItems("FullNameArabic",this.publicData.getNonModifiablePublicData().getFullNameArabic());
        this.AddItems("TitleEnglish",this.publicData.getNonModifiablePublicData().getTitleEnglish());
        this.AddItems("FullNameEnglish",this.publicData.getNonModifiablePublicData().getFullNameEnglish());

        this.AddItems("Gender",this.publicData.getNonModifiablePublicData().getGender());
        this.AddItems("NationalityArabic",this.publicData.getNonModifiablePublicData().getNationalityArabic());
        this.AddItems("NationalityEnglish",this.publicData.getNonModifiablePublicData().getNationalityEnglish());

        this.AddItems("NationalityCode",this.publicData.getNonModifiablePublicData().getNationalityCode());
        this.AddItems("PlaceOfBirthArabic",this.publicData.getNonModifiablePublicData().getPlaceOfBirthArabic());
        this.AddItems("PlaceOfBirthEnglish",this.publicData.getNonModifiablePublicData().getPlaceOfBirthEnglish());
    }

    GetModData()
    {

        this.AddItems("OccupationCode",this.publicData.getModifiablePublicData().getOccupationCode());
        this.AddItems("OccupationArabic",this.publicData.getModifiablePublicData().getOccupationArabic());        
        this.AddItems("companyNameEnglish",this.publicData.getModifiablePublicData().getCompanyNameEnglish());        

        this.AddItems("occupationEnglish",this.publicData.getModifiablePublicData().getOccupationEnglish());
        this.AddItems("familyID",this.publicData.getModifiablePublicData().getFamilyID());
        this.AddItems("occupationTypeArabic",this.publicData.getModifiablePublicData().getOccupationTypeArabic());
        this.AddItems("occupationTypeEnglish",this.publicData.getModifiablePublicData().getOccupationTypeEnglish());

        this.AddItems("occupationFieldCode",this.publicData.getModifiablePublicData().getOccupationFieldCode());
        this.AddItems("companyNameArabic",this.publicData.getModifiablePublicData().getCompanyNameArabic());
        
        this.AddItems("occupationTypeArabic",this.publicData.getModifiablePublicData().getOccupationTypeArabic());
        this.AddItems("maritalStatusCode",this.publicData.getModifiablePublicData().getMaritalStatusCode());

        this.AddItems("husbandIDN",this.publicData.getModifiablePublicData().getHusbandIDN());
        this.AddItems("sponsorTypeCode",this.publicData.getModifiablePublicData().getSponsorTypeCode());
        this.AddItems("sponsorUnifiedNumber",this.publicData.getModifiablePublicData().getSponsorUnifiedNumber());
        this.AddItems("maritalStatusCode",this.publicData.getModifiablePublicData().getMaritalStatusCode());

        this.AddItems("sponsorName",this.publicData.getModifiablePublicData().getSponsorName());
        this.AddItems("residencyTypeCode",this.publicData.getModifiablePublicData().getResidencyTypeCode());
        this.AddItems("residencyNumber",this.publicData.getModifiablePublicData().getResidencyNumber());
        this.AddItems("residencyExpiryDate",this.publicData.getModifiablePublicData().getResidencyExpiryDate());

        this.AddItems("passportNumber",this.publicData.getModifiablePublicData().getPassportNumber());
        this.AddItems("passportTypeCode",this.publicData.getModifiablePublicData().getPassportTypeCode());
        this.AddItems("passportCountryCode",this.publicData.getModifiablePublicData().getPassportCountryCode());
        this.AddItems("passportCountryDescArabic",this.publicData.getModifiablePublicData().getPassportCountryDescArabic());
                
        this.AddItems("passportCountryDescEnglish",this.publicData.getModifiablePublicData().getPassportNumber());
        this.AddItems("PassportIssueDate",this.publicData.getModifiablePublicData().getPassportIssueDate());
        this.AddItems("PassportExpiryDate",this.publicData.getModifiablePublicData().getPassportExpiryDate());
        this.AddItems("QualificationLevelCode",this.publicData.getModifiablePublicData().getQualificationLevelCode());
                
        this.AddItems("QualificationLevelDescArabic",this.publicData.getModifiablePublicData().getQualificationLevelDescArabic());
        this.AddItems("QualificationLevelDescEnglish",this.publicData.getModifiablePublicData().getQualificationLevelDescEnglish());
        this.AddItems("DegreeDescArabic",this.publicData.getModifiablePublicData().getDegreeDescArabic());
        this.AddItems("DegreeDescEnglish",this.publicData.getModifiablePublicData().getDegreeDescEnglish());
                
        this.AddItems("DegreeDescEnglish",this.publicData.getModifiablePublicData().getDegreeDescEnglish());
        this.AddItems("FieldOfStudyArabic",this.publicData.getModifiablePublicData().getFieldOfStudyArabic());
        this.AddItems("FieldOfStudyEnglish",this.publicData.getModifiablePublicData().getFieldOfStudyEnglish());
        this.AddItems("PlaceOfStudyArabic",this.publicData.getModifiablePublicData().getPlaceOfStudyArabic());

        this.AddItems("DateOfGraduation",this.publicData.getModifiablePublicData().getDateOfGraduation());
        this.AddItems("MotherFullNameArabic",this.publicData.getModifiablePublicData().getMotherFullNameArabic());
        this.AddItems("MotherFullNameEnglish",this.publicData.getModifiablePublicData().getMotherFullNameEnglish());
        this.AddItems("FieldOfStudyCode",this.publicData.getModifiablePublicData().getFieldOfStudyCode());
    }

    onTap(event)
    {
        var context = application.android.context;   
        //let env = android.os.Environment.getExternalStorageDirectory().getAbsolutePath() + "/EIDAToolkit/";        
        var pluginDirectorPath = context.getApplicationInfo().nativeLibraryDir + "/";
        var configParams = '\n';		
        configParams += 'config_directory =/storage/emulated/0/EIDAToolkit/' ;
        configParams += '\n';
        configParams += 'log_directory =/storage/emulated/0/EIDAToolkit/';
        configParams += '\n';
        configParams +=  'read_publicdata_offline = true';
        configParams += '\n';        
        configParams += 'vg_url = http://172.16.11.13/ValidationGatewayService';
        configParams += '\n';        
        configParams += 'plugin_directory_path ='+pluginDirectorPath;        
        
        try{            
            this.toolkit = com.toolkit.readerapplication.Connector.initialize(application.android.context);
        }
        catch(e)
        {
            dialogs.alert("Got Toolkit Error " +  e.message).then(()=> {
                console.log("Dialog closed!");
            }); 
        }        
    }

    ConnectNS(event)
    {
        try
        {
            let conn = new com.toolkit.readerapplication.Connector();
            conn.show(application.android.context);
        }
        catch(e)
        {
            dialogs.alert("ConnectNS :" + e.message).then(()=> {
                console.log("Dialog closed!");
            }); 
        }
    }

    public doCheckAvailable(event) {
        this.nfc.available().then((avail) => {
          console.log("Available? " + avail);
          dialogs.alert("NFC CheckAvailable :" + avail).then(()=> {
            console.log("Dialog closed!");
        }); 
        }, (err) => {
            dialogs.alert("doCheckAvailable :" + err).then(()=> {
                console.log("Dialog closed!");
            }); 
        });
      }
    
      public doCheckEnabled(event) {
        this.nfc.enabled().then((on) => {
            dialogs.alert("NFC CheckEnabled :" + on).then(()=> {
                console.log("Dialog closed!");
            });           
        }, (err) => {
          alert(err);
        });
      }

      onShowTag(event)
      {
          try
          {
            this.doStartTagListener();
          }
          catch(e)
          {
            dialogs.alert("onShowTag Error :" + e.message).then(()=> {
                console.log("Dialog closed!");
            });  
          }
      }

      ConnectReader(event)
      {
          if(this.toolkit != null)
          {
            try
            {
              this.cardReader = com.toolkit.readerapplication.Connector.initConnection(this.toolkit,application.android.context);
            }
            catch(e)
            {
              dialogs.alert("ConnectReader Error :" + e.message).then(()=> {
                  console.log("Dialog closed!");
              });  
            }
          }
          else
          {
            dialogs.alert("Toolkit is null").then(()=> {
                console.log("Dialog closed!");
            });  
          }
      }
    
      public doStartTagListener() {
        let that = this;
        this.nfc.setOnTagDiscoveredListener((data: NfcTagData) => {
        this.tag = data;
          dialogs.alert("Your tag :" + data.id).then(()=> {
            console.log("Dialog closed!");
        }); 
        }).then(() => {
          console.log("OnTagDiscovered Listener set");
        }, (err) => {
          console.log(err);
        });
      }
}
