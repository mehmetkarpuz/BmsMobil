import TokenRequestModel from './tokenRequestModel'

export default class AddWehicleImageRequestModel extends TokenRequestModel {
    startEndDocumentType = "";
    fileLocationType = "";
    startDate = "";
    endDate = "";
    force = "false";
    ID = "";
    sigortaID = "";
    plaka = "";
    entryID = "";
    isDateRequired = "";
    image = {};
}