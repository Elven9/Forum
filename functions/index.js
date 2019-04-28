const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.pushNotificationArticle = functions.firestore.document('articles/{articleId}').onCreate(async snap => {
  let newData = snap.data();

  // Push Notification
  admin.messaging().send({
    notification: {
      title: `New Article ${ newData.title } Have Been Released.`,
      body: newData.subTitle,
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
