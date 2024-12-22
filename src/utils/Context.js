import { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {

    let [user, setUser] = useState(() => (localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null));
    let [authTokens, setAuthTokens] = useState(() => (localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null));
    let [loading, setLoading] = useState(true);
    let [currentblog, setCurrentblog] = useState({});
    let [blogdata, setBlogdata] = useState([]);
    let [userprofile, setUserprofile]= useState({});
    let [feature, setFeature] = useState('');

    const navigate = useNavigate();

    let loginUser = async (e) => {
        e.preventDefault()
        try {
        const response = await fetch('https://cosmoblog-obr9.onrender.com/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: e.target.username.value, password: e.target.password.value })
        });

        if (!response.ok) {
            // Handle the case where the response status is not in the 200-299 range
            throw new Error('Network response was not ok');
        }

        let data = await response.json();

        if(data){
            localStorage.setItem('authTokens', JSON.stringify(data));
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            navigate('/')
        } else {
            alert('Something went wrong while loggin in the user!')
        }
    } catch (error) {
        // Handle errors, including invalid token errors, here
        console.error('An error occurred:', error);

        // specific error handling for invalid tokens 
        if (error.message === 'Invalid token error message') {
            // Handle the invalid token error here
            alert('Credentials entered not valid.');
        } else {
            // Handle other types of errors
            alert('Credentials entered not valid.');
        }
    }
    }

    useEffect(() => {
        // Send a GET request to your Django API
        axios.get(`https://cosmoblog-obr9.onrender.com/setuser/?query=${user?.username}`)
            .then(response => {
                setUserprofile(response.data);
              })
              .catch(error => {
                console.error(error);
              });

      }, [user]);

    useEffect(()=>{
      axios.get(`https://cosmoblog-obr9.onrender.com/userposts/?query=${userprofile.cbuid}`)
          .then(response => {
            setBlogdata(response.data);
          })
          .catch(error => {
            console.error(error);
          });
    },[user]);

    let logoutUser = (e) => {
        e.preventDefault()
        localStorage.removeItem('authTokens')
        setAuthTokens(null)
        setUser(null)
        navigate('/')
    }

    const updateToken = async () => {
        const response = await fetch('https://cosmoblog-obr9.onrender.com/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify({refresh:authTokens?.refresh})
        })
       
        const data = await response.json()
        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens',JSON.stringify(data))
        } else {
            logoutUser()
        }

        if(loading){
            setLoading(false)
        }
    }

    useEffect(()=>{
        const REFRESH_INTERVAL = 1000 * 60 * 4 // 4 minutes
        let interval = setInterval(()=>{
            if(authTokens){
                updateToken()
            }
        }, REFRESH_INTERVAL)
        return () => clearInterval(interval)

    },[authTokens])


    let contextData = {
        user: user,
        authTokens: authTokens,
        currentblog: currentblog,
        blogdata: blogdata,
        userprofile: userprofile, 
        feature: feature,
        setFeature: setFeature,
        setUserprofile: setUserprofile,
        setCurrentblog: setCurrentblog,
        setBlogdata: setBlogdata,
        loginUser: loginUser,
        logoutUser: logoutUser,
    }

    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}