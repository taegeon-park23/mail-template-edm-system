import React, {
    useRef,
    useEffect,
  }  from 'react';
const ReactComment = ({content}) => {
    const el = useRef();
      useEffect( () => {
          el.current.outerHTML = content;
      }, [] );
    
    return (<div ref={el}/>)
  };
export default ReactComment;  