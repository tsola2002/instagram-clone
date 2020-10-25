import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db } from './firebase';

function App() {
  const [posts, setPosts] = useState([]);

  //it runs a piece of code based on a certain condition
  useEffect(() => {
    // this is where the code runs
    // everytime a document gets changed it takes a snapshot
    db.collection('posts').onSnapshot(snapshot => {
      // form the snapshot get the docs and map through the items
      // convert it into an object to make it easier to pull data
      setPosts(snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data()
        })));
        //console.log(db.collection('posts'));        
    })
  }, []);

  

  return (
    <div className="app">
      
      <div className="app__header">
        <img
          className="app__headerImage" 
          alt=""
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" />
      </div>
      <h1>hello isaac lets build an instagram clone 🚀 🚀 </h1>
      
      {
        // we map through the posts using objects with keys
        posts.map(({id, post}) => (
          <Post key={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />  
        ))
      }


    </div>
    
  ); 
}

export default App;