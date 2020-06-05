import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";

export default function (SpecificComponent, option, adminRoute = null) {
  function AuthencticationCheck(props) {
    // Backend에 현재 상태를 알려달라는 request를 보내기
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(auth()).then((response) => {
        //권한에 따라 보여주는 페이지를 관리하기위한 분기처리

        //1. 로그인하지 않는 상태
        if (response.payload.isAuth === false) {
          if (option) {
            props.history.push("/login");
          }
        } else {
          //로그인한 상태
          if (adminRoute && !response.payload.isAuth) {
            props.history.push("/");
          } else {
            if (!option) {
              props.history.push("/");
            }
          }
        }
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <SpecificComponent />;
  }

  return AuthencticationCheck;
}
