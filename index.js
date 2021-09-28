import {AppRegistry} from 'react-native';
import React,{Component} from 'react';
import App from './App';
import {name as appName} from './app.json';

import {Provider} from 'react-redux';
// import index from './src/redux/index';
import store from './src/redux/store/index';

import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { Q } from '@nozbe/watermelondb'


import schema from './src/model/schema'
import migrations from './src/model/migrations'
import Post from './src/model/Post' // ⬅️ You'll import your Models here

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema,
  // (You might want to comment it out for development purposes -- see Migrations documentation)
  migrations,
  // (optional database name or file system path)
  dbName: 'watermelon',
  // (recommended option, should work flawlessly out of the box on iOS. On Android,
  // additional installation steps have to be taken - disable if you run into issues...)
  jsi: true, /* Platform.OS === 'ios' */
  // (optional, but you should implement this method)
  onSetUpError: error => {
    console.log("database errror>>>>",error);
    // Database failed to load -- offer the user to reload the app or log out
  }
})

console.log("adapter>>>>",adapter);

// Then, make a Watermelon database from it!
export const database = new Database({
  adapter,
  modelClasses: [
    Post, // ⬅️ You'll add Models to Watermelon here
  ],
})

// Note: function passed to `database.write()` MUST be asynchronous
// const newPost = database.write(async => {
//   const post = database.get('posts').create(post => {
//     post.title = 'New post created'
//     post.body = 'Lorem ipsum...'
//   })
//   // const comment = database.get('comments').create(comment => {
//   //   comment.post.set(post)
//   //   comment.author.id = '123'
//   //   comment.body = 'Great post!'
//   // })

//   // Note: Value returned from the wrapped function will be returned to `database.write` caller
//   return post
// })



// const updatePost =database.write(async => {
//   const postId = '5eocw2tf3u0l3imj'
//   const post = database.get('posts').find(postId)
//   post.then(res=>{
//     res.update(()=>{
//       res.title='Testing with Title'
//       res.subtitle='Sub Title'
//     })
//   })
//   database.get('posts').create((post)=>{
//     post.title="Watermelon db"
//   })
//   const read=database.get('posts').query().fetchCount()
//   read.then(res=>{
//     console.log("res>>>",res);
//   })

  
//   console.log("deleted",);
//   // Note: Value returned from the wrapped function will be returned to `database.write` caller
//   return post
// })


// console.log("newPost>>>",post);


const AppRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

//AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent(appName, () => AppRedux);
