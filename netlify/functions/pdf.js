// exports.handler = async (event, context) => {
//     const pdfs = [
//         { title: 'Heloo Boss', author: 'Hen' },
//         { title: 'What is it', author: 'Luigi' },
//         { title: 'Here it is', author: 'Chi'} 
//     ]

//     // The clientContext contains information about the context of the clients making the request in our browser
//     // The user property is going to be present only when there is a valid user token coming in on the request
//     // if there is a user in the clientContext i.e if a user token is present inside the request then a data will be returned

//     if(context.clientContext.user) {

//         return {
//             statusCode: 200,
//             body: JSON.stringify(pdfs)
//         }
//     }

//     return {
//         statusCode: 401,
//         body: JSON.stringify({ msg: 'ah, ah, ah, ah you must be logged in to see this'})
//     }
// }