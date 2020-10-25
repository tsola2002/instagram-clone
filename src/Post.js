import React, { useState, useEffect } from 'react';
import './Post.css';
import Avatar from "@material-ui/core/Avatar";
import { db } from './firebase';
import firebase from "firebase";


function Post({ postId, user, username, caption, imageUrl }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');


    useEffect(() => {
        let unsubscribe
        // check if a postId was passed through
        if (postId) {
            //drill into posts collection
            unsubscribe = db.collection("posts")
                            // drill down to dcuments
                            .doc(postId)
                            // drill down to comments collection
                            .collection("comments")
                            // attach a snapshot listener
                            // order by the timestamp
                            .orderBy('timestamp', 'desc')
                            .onSnapshot((snapshot) => {
                                setComments(snapshot.docs.map((doc) => doc.data()));
                            })
        }
        return () => {
            unsubscribe();
        }
    }, [postId]);

    // function which will submit the comment
    const postComment = (event) => {
        event.preventDefault();

        db.collection("posts")
          .doc(postId)
          .collection("comments")
          .add({
              text: comment,
              username: user.displayName,
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });
        // clear the comment box after inserting the comment  
        setComment('');
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt="Omatsola Sobotie"
                    src="/static/images/avatar/1.jpg" 
                />
                <h3>{username}</h3>
            </div>
            
            <img className="post__image" src={imageUrl} />
            <h4 className="post__text"><strong>{username}</strong>{caption}</h4>
            
            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                    <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>
            
            {user && (
                <form className="post__commentBox">
                <input 
                    className="post__input"
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button
                    className="post__button"
                    disabled={!comment}
                    type="submit" 
                    onClick={postComment}
                >
                Post
                </button>
            </form>
            )}

            
        </div>
    )
}

export default Post
