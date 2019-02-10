import TokenRequestModel from './tokenRequestModel'

export default class PuantajAtaRequestModel extends TokenRequestModel {
    GuzergahId = 0;
    AracId = "";
    DagitmaToplama = "";
    MusteriFiyatiId = 0;
    TaseronFiyatiId = 0
    Time = "";
    Tarih = new Date();
    MusteriFiyatiUygulansin = null;
}