export class CardData
{
    idNumber:String;
    cardNumber:String;
    cardHolderPhoto:String;
    holderSignatureImage:String;
    modifiablePublicData:ModifiablePublicData;
    nonModifiablePublicData:NonModifiablePublicData;
    homeAddress:HomeAddress;
    workAddress:WorkAddress;
}


export class ModifiablePublicData{
    occupationCode:number;
    occupationArabic:String;
    occupationEnglish:String;
    familyID:String;
    occupationTypeArabic:String;
    occupationTypeEnglish:String;
    occupationFieldCode:String ;
    companyNameArabic:String ;
    companyNameEnglish:String;
    maritalStatusCode:String;
    husbandIDN:String;
    sponsorTypeCode:String ;
    sponsorUnifiedNumber:String ;
    sponsorName:String ;
    residencyTypeCode:String ;
    residencyNumber:String ;
    residencyExpiryDate:String ;
     passportNumber:String ;
     passportTypeCode:String ;
    passportCountryCode:String ;
    passportCountryDescArabic:String ;
    passportCountryDescEnglish:String ;
    passportIssueDate:String ;
    passportExpiryDate:String ;
    qualificationLevelCode:String ;
    qualificationLevelDescArabic:String ;
    qualificationLevelDescEnglish:String ;
    degreeDescArabic:String ;
    degreeDescEnglish:String ;
    fieldOfStudyArabic:String ;
    fieldOfStudyEnglish:String ;
    placeOfStudyArabic:String ;
    placeOfStudyEnglish:String ;
    dateOfGraduation:String ;
    motherFullNameArabic:String ;
    motherFullNameEnglish:String ;
}

export class NonModifiablePublicData{
    fullNameEnglish:String;
    gender:String;
    nationalityEnglish:String;
    dateOfBirth:String;
    placeOfBirthEnglish:String
}

export class HomeAddress
{
    emiratesCode:String;
    mobilePhoneNumber:String;
    email:String;
    streetEnglish:String;
}

export class WorkAddress{
    emiratesCode:String;
    landPhoneNumber:String;
    email:String;
    streetEnglish:String;
}