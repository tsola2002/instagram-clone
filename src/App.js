import React, { useState } from 'react';
import './App.css';
import Post from './Post';

function App() {
  const [posts, setPosts] = useState([
    {
      username: "bosssholly",
      caption: "WOW it works",
      imageUrl: "https://image.tmdb.org/t/p/original//xGexTKCJDkl12dTW4YCBDXWb1AD.jpg"
    },
    {
      username: "bosssholly",
      caption: "WOW it works",
      imageUrl: "https://image.tmdb.org/t/p/original//xGexTKCJDkl12dTW4YCBDXWb1AD.jpg"
    }
  ]);


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
        posts.map(post => (
          <Post username={post.username} caption={post.caption} imageUrl={post.imageUrl} />  
        ))
      }


    </div>
    
  ); 
}

export default App;