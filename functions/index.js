const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.pushNotificationArticle = functions.firestore.document('articles/{articleId}').onUpdate(async change => {
  let rawData = change.after.data();

  // 整理資料
  let newData = {
    author: rawData.userAccount.split('@')[0],
    title: rawData.title,
    subTitle: rawData.subTitle
  }

  // Push Notification
  admin.messaging().send({
    data: {
      title: `New Article ${ newData.title } Have Been Released.`,
      body: JSON.stringify(newData),
    },
    topic: 'articles'
  }).then(() => { console.log(`Sucessfully Send Message`) }).catch((err) => { console.error(err) });
})

exports.registedToken = functions.https.onCall(async (data, context) => {
  // data => token
  let { token } = data;
  console.log(token);

  // Registed
  admin.messaging().subscribeToTopic([token], 'articles').catch(err => {
    console.error(err);
  });
  
});
