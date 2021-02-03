import React, { useState, useContext, useEffect, useCallback } from "react";
import Modal from "@material-ui/core/Dialog";


import "./Login.css";
import bizeMDIcon from "../assets/images/BizeMD.PNG";
import axios from "axios";
import SignUpModal from "../pageComponents/Login/SignUpModal";

const Login = ({history}) => {

    const [userId, setUserId] = useState("");
    const [userPw, setUserPw] = useState("");
    const [signUpModalStatus, setSignUpModalStatus] = useState("false");
    const [updateCount, setUpdateCount] = useState(0);

    

    const onClickSignUpModalCallBack = useCallback((no)=>{
      setSignUpModalStatus(true);

    })

    return (

      <div className="sign-in">

        {signUpModalStatus === true ? (
          <Modal
            open={signUpModalStatus}
            onClose={()=>{
              setSignUpModalStatus(false);
            }}
            children={
              <SignUpModal
                onClose={()=>{
                  setSignUpModalStatus(false);
                }}
                setUpdateCountLogin={()=> {
                  setUpdateCount(updateCount+1);
                }}>

              </SignUpModal>

            }
            >

          </Modal>
        ) : null}

        <div className="text-center shadow p-3 mb-5 bg-white rounded">
          <form className="form-signin">
            <img
              className="mb-4"
              src={bizeMDIcon}
              alt=""
              width="120"
              height="50"
            />
            {/* <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1> */}
            <label htmlFor="inputId" className="sr-only">
              id
            </label>
            <input
              type="id"
              id="inputId"
              className="form-control"
              placeholder="👥 id"
              required
              value={userId}
              onChange={(e)=>{setUserId(e.target.value)}}
              autoFocus
            />
            <label htmlFor="inputPassword" className="sr-only">
              Password
            </label>
            <input
              type="password"
              id="inputPassword"
              className="form-control"
              placeholder="🔒 Password"
              value={userPw}
              onChange={(e)=>{setUserPw(e.target.value)}}
              required
            />
            <div className="checkbox mb-3">
              <label>
                <input type="checkbox" value="remember-me" /> Remember me
              </label>
            </div>
            <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={async (e)=> {
              e.preventDefault();
              try {
                const response = await axios.post('http://localhost:8080/login', {"userId":userId, "userPw": userPw}
                  ,{headers:{ "Content-Type":'application/json'}}
                );
                if(response.data === "userIdWrong") {
                  alert("아이디를 다시한번 확인해 주세요");
                } else if(response.data === "userPwWrong") {
                  alert("비밀번호를 다시한번 확인해 주세요");
                }
                else {
                  localStorage.setItem('jwtToken', response.data);
                  history.push("/");
                }
              } catch(err) {
                console.log(err);
                alert("서버와 연결이 불안정합니다.");
              }
            }}>
              Sign In
            </button>
            <button 
              className="btn btn-lg btn-primary btn-block"
              onClick={()=>{onClickSignUpModalCallBack(0)}}
              >
              Sign Up
            </button>

            <p className="mt-5 mb-3 text-muted">&copy; 2020</p>
          </form>
        </div>
      </div>
    );
}


export default Login;