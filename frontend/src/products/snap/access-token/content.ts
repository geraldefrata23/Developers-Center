/**
 * products/snap/access-token/content.ts
 * -------------------------------------------------------------------------
 * Get Access Token (B2B) — the RSA-signed call every other SNAP endpoint depends on.
 * -------------------------------------------------------------------------
 */

import { P, M, O, C, RC_TBD } from "../../../core/contentHelpers.js";
import type { NavGroup, EndpointMap } from "../../../types.js";

export const nav: NavGroup = {group:"Access Token", menuLabelBefore:true, items:[
    {id:"access-token", label:"Get Access Token (B2B)", method:"post"},
  ]};

export const endpoints: EndpointMap = {
  "access-token":{
    crumb:"Access Token", title:"Get Access Token (B2B)",
    method:"post", path:"/v1.0/access-token/b2b", svc:"Service Code 73",
    lede:{en:"Exchanges your Client Key for an accessToken used as the Bearer token on every transactional API below. The signature is asymmetric (SHA256withRSA), signed with your private key.",
      id:"Menukar Client Key Anda dengan accessToken yang digunakan sebagai Bearer token pada setiap API transaksional di bawah ini. Signature bersifat asymmetric (SHA256withRSA), ditandatangani dengan private key Anda."},
    sign:"rsa", flow:"direct",
    callout:{type:"blue",
      title:{en:"Headers required", id:"Header yang wajib disertakan"},
      body:{en:"X-CLIENT-KEY, X-TIMESTAMP, X-SIGNATURE. No Authorization Bearer header on this endpoint — every other product in this reference calls this exact same request first.",
        id:"X-CLIENT-KEY, X-TIMESTAMP, X-SIGNATURE. Tidak ada header Authorization Bearer pada endpoint ini — setiap produk lain dalam referensi ini memanggil request yang persis sama ini terlebih dahulu."}},
    reqParams:[ P("grantType","string",M,{en:"Always client_credentials.", id:"Selalu client_credentials."}) ],
    sampleReq:{grantType:"client_credentials"},
    respParams:[
      P("responseCode","string",M,{en:"API status code.", id:"Kode status API."}),
      P("responseMessage","string",M,{en:"Debug message.", id:"Pesan debug."}),
      P("accessToken","string",M,{en:"Token to use as Authorization: Bearer on other APIs.", id:"Token yang digunakan sebagai Authorization: Bearer pada API lainnya."}),
      P("tokenType","string",M,{en:"Always Bearer.", id:"Selalu Bearer."}),
      P("expiresIn","string",M,{en:"Token lifetime in seconds (default 900).", id:"Masa berlaku token dalam detik (default 900)."}),
    ],
    sampleResp:{responseCode:"2007300", responseMessage:"Successful", accessToken:"eyJhbGciOiJIUzI1NiIs...", tokenType:"Bearer", expiresIn:"900"},
    rc:[
      {group:"Success", rows:[["200","2007300","Successful","ok"]]},
      {group:"Request errors", rows:[["400","4007300","Bad Request","err"],["400","4007301","Invalid Field Format","err"],["400","4007302","Invalid Mandatory Field + {error message}","err"]]},
      {group:"Authorization", rows:[["401","4017300","Unauthorized.{error message}","err"],["401","4017301","Invalid Token","err"]]},
      {group:"Other", rows:[["409","4097300","Conflict","err"],["500","5007301","Internal Server Error","err"],["504","5047300","Timeout","err"]]},
    ],
  },
};
