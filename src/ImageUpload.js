import React, { useState } from 'react';
import { Button, Input } from '@material-ui/core';
import firebase from "firebase";
import { storage, db } from './firebase';
import './ImageUpload.css';


function ImageUpload({username}) {

    const [image, setImage] = useState(null);
    // const [url, setUrl] = useState("");
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    // handle change function will fire off an event
    const handleChange = (e) => {
        // get the first file dat was selected
        if (e.target.files[0]) {
            //set the image state to setImage
            setImage(e.target.files[0]);
        }    
        
    }

    const handleUpload = () => {
        // access the storage in firebase
        // get a reference to the images folder
        // insert the image into firebase storage
        const uploadTask = storage.ref(`images/${image.name}`)
                                  .put(image);
        // listen for state_changed & return a snapshot
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function(calculate visual indicator from 0-100)
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            }, // throw an error if anything goes wrong
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function(this function will run after the upload completes)
                // retrieve the download url from firebase storage
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        // after getting the url we post the image inside the database
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username    
                        });
                        //set progress bar back to 0 whenits done
                        setProgress(0);
                        setCaption("");
                        setImage(null);    
                    })
            }
        
        )
    }
     
    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100" />
            <input type="text" placeholder="Enter a caption..." value={caption} onChange={event => setCaption(event.target.value)}/>
            <input type="file" onChange={handleChange} /> 
            <Button onClick={handleUpload}>
                Upload
            </Button> 
        </div>
    )
}

export default ImageUpload
