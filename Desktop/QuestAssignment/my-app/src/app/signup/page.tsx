
import React  from "react";




const submitStyle = {
    display: 'block',
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
};

export default function Signup(){
    return(
    <div className="container">
        <h1>Enter Your Bio</h1>
        <form action="#" method="post">
            <input type="text" name="name" placeholder="Your Name" style={{
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
}} />
            <textarea name="bio" placeholder="Bio Text or Few Sentences about Yourself" style={{
    width: '100%',
    height: '150px',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
}}></textarea>
            <input type="submit" value="Submit" style={submitStyle} />
        </form>
    </div>
    )
}

