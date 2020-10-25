import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db,auth } from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';
import firebase from "firebase";


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  // get modal styles
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles(); 
  const [username, setUsername] = useState([]);
  const [password, setPassword] = useState([]);
  const [email, setEmail] = useState([]);
  const [posts, setPosts] = useState([]);
  // state to keep track of open status
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  // state to keep track of the user
  const [user, setUser] = useState(null);


  //useEffect is a frontend listener
  //it runs a piece of code based on a certain condition
  useEffect(() => {
    // this is where the code runs
    // auth.onstatechanged is a backend listener
    // everytime authentication details gets changed
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // use has logged in..
        console.log(authUser);
        setUser(authUser);
      } else {
        //user has logged out ..
        // set the user to null
        setUser(null);
      }
    })

    return () => {
      // perform some cleanup action
      // it will detach the listner so that we dont have duplicates
      unsubscribe();
    }
  }, [user, username]);


  //it runs a piece of code based on a certain condition
  useEffect(() => {
    // this is where the code runs
    // everytime a document gets changed it takes a snapshot
    db.collection('posts')
                        .orderBy('timestamp', 'desc')
                        .onSnapshot(snapshot => {
      // form the snapshot get the docs and map through the items
      // convert it into an object to make it easier to pull data
      setPosts(snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data()
        })));
        //console.log(db.collection('posts'));        
    })
  }, []);

  const signUp = (event) => {
    // this prevents a refresh when you submit the form
    event.preventDefault();

     

    // pass the user & password variables gotten from the form to firebase
    auth.createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
          // it needs to be returned bcos it comes from a promise
          return authUser.user.updateProfile({
            // update the profile when you create them so that displayname = username
            displayName: username,
          })
        })
        //update & show the username
        .catch((error) => alert(error.message))
        //close the modal after signin in
        setOpen(false);
  }

  const signIn = (event) => {
    // this prevents a refresh when you submit the form
    event.preventDefault();

    // 
    auth.signInWithEmailAndPassword(email, password)
        .catch((error) => alert(error.message))
      // close the modal after sigin in  
      setOpenSignIn(false);  
  }

  return (
    <div className="app">
    
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >

    <div style={modalStyle} className={classes.paper}>
      <form className="app__signup">
        <center>
          <img
          className="app__headerImage" 
          alt=""
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          />
        </center>
          <Input
          placeholder="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
          />
          <Input
          placeholder="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          />
          <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
          <Button type="submit" onClick={signUp}>Sign Up</Button>
        
      </form>
    </div>
    </Modal>
    
    <Modal
      open={openSignIn}
      onClose={() => setOpenSignIn(false)}
    >

    <div style={modalStyle} className={classes.paper}>
      <form className="app__signup">
        <center>
          <img
          className="app__headerImage" 
          alt=""
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          />
        </center>   
          <Input
          placeholder="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          />
          <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
          <Button type="submit" onClick={signIn}>Sign In</Button>
        
      </form>
        </div>
    </Modal>
    
      <div className="app__header">
        <img
          className="app__headerImage" 
          alt=""
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        />

        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
  
        ) : (
          <div className="app__loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div> 

      <div className="app__posts">
          <div className="app_postsLeft">
          {
            // we map through the posts using objects with keys
            posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />  
            ))
          }
          </div>
        
          <div className="app_postsRight">
          <InstagramEmbed
          url='https://www.instagram.com/p/BuEmbsKH_zC/?utm_source=ig_web_copy_link/'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
          />
          </div>

        
      </div>
      
      
      

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ): (
        <h3> Sorry you need to login to upload</h3>
      )}


    </div>
    
  ); 
}

export default App;