import React from 'react'
import axios from 'axios'
import {withRouter} from 'react-router-dom'


function LandingPage(props) {
    const onClickHandler = () =>{
        axios.get('/api/user/logout')
        .then(response => {
            if(response.data.success){
                props.history.push('/login')
            }else{
                alert('Error to Logout')
            }
        })
    }
    return (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'100vh' }}>
           <h2>시작 페이지</h2>

           <button onClick={onClickHandler}>Logout</button>
        </div>
    )
}

export default withRouter(LandingPage)
