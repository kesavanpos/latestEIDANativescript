import {setActivityCallbacks, AndroidActivityCallbacks} from "tns-core-modules/ui/frame";
import * as application from "tns-core-modules/application";
import { nfcIntentHandler } from "../app/nfc.android";

@JavaProxy("com.tns.NativeScriptNfcActivity")
class Activity extends androidx.appcompat.app.AppCompatActivity {
    public isNativeScriptActivity;
    ndef:any;
    tech:any;
    techListsArray:any;
    mIntentFilters:any;
    private _callbacks: AndroidActivityCallbacks;    

    public onCreate(savedInstanceState: android.os.Bundle): void {
        // Set the isNativeScriptActivity in onCreate (as done in the original NativeScript activity code)
        // The JS constructor might not be called because the activity is created from Android.
        this.isNativeScriptActivity = true;
        if (!this._callbacks) {
            setActivityCallbacks(this);
        }

          let adapter = android.nfc.NfcAdapter.getDefaultAdapter( this );

          if (null == adapter) {
            android.widget.Toast.makeText(this, "NFC Adapter Not Found",  android.widget.Toast.LENGTH_SHORT).show();            
         }//if()
         else
         {
          android.widget.Toast.makeText(this, "NFC Adapter Found",  android.widget.Toast.LENGTH_SHORT).show();            
         }

            // if ( null != adapter ) {
               
            //     this.ndef = new android.content.IntentFilter( android.nfc.NfcAdapter.ACTION_TAG_DISCOVERED );
            //     this.tech = new android.content.IntentFilter( android.nfc.NfcAdapter.ACTION_TECH_DISCOVERED );
            //     //let mIntentFilters = new android.content.IntentFilter[]{ ndef,  tech };
            //     let mIntentFilters = Array.create("[android.content.IntentFilter",2);
            //     mIntentFilters.push(this.ndef);
            //     mIntentFilters.push(this.tech);

            //     let arrNfcAdapter = Array.create(java.lang.String, 1);
            //     arrNfcAdapter.push(android.nfc.tech.NfcF.class.getName());

            //     let techlist = Array.create("[Ijava.lang.String;", 1);
            //     techlist.push(arrNfcAdapter);

            //     this.techListsArray = techlist;
            // }
        //android.widget.Toast.makeText(this, "onCreate", android.widget.Toast.LENGTH_SHORT).show();
        
        this._callbacks.onCreate(this, savedInstanceState, this.getIntent(), super.onCreate);
    }

    public onSaveInstanceState(outState: android.os.Bundle): void {
      android.widget.Toast.makeText(this, "onSaveInstanceState", android.widget.Toast.LENGTH_SHORT).show();         
        this._callbacks.onSaveInstanceState(this, outState, super.onSaveInstanceState);
      }
    
      public onStart(): void {
        this._callbacks.onStart(this, super.onStart);
      }
    
      public onStop(): void {
        this._callbacks.onStop(this, super.onStop);
      }
    
      public onDestroy(): void {
        this._callbacks.onDestroy(this, super.onDestroy);
      }
    
      public onBackPressed(): void {
        this._callbacks.onBackPressed(this, super.onBackPressed);
      }
    
      public onRequestPermissionsResult(requestCode: number, permissions: any, grantResults: any): void {
        this._callbacks.onRequestPermissionsResult(this, requestCode, permissions, grantResults, undefined /*TODO: Enable if needed*/);
      }
    
      public onActivityResult(requestCode: number, resultCode: number, data: android.content.Intent): void {
        this._callbacks.onActivityResult(this, requestCode, resultCode, data, super.onActivityResult);
      }
    
      public onNewIntent(intent: android.content.Intent): void {
        android.widget.Toast.makeText(this, "onNewIntent Testing", android.widget.Toast.LENGTH_SHORT).show();         
        super.onNewIntent(intent);        
        
        const activity = application.android.foregroundActivity || application.android.startActivity;
        if (activity) {
           android.widget.Toast.makeText(this, "Your device don't support NFC", android.widget.Toast.LENGTH_SHORT).show();         

          activity.setIntent(intent);
          nfcIntentHandler.savedIntent = intent;
          nfcIntentHandler.parseMessage();
        }
      }
}