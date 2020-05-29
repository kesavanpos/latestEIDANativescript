package com.toolkit.readerapplication;

import android.content.Context;
import android.graphics.Bitmap;
import android.nfc.Tag;
import android.text.TextUtils;
import android.util.Base64;
import android.widget.Toast;

import ae.emiratesid.idcard.toolkit.CardReader;
import ae.emiratesid.idcard.toolkit.Toolkit;
import ae.emiratesid.idcard.toolkit.ToolkitException;
import ae.emiratesid.idcard.toolkit.datamodel.CardPublicData;

public class Connector {

    private static CardReader cardReader = null;
    private static Toolkit toolkit = null;

    public static Toolkit initialize(Context ctx) throws ToolkitException {
        if (toolkit == null) {
            try {

                StringBuilder configBuilder = new StringBuilder();
                configBuilder.append("\n" + "config_directory =/storage/emulated/0/EIDAToolkit/");
                configBuilder.append("\n" + "log_directory =/storage/emulated/0/EIDAToolkit/");
                configBuilder.append("\n" + "read_publicdata_offline = true");

                configBuilder.append("\n" + "vg_url =http://172.16.11.13/ValidationGatewayService");

                String pluginDirectorPath = ctx.getApplicationInfo().nativeLibraryDir + "/";
                configBuilder.append("\n" + "plugin_directory_path =" + pluginDirectorPath);
                Logger.d("configBuilder ::" + configBuilder.toString());
                toolkit = new Toolkit(true, configBuilder.toString(), ctx);

                Toast.makeText(ctx,"Toolkit intialized Successfully !",Toast.LENGTH_SHORT).show();

                return toolkit;
            } catch (ToolkitException e) {
                Logger.e("Exception occurred in initializing " + e.getLocalizedMessage());
                throw e;
            }//catch()..
        }
        return toolkit;
    }

    public static CardPublicData GetPublicData(CardReader card,Context ctx) throws ToolkitException{
        CardPublicData publicData;
        Employee emp = new Employee();
        try
        {
            String requestId = RequestGenerator.generateRequestID();
            publicData = card.readPublicData(requestId,true,true,true,true,true);
            String message = "Card Number:" + publicData.getCardNumber() + "Card Id Number:" + publicData.getIdNumber();


            Toast.makeText(ctx,message,Toast.LENGTH_SHORT).show();
            emp.cardNumber = publicData.getCardNumber();
            emp.cardHolderPhoto = publicData.getCardHolderPhoto();
            emp.holderSignatureImage = publicData.getCardHolderPhoto();
            emp.idNumber = publicData.getIdNumber();
            return publicData;
        }
        catch (ToolkitException e)
        {
            throw e;
        }
        catch (Exception e) {
            Logger.e("Exception::Connection failed with handle" + e.getMessage());
            cardReader = null;
            throw e;
        }//catch()
    }

    public static Bitmap displayPhoto(CardPublicData cardPublicData) {
        byte[] photo = Base64.decode(cardPublicData.getCardHolderPhoto(), Base64.DEFAULT);
        return Bitmaps.decodeSampledBitmapFromBytes(photo, 150, 150);
    }

    public static CardReader initConnection(Toolkit tool,Context ctx) throws ToolkitException {

        try {

            Logger.d("Creating a new connection successfully initialized");
            //toolkit.setNfcMode(tag);
//          discover all the readers connected to the system
            CardReader[] cardReaders = tool.listReaders();


            if (cardReaders == null || cardReaders.length == 0) {
                Logger.e("No reader are founded");
                return cardReader;
            }//if()
            Logger.d("list reader successful" + cardReaders.length);

            cardReader = new CardReader(cardReaders[0].getName());
            //Get the first reader.

            Logger.d("list reader successful" + cardReader.getName());
            cardReader.connect();
            String message = "Card Initalized Succesfully !";
            Toast.makeText(ctx,message,Toast.LENGTH_SHORT).show();

            //Logger.d("Connection Success full  " + cardReader.isConnected());
            return cardReader;
        } catch (ToolkitException e) {
            Logger.e("ToolkitException::Connection failed>" + e.getMessage());
            cardReader = null;
            throw e;
        }//catch()
        catch (Exception e) {
            Logger.e("Exception::Connection failed with handle" + e.getMessage());
            cardReader = null;
            throw e;
        }//catch()
        //connection is already exits return the same.

    }

    public Employee GetEmployee()
    {
        Employee emp;
        try
        {
            emp = new Employee();
            emp.FirstName = "Kesavan";
            emp.LastName = "Rajendran";
            emp.Address = "Chennai";

            return  emp;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public void show(Context context) throws Exception {
        try
        {
            CharSequence text ="Hello NativeScript!";
            int duration = Toast.LENGTH_SHORT;

            Toast toast = Toast.makeText(context, text, duration);
            toast.show();
        }
        catch (Exception e)
        {
            throw e;
        }

    }
}
