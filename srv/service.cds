using {app.req} from '../db/schema';


service hanaservices {

    entity fieldTable     as projection on req.fieldTable;
    entity formFieldTable as projection on req.formFieldTable;
    entity formMaster     as projection on req.formMaster;
    entity raisedRequest  as projection on req.raisedRequest;

}

