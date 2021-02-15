import React, { useState, useContext, useEffect, useCallback } from "react";
import Modal from "@material-ui/core/Dialog";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import "./Login.css";
import bizeMDIcon from "../assets/images/BizeMD.PNG";
import axios from "axios";
import SignUpModal from "../pageComponents/Login/SignUpModal";
import SearchIdModal from "../pageComponents/Login/SearchIdModal";
import SearchPwModal from "../pageComponents/Login/SearchPwModal";
const Login = ({history}) => {

    const [userId, setUserId] = useState("");
    const [userPw, setUserPw] = useState("");
    const [signUpModalStatus, setSignUpModalStatus] = useState("false");
    const [updateCount, setUpdateCount] = useState(0);
    const [searchIdModalStatus, setSerarchIdModalStatus] = useState(false);
    const [searchPwModalStatus, setSerarchPwModalStatus] = useState(false);

    

    const onClickSignUpModalCallBack = useCallback((no)=>{
      setSignUpModalStatus(true);

    })

    const onClickSearchIdCallBack = useCallback((no)=>{
      setSerarchIdModalStatus(true);

    })

    const onClickSearchPwCallBack = useCallback((no)=>{
      setSerarchPwModalStatus(true);

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

        {searchIdModalStatus === true ? (
          <Modal
            open={searchIdModalStatus}
            onClose={()=>{
              setSerarchIdModalStatus(false);
            }}
            children={
              <SearchIdModal
                onClose={()=>{
                  setSerarchIdModalStatus(false);
                }}
                setUpdateCountLogin={()=> {
                  setUpdateCount(updateCount+1);
                }}>

              </SearchIdModal>

            }
            >

          </Modal>
        ) : null}

        {searchPwModalStatus === true ? (
          <Modal
            open={searchPwModalStatus}
            onClose={()=>{
              setSerarchPwModalStatus(false);
            }}
            children={
              <SearchPwModal
                onClose={()=>{
                  setSerarchPwModalStatus(false);
                }}
                setUpdateCountLogin={()=> {
                  setUpdateCount(updateCount+1);
                }}>

              </SearchPwModal>

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
                if(response.data.resultMessage === "userIdWrong") {
                  alert("아이디를 다시한번 확인해 주세요");
                } else if(response.data.resultMessage === "userPwWrong") {
                  alert("비밀번호를 다시한번 확인해 주세요");
                }
                else {
                  localStorage.setItem('jwtToken', response.data.jwtToken);
                  localStorage.setItem('role', response.data.role);
                  history.push("/");
                }
              } catch(err) {
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
            <Grid container>
              <Grid container justify="flex-end" item xs={6}>
                      <Grid item>
                        <Link onClick={()=>{onClickSearchIdCallBack(0)}} variant="body2">
                          아이디 찾기
                        </Link>
                      </Grid>
                    </Grid>
              <Grid container justify="flex-end" item xs={6}>
                <Grid item>
                  <Link onClick={()=>{onClickSearchPwCallBack(0)}} variant="body2">
                    비밀번호 찾기
                  </Link>
                </Grid>
              </Grid>
            </Grid>

            <p className="mt-5 mb-3 text-muted">&copy; 2020</p>
          </form>
        </div>
      </div>
    );
}


export default Login;