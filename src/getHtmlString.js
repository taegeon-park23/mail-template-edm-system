const getHtmlString = (resultDoc, tableWidth=0, mailResultDoc=undefined) => {
    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">    
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Email Design</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <!--[if (mso 16)]>
        <style type="text/css">a {text-decoration: none;}</style>
    <![endif]-->
    <!--[if gte mso 9]>
        <style>sup { font-size: 100% !important; }</style>
    <![endif]-->
    <!--[if gte mso 9]>
      <v:rect xmlns_v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="mso-width-percent:1000;">
        <v:fill type="tile" color="#7bceeb" />
        <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
      <![endif]-->
    <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
        <o:AllowPNG></o:AllowPNG>
        <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    
    <style>
        @media screen and (max-width: 530px) { .col {max-width: 100% !important;} }
    </style>
    </head>
    <body>
    <!--[if gte mso 9]>
    <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
    <v:fill type="tile" color="#fff1e6"></v:fill>
    </v:background>
    <![endif]-->
    <table border="0" cellspadding="0" cesllspacing="0" style="width: 100%;"><tbody><tr><td id="mailResult" style="width: 100%;">
      ${ mailResultDoc ? mailResultDoc.innerHTML : ""}
      </td></tr></tobdy></table>
    ${resultDoc ? resultDoc.innerHTML : ""}
    </body></html>`;
}
export default getHtmlString;