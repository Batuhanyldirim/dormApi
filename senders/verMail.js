/* 
Sends verification mail for password reset or user register operations
*/

import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCES_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "eu-central-1",
});

export function sendVerMail(to_mail, verCode, isNewUser, from_mail = "noreply@meetdorm.com") {
  if (isNewUser) {
    var body_text = `
Selam! dorm'a hoşgeldin, kayıt yaptığın için teşekkürler. Aşağıdaki kodu 24 saat içinde uygulamaya girersen hesap açma işlemin tamamlanacak.
  
Doğrulama kodu: ${verCode}
  
Birlikte çok güzel zamanlar geçireceğiz ve çok heyecanlıyız!
      
Sevgiler,

dorm 
Tanışmanın Yeni Yolu
support@meetdorm.com
https://www.meetdorm.com/
      `;
  } else {
    var body_text = `
Şifrenı kaybettiğini duyduk. Olsun arada olur öyle. Yeni şifre için aşağıdaki doğrulama kodunu kullanabilirsin.
    
Doğrulama kodu: ${verCode}
    
Eğlenceye kaldığın yerden devam edebilirsin!
        
Sevgiler,

dorm 
Tanışmanın Yeni Yolu
support@meetdorm.com
https://www.meetdorm.com/
        `;
  }

  var params = {
    Destination: {
      CcAddresses: [],
      ToAddresses: [to_mail],
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: body_text,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Verification Code",
      },
    },
    Source: from_mail,
    ReplyToAddresses: [],
  };

  // Create the promise and SES service object
  var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" }).sendEmail(params).promise();

  // Handle promise's fulfilled/rejected states
  sendPromise
    .then(function (data) {
      //console.log(data.MessageId);
    })
    .catch(function (err) {
      console.error(err, err.stack);
    });
}

export function sendReportMail(to_mail, from_mail = "noreply@meetdorm.com") {
  var body_text = `Raporunuz tarafımıza ulaşmıştır. En kısa zamanda gereklı inceleme yapılıp aksiyon alınacaktır. 
  Rapor yolu ile bilgilendirmeniz için teşekkür ederiz
  
  Dorm Ekibi
  `;

  var params = {
    Destination: {
      CcAddresses: [],
      ToAddresses: [to_mail],
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: body_text,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Raporunuzu Aldık",
      },
    },
    Source: from_mail,
    ReplyToAddresses: [],
  };

  // Create the promise and SES service object
  var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" }).sendEmail(params).promise();

  // Handle promise's fulfilled/rejected states
  sendPromise
    .then(function (data) {
      //console.log(data.MessageId);
    })
    .catch(function (err) {
      console.error(err, err.stack);
    });
}
