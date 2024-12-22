import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { IoCloseCircle, IoCheckmarkCircle, IoLogoGoogle } from "react-icons/io5";

const Register=()=>{
    const backendUrl = 'https://cosmoblog-obr9.onrender.com/register';
    const [userdata, setUserdata] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [expertise, setExpertise] = useState('');
    const [description, setDescription]= useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [usernamevalid, setUsernamevalid] = useState(false);
    const [emailvalid, setEmailvalid] = useState(false);
    const [errormessage, setErrormessage] = useState('');
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState(null);

    const navigate = useNavigate();
    
    useEffect(() => {
        // Send a GET request to your Django API
        axios.get(backendUrl)
          .then(response => {
            setUserdata(response.data);
          })
          .catch(error => {
            console.error(error);
          });
          document.getElementById('regbtn').disabled = true;
      }, []);

    const CheckUsername =()=>{
        for (var i = 0; i < userdata.length; i++){
            if (username !== userdata[i].username &&  username.length >= 3){
                setUsernamevalid(true);
            }else{
                setUsernamevalid(false);
                break;
            }
        }
    }

    useEffect(()=>{
        CheckUsername();
    },[username]);

    const CheckEmail =()=>{
        for (var i = 0; i < userdata.length; i++){
            if (email !== userdata[i].email){
                setEmailvalid(true);
            }else{
                setEmailvalid(false);
                break;
            }
        }
    }

    useEffect(()=>{
        CheckEmail();
    },[email]);

    const CheckAll =()=>{
        if (password===password2){
            if (firstname!==''){
                setErrormessage('');
                if (lastname!==''){
                    setErrormessage('');
                    if (usernamevalid === true){
                        setErrormessage('');
                        if (emailvalid === true){
                            setErrormessage('');
                            if (password!==''){
                                setErrormessage('');
                                document.getElementById('regbtn').disabled = false;
                            }else{setErrormessage('Create password');document.getElementById('regbtn').disabled = true;}
                        }else{setErrormessage('Enter a valid Email');document.getElementById('regbtn').disabled = true;}
                    }else{setErrormessage('Select a valid usename');document.getElementById('regbtn').disabled = true;}
                }else{setErrormessage('Enter Last Name');document.getElementById('regbtn').disabled = true;}
            }else{setErrormessage('Enter First Name');document.getElementById('regbtn').disabled = true;}
        }else{setErrormessage('Passwords dont match');document.getElementById('regbtn').disabled = true;}
    }

    useEffect(()=>{
        CheckAll();
    },[firstname, lastname, username, email, password, password2, expertise]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setImage(file);
        const reader = new FileReader();
        reader.onload = () => {
            setImageURL(reader.result);
        };
        reader.readAsDataURL(file);
    };
    
    function RegisterUser() {   
        axios.post(backendUrl, {         
          first_name: firstname,         
          last_name: lastname,
          username: username,
          email: email,
          expertise: expertise,
          cbuid: "create",
          password: password,
          description: description,
          profile_image_base64: imageURL
        })       
          .then((response) => {         
            setUserdata(response.data);       
        });   
        window.alert('Account for ' +firstname+ ' created successfully!');
        document.getElementById('regbtn').disabled = true;  
        navigate('/login');
      } 

    return (
        <div align='center'>
            <div id="regwrapper" align='left'><br/>
            <h3 id="regwelcome">Welcome to CosmoBlog!<br/>Register your account</h3>
            <div>
                <div className="input-container">
                    <label className='labeltxt'>First Name</label><br/>
                    <input type='text' onChange={event =>setFirstname(event.target.value)} value={firstname} placeholder='Enter your First name' className="nametxt" maxLength={150}></input>
                </div>
                <div className="input-container">
                    <label className='labeltxt'>Last Name</label><br/>
                    <input type='text' onChange={event =>setLastname(event.target.value)} value={lastname} placeholder='Enter your Last name' className="nametxt" maxLength={150}></input>
                </div>
                <div className="input-container">
                    <label className='labeltxt'>Email</label><br/>
                    <input type='email' onChange={event =>{setEmail(event.target.value); CheckEmail()}} value={email} placeholder='Enter your Email' className="nametxt" maxLength={254}></input>
                </div>
                <div className="input-container">
                    <label className='labeltxt'>Specialization</label><br/>
                    <input type='text' onChange={event =>setExpertise(event.target.value)} value={expertise} placeholder='Enter your Occupation/Specialization' className="nametxt" maxLength={100}></input>
                </div>
                <div className="input-container">
                    <label className='labeltxt'>Username</label><br/>
                    <input type='text' onChange={event =>{setUsername(event.target.value); CheckUsername()}} value={username} placeholder='Create a User-name' className="nametxt" maxLength={150}></input>                   
                    {username === ''? <p id="usernamevalid"></p>: username.length < 3?<p id="usernamenotvalid"><IoCloseCircle/>username can't be less than 3 characters</p>: usernamevalid === true? <p  id="usernamevalid"><IoCheckmarkCircle/>username is valid </p>:<p id="usernamenotvalid"><IoCloseCircle/>username already taken</p>} 
                </div>
                <div className="input-container">
                    <label className='labeltxt'>Description</label><br/>
                    <textarea onChange={event =>setDescription(event.target.value)} value={description} placeholder='Enter a short description of yourself' className="nametxt desc" maxLength={1000}></textarea>
                </div>
                <div className="input-container">
                    <label className='labeltxt'>Password</label><br/>
                    <input type="password" onChange={event =>setPassword(event.target.value)} value={password} placeholder='Enter Password' className="nametxt" maxLength={120}></input>
                </div>
                <div className="input-container">
                    <label className='labeltxt'>Confirm Password</label><br/>
                    <input type="password" onChange={event =>setPassword2(event.target.value)} value={password2} placeholder='Re-enter Password' className="nametxt" maxLength={120}></input>
                </div>
            </div>
            <p className='labeltxt'>Choose Profile Picture</p>
            <input type="file" accept="image/*" onChange={handleImageUpload} /><br/>
            {image && (
                <div>
                <h3>Selected Image:</h3>
                <img src={imageURL} alt="Selected" width="150" />
                </div>
            )}
            <div align='center'>
                {errormessage===''?<b></b>:<div id="errormsg"><IoCloseCircle/>{errormessage}</div>}
                <input type="Submit" onClick={RegisterUser} id="regbtn"></input>
                <br/><p className='labeltxt'>or Register with Google </p><br/><button id="google-btn"><IoLogoGoogle/> </button>
                <b><p className="alternates">Already have an account? <Link to='/login'>Login</Link></p></b>
            </div>
            </div>
        </div>
        );
    }

export default Register;