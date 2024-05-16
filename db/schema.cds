using {managed} from '@sap/cds/common';

namespace app.req;


entity fieldTable : managed {

    key id        : Integer;
    key fieldName : String;
        fieldDesc : String;

}

entity formMaster : managed {

    key id       : Integer;
    key formName : String;
        formDesc : String;

}

entity formFieldTable {
    key id           : Integer;
        checkedField : Boolean;
    key formType     : String;
        formDesc     : String;
    key paraName     : String;
        paraDesc     : String;
}

entity raisedRequest : managed {
    key id          : Integer;
    key userName    : String;
        email       : String;
        phoneNo     : String;
        department  : String;
    key formType    : String;
        requestedAt : String;
        fromDate    : String;
        toDate      : String;
        assetType   : String;
        action      : Boolean;
        status      : Boolean;
        reason      : String;
}
