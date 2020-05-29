package com.toolkit.readerapplication;

import android.util.Base64;

import java.security.SecureRandom;

public class RequestGenerator {

    private static SecureRandom secureRandom = new SecureRandom();

    public static String generateRequestID() {

        byte[] rndBytes = new byte[40];
        secureRandom.nextBytes(rndBytes);
        Logger.d("length of random bytes " + rndBytes.length);
        String requestId = Base64.encodeToString(rndBytes, Base64.NO_WRAP);
        Logger.d("length of generated string " +
                requestId.length());
        return requestId;
//		return "jhN8uvfCapB1dmqKGAVoND38n7sbK1lRXAOOsFN7Tvpde7W5+AK9zg==";
    }

}
