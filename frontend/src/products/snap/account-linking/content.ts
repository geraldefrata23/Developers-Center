/**
 * products/snap/account-linking/content.ts
 * -------------------------------------------------------------------------
 * Links a customer's ShopeePay account for Link & Pay / Link & Pay (API Based) to charge later.
 * -------------------------------------------------------------------------
 */

import { P, M, O, C, RC_TBD } from "../../../core/contentHelpers.js";
import type { NavGroup, EndpointMap } from "../../../types.js";

export const nav: NavGroup = {group:"Account Linking", items:[
    {id:"link-authcode", label:"Get Auth Code", method:"get"},
    {id:"link-binding", label:"Account Binding", method:"post"},
    {id:"link-unbinding", label:"Account Unbinding", method:"post"},
    {id:"link-inquiry", label:"Account Inquiry", method:"post"},
    {id:"link-balance-inquiry", label:"Balance Inquiry", method:"post"},
  ]};

export const endpoints: EndpointMap = {
  "link-authcode":{
    crumb:"Account Linking", title:"Get Auth Code",
    method:"get", path:"/v1.0/get-auth-code", svc:"Service Code 10", sign:"hmac-get", flow:"authlink",
    lede:{en:"Starts the account-linking flow. ShopeePay returns an authCode that you exchange for an accountToken via Account Binding below.",
      id:"Memulai alur account linking. ShopeePay akan mengembalikan authCode yang dapat Anda tukarkan dengan accountToken melalui Account Binding di bawah ini."},
    callout:{type:"blue", title:{en:"Query string, not a JSON body", id:"Query string, bukan JSON body"},
      body:{en:"This is a GET request — there's no request body (it's hashed as an empty \"{}\" for signing purposes). Every parameter is sent as a query string appended to the URL instead.",
        id:"Ini adalah request GET — tidak ada request body (di-hash sebagai \"{}\" kosong untuk keperluan signing). Setiap parameter dikirim sebagai query string yang ditambahkan pada URL."}},
    queryParams:[
      {name:"redirectUrl", sample:"https://www.google.com/", req:M, identity:false},
      {name:"scopes", sample:"ACCOUNT_BINDING", req:M, identity:false},
      {name:"state", sample:"Test001", req:M, identity:false},
      {name:"merchantId", sample:"", req:M, identity:true},
      {name:"seamlessData", sample:"URLEncode(mobileNumber)", req:O, identity:false},
      {name:"seamlessSign", sample:"SHA256withRSA(seamlessData, privateKey)", req:O, identity:false},
    ],
    reqParams:[
      P("redirectUrl","string",M,{en:"URL to send the customer back to after linking.", id:"URL untuk mengarahkan customer kembali setelah proses linking selesai."}),
      P("scopes","string",M,{en:"Always ACCOUNT_BINDING.", id:"Selalu ACCOUNT_BINDING."}), P("state","string",M,{en:"Random string for CSRF protection, up to 32 chars.", id:"String acak untuk proteksi CSRF, maksimal 32 karakter."}),
      P("merchantId","string",M,{en:"Merchant ID.", id:"Merchant ID."}), P("seamlessData","string",O,{en:"URL-encoded JSON with the customer's phone number, if pre-validating.", id:"JSON yang di-URL-encode berisi nomor telepon customer, jika melakukan pre-validasi."}),
      P("seamlessSign","string",O,{en:"RSA signature of seamlessData — see Authentication guide.", id:"Signature RSA dari seamlessData — lihat panduan Authentication."}),
    ],
    sampleReq:{},
    respParams:[ P("authCode","string",M,{en:"Append to ShopeePay's linking page URL, expires in 30 minutes.", id:"Tambahkan pada URL halaman linking ShopeePay, berlaku selama 30 menit."}), P("state","string",M,{en:"Echoes back the state you sent.", id:"Mengembalikan kembali state yang Anda kirim."}) ],
    sampleResp:{responseCode:"2001000", responseMessage:"Successful", authCode:"ATNdJcGi6e9R9", state:"PSStoreLinking"},
    rc:[
      {group:"Success", rows:[["200","2001000","Successful","ok"]]},
      {group:"Request errors", rows:[["400","4001002","Invalid Mandatory Field seamlessSign / merchantId","err"]]},
      {group:"Business rules", rows:[["403","4031005","Do Not Honor — user deleted/banned/locked/not found","err"],["403","4031015","Maximum Active Binding Count Threshold Reached","err"]]},
      {group:"Other", rows:[["404","4041008","Invalid Merchant, Status Is Not Active","err"],["504","5041000","Timeout","err"]]},
    ],
  },

  "link-binding":{
    crumb:"Account Linking", title:"Account Binding",
    method:"post", path:"/v1.0/registration-account-binding", svc:"Service Code 07", sign:"hmac", flow:"direct",
    lede:{en:"Finishes the linking flow and returns an accountToken you can use in Link & Pay, Link & Pay (API Based), Subscription and Authorization & Capture.",
      id:"Menyelesaikan alur linking dan mengembalikan accountToken yang dapat Anda gunakan pada Link & Pay, Link & Pay (API Based), Subscription, dan Authorization & Capture."},
    callout:{type:"blue", title:{en:"accountToken is saved for you", id:"accountToken disimpan otomatis untuk Anda"},
      body:{en:"Just like Get Access Token, a successful call here saves accountToken in this browser's session so Link & Pay and Link & Pay (API Based) pre-fill it automatically on their Try It panels — no copy/pasting required.",
        id:"Sama seperti Get Access Token, panggilan yang berhasil di sini akan menyimpan accountToken pada sesi browser ini sehingga Link & Pay dan Link & Pay (API Based) dapat mengisinya secara otomatis pada panel Try It masing-masing — tanpa perlu copy-paste."}},
    reqParams:[ P("merchantId","string",M,{en:"Merchant ID.", id:"Merchant ID."}), P("authCode","string",C,{en:"Either authCode or partnerReferenceNo is required; expires 30 minutes after Get Auth Code.", id:"Salah satu dari authCode atau partnerReferenceNo wajib diisi; berlaku selama 30 menit setelah Get Auth Code."}) ],
    sampleReq:{merchantId:"acme_linking_store", partnerReferenceNo:"", authCode:"ATNdJcGi6e9R9"},
    respParams:[ P("accountToken","string",M,{en:"Store this securely and reuse it on subsequent payment requests.", id:"Simpan ini dengan aman dan gunakan kembali pada request pembayaran berikutnya."}) ],
    sampleResp:{responseCode:"2000700", responseMessage:"Successful", referenceNo:"Linking-123", accountToken:"+TgdOx95GGgt3kN7m1ITWDGqCTAVYysV"},
    rc:[
      {group:"Success", rows:[["200","2000700","Successful","ok"]]},
      {group:"Request errors", rows:[["400","4000702","Invalid Mandatory Field authCode or partnerReferenceNo","err"]]},
      {group:"Business rules", rows:[["403","4030705","Do Not Honor — user deleted/banned/locked/not active","err"],["403","4030715","Maximum Active Binding Count Threshold Reached","err"]]},
      {group:"Other", rows:[["404","4040711","Account Information Invalid","err"],["504","5040700","Timeout","err"]]},
    ],
  },

  "link-unbinding":{
    crumb:"Account Linking", title:"Account Unbinding",
    method:"post", path:"/v1.0/registration-account-unbinding", svc:"Service Code 09", sign:"hmac", flow:"direct",
    lede:{en:"Unlinks a customer's ShopeePay account from your platform.", id:"Melepas tautan akun ShopeePay customer dari platform Anda."},
    callout:null,
    reqParams:[ P("merchantId","string",M,{en:"Merchant ID.", id:"Merchant ID."}), P("additionalInfo","object",C,{en:"...", id:"..."},[P("accountToken","string",C,{en:"Either accountToken or partnerReferenceNo is required.", id:"Salah satu dari accountToken atau partnerReferenceNo wajib diisi."})]) ],
    sampleReq:{merchantId:"acme_merchant_01", partnerReferenceNo:"hq05cEwuIva07Jk51vBDykhxdIoU5fp4", additionalInfo:{accountToken:"+TgdOx95GGgt3kN7m1ITWDGqCTAVYysV"}},
    respParams:[ P("additionalInfo","object",O,{en:"...", id:"..."},[P("bindingStatus","int32",O,{en:"1 = Active, 2 = Inactive, 3 = Invalid.", id:"1 = Aktif, 2 = Tidak Aktif, 3 = Tidak Valid."})]) ],
    sampleResp:{responseCode:"2009000", responseMessage:"Successful", partnerReferenceNo:"AccountBinding-123", merchantId:"acme_merchant_01", additionalInfo:{bindingStatus:3}},
    rc:[
      {group:"Success", rows:[["200","2000900","Successful","ok"]]},
      {group:"Request errors", rows:[["400","4000902","Invalid Mandatory Field accountToken or partnerReferenceNo","err"]]},
      {group:"Business rules", rows:[["403","4030915","Transaction Not Permitted — ongoing payment for this account","err"]]},
      {group:"Other", rows:[["404","4040911","Account Information Invalid","err"],["409","4090900","Conflict","err"]]},
    ],
  },

  "link-inquiry":{
    crumb:"Account Linking", title:"Account Inquiry",
    method:"post", path:"/v1.0/registration-account-inquiry", svc:"Service Code 08", sign:"hmac", flow:"direct",
    lede:{en:"Returns a customer's linked ShopeePay account info for display purposes (masked account number, balance, KYC status if your contract allows it).",
      id:"Mengembalikan informasi akun ShopeePay customer yang telah ditautkan untuk keperluan tampilan (nomor akun yang disamarkan, saldo, status KYC jika kontrak Anda mengizinkannya)."},
    callout:null,
    reqParams:[ P("additionalInfo","object",C,{en:"...", id:"..."},[P("accountToken","string",C,{en:"Either accountToken or partnerReferenceNo is required.", id:"Salah satu dari accountToken atau partnerReferenceNo wajib diisi."})]) ],
    sampleReq:{partnerReferenceNo:"", additionalInfo:{accountToken:"J3Q4/bpCLK-hmE1U3vTJAka0HaNaKbLA"}},
    respParams:[ P("accountNo","string",O,{en:"Masked phone number, e.g. ********1234.", id:"Nomor telepon yang disamarkan, contoh ********1234."}), P("additionalInfo","object",O,{en:"...", id:"..."},[P("bindingStatus","int32",O,{en:"1 = Active, 2 = Inactive, 3 = Invalid.", id:"1 = Aktif, 2 = Tidak Aktif, 3 = Tidak Valid."}),P("walletBalance","string",O,{en:"Only returned if your contract permits it.", id:"Hanya dikembalikan jika kontrak Anda mengizinkannya."})]) ],
    sampleResp:{responseCode:"2000800", responseMessage:"Successful", accountNo:"**6666", additionalInfo:{bindingStatus:1, walletBalance:"1771375.00"}},
    rc:[
      {group:"Success", rows:[["200","2000800","Successful","ok"]]},
      {group:"Request errors", rows:[["400","4000802","Invalid Mandatory Field accountToken or partnerReferenceNo","err"]]},
      {group:"Business rules", rows:[["403","4030805","Do Not Honor — user deleted/banned/locked/not active","err"]]},
      {group:"Other", rows:[["404","4040811","Account Information Invalid","err"],["409","4090800","Conflict","err"]]},
    ],
  },

  "link-balance-inquiry":{
    crumb:"Account Linking", title:"Balance Inquiry",
    method:"post", path:"/v1.0/debit/balance-inquiry", svc:"Link & Pay (API Based) only", sign:"hmac", flow:"direct",
    lede:{en:"Looks up every ShopeePay payment method available on a linked account for a given amount — wallet balance, SPayLater installment tenures, fees and eligibility — so the customer can pick one before you charge it with Link & Pay (API Based).",
      id:"Mencari semua metode pembayaran ShopeePay yang tersedia pada akun yang tertaut untuk suatu jumlah tertentu — saldo wallet, tenor cicilan SPayLater, biaya, dan kelayakan — sehingga customer dapat memilih salah satunya sebelum Anda melakukan charge dengan Link & Pay (API Based)."},
    callout:{type:"blue", title:{en:"Only needed for the \"API Based\" integration", id:"Hanya diperlukan untuk integrasi \"API Based\""},
      body:{en:"Link & Pay Redirection (LnPR) never calls this — ShopeePay picks the funding source for you. Balance Inquiry exists so Link & Pay (API Based) partners can show the customer their own option picker, the same way ShopeePay's own checkout page does.",
        id:"Link & Pay Redirection (LnPR) tidak pernah memanggil endpoint ini — ShopeePay yang memilihkan funding source untuk Anda. Balance Inquiry ada agar partner Link & Pay (API Based) dapat menampilkan pemilihan opsi mereka sendiri kepada customer, sama seperti yang dilakukan halaman checkout milik ShopeePay sendiri."}},
    reqParams:[
      P("additionalInfo","object",M,{en:"...", id:"..."},[
        P("requestId","string",M,{en:"Unique id for this balance inquiry.", id:"ID unik untuk balance inquiry ini."}),
        P("accountToken","string",M,{en:"Token for the linked account to inspect — auto-filled once you've completed Account Linking.", id:"Token untuk akun tertaut yang ingin diperiksa — otomatis terisi setelah Anda menyelesaikan Account Linking."}),
        P("merchantId","string",M,{en:"Merchant ID.", id:"Merchant ID."}),
        P("externalStoreId","string",M,{en:"Store ID.", id:"Store ID."}),
        P("amount","object",M,{en:"Intended transaction amount — affects which installment tenures, fees and promos are returned.", id:"Jumlah transaksi yang dimaksud — memengaruhi tenor cicilan, biaya, dan promo yang dikembalikan."},[P("value","number",M,{en:"Transaction amount, e.g. 2000.00.", id:"Jumlah transaksi, contoh 2000.00."}),P("currency","string",M,{en:"IDR.", id:"IDR."})]),
        P("language","string",O,{en:"id or en — localizes displayName and complianceNotices text in the response.", id:"id atau en — melokalkan teks displayName dan complianceNotices pada response."}),
      ]),
    ],
    sampleReq:{additionalInfo:{requestId:"lnpab_000001", accountToken:"+O9KttLcMT-+8GZqLeIU44YZtCtZ5Qf8", merchantId:"acme_lnpab_m1", externalStoreId:"acme_lnpab_s1", amount:{value:2000.00, currency:"IDR"}, language:"id"}},
    respParams:[
      P("responseCode","string",M,{en:"API status code.", id:"Kode status API."}),
      P("additionalInfo","object",M,{en:"...", id:"..."},[
        P("requestId","string",M,{en:"Echoes your requestId.", id:"Mengembalikan kembali requestId Anda."}),
        P("savedPaymentMethod","array",M,{en:"One entry per payment method available to this account for this amount.", id:"Satu entri untuk setiap metode pembayaran yang tersedia pada akun ini untuk jumlah ini."},[
          P("payMethod","string",M,{en:"e.g. spay_later, ewallet.", id:"contoh spay_later, ewallet."}),
          P("displayName","string",M,{en:"Label to show the customer.", id:"Label yang ditampilkan kepada customer."}),
          P("iconUrl","string",O,{en:"Icon to show next to displayName.", id:"Ikon yang ditampilkan di samping displayName."}),
          P("transactionFee","string",O,{en:"Fee charged for this option.", id:"Biaya yang dikenakan untuk opsi ini."}),
          P("payOption","string",O,{en:"Chosen sub-option label, e.g. \"SPayLater\".", id:"Label sub-opsi yang dipilih, contoh \"SPayLater\"."}),
          P("payableAmount","string",O,{en:"Total the customer will pay if they choose this option.", id:"Total yang harus dibayar customer jika memilih opsi ini."}),
          P("paymentMethodAvailability","object",M,{en:"...", id:"..."},[P("isAvailable","boolean",M,{en:"Whether this option can be used right now.", id:"Menunjukkan apakah opsi ini dapat digunakan saat ini."}),P("unavailableReason","string",O,{en:"Shown to the customer when isAvailable is false, e.g. insufficient balance.", id:"Ditampilkan kepada customer saat isAvailable bernilai false, contoh saldo tidak mencukupi."})]),
          P("paymentMethodDetails","object",O,{en:"Nested per-payMethod detail. For spay_later this includes creditBalance and a spaylaterOptions array — one entry per installment tenure, each with its own transactionFee, monthlyPayment and paymentOptionReference. Copy that paymentOptionReference verbatim into Create Payment Order (API Based).",
            id:"Detail bertingkat per payMethod. Untuk spay_later, ini mencakup creditBalance dan array spaylaterOptions — satu entri per tenor cicilan, masing-masing dengan transactionFee, monthlyPayment, dan paymentOptionReference sendiri. Salin paymentOptionReference tersebut apa adanya ke dalam Create Payment Order (API Based)."}),
        ]),
      ]),
    ],
    sampleResp:{
      responseCode:"2001100", responseMessage:"Successful",
      additionalInfo:{
        requestId:"HDBAL0001",
        savedPaymentMethod:[
          {
            payMethod:"spay_later", savedPaymentMethodId:"1e3b4b10d75b7f681", displayName:"SPayLater",
            iconUrl:"https://proxy.uss.s3.test.shopee.io/api/v4/60018404/shopee_logo_test_bucket/static/images/icon_shopee_credit_new.png",
            paymentMethodDetails:{
              spay_later:{
                creditBalance:"1058365.00",
                spaylaterOptions:[
                  { savedPaymentMethodId:"1d429c8b2f229fdde", displayName:"SPayLater", transactionFee:"15000.00", payOption:"SPayLater", loanTenure:1, monthlyPayment:"795294.00", payableAmount:"765000.00", paymentMethodAvailability:{isAvailable:true}, paymentPromoInfo:[{promoType:"COINBACK", promoText:"100 Coins", applicability:"payment_method"}], paymentOptionReference:"lnpab_token:019f5a5e-7035-767f-ad9b-aaea4271a433" },
                  { savedPaymentMethodId:"1302993f46e3e86d5", displayName:"Instalment 3X", transactionFee:"30000.00", payOption:"Instalment 3X", loanTenure:3, monthlyPayment:"290834.00", payableAmount:"780000.00", paymentMethodAvailability:{isAvailable:true}, paymentPromoInfo:[{promoType:"COINBACK", promoText:"100 Coins", applicability:"payment_method"}], paymentOptionReference:"lnpab_token:019f5a5e-704e-7592-b4e4-5e2ab08da7a3" },
                  { savedPaymentMethodId:"1fc0867bc0f6ba6e6", displayName:"Instalment 6X", transactionFee:"37500.00", payOption:"Instalment 6X", loanTenure:6, monthlyPayment:"144504.00", payableAmount:"787500.00", paymentMethodAvailability:{isAvailable:true}, paymentPromoInfo:[{promoType:"COINBACK", promoText:"100 Coins", applicability:"payment_method"}], paymentOptionReference:"lnpab_token:019f5a5e-7066-72b0-bebf-9edf65768453" },
                ],
              },
            },
            transactionFee:"0.00", payOption:"SPayLater", payableAmount:"0.00",
            paymentMethodAvailability:{isAvailable:true},
            description:"No admin fee. Enjoy 0% instalment for selected tenures!",
          },
          {
            payMethod:"ewallet", savedPaymentMethodId:"1e3b4b10d75b7f681", displayName:"ShopeePay Balance",
            iconUrl:"https://proxy.uss.s3.test.shopee.io/api/v4/60018404/shopee_logo_test_bucket/static/images/icon_spp_wallet_new.png",
            paymentMethodDetails:{ ewallet:{ availableBalance:"624539.00" } },
            transactionFee:"0.00", payOption:"ShopeePay Balance", payableAmount:"750000.00",
            paymentMethodAvailability:{isAvailable:false, unavailableReason:"Sorry, you don't have enough balance in your Shopeepay Wallet balance for this checkout. Please top up or choose another payment method."},
            paymentPromoInfo:[{promoType:"COINBACK", promoText:"100 Coins", applicability:"payment_method"}],
            paymentOptionReference:"lnpab_token:019f5a5e-7076-7b03-af03-9289e8f3a283",
          },
        ],
      },
    },
    rc: RC_TBD,
  },
};
