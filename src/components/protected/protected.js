import { Navigate } from "react-router-dom";
import { Hypnosis } from "react-cssfx-loading";

const Protected = ({isAuth , children}) => {

    if(isAuth){
        return children;
    }
    else{
        return (<div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Hypnosis color="red" className="hyp" />
          </div>)
    }
}

const Protected1 = ({isAuth , children}) => {

    if(!isAuth){
        return children;
    }
    else{
        return <Navigate to={'/home'}/>
    }
}

export {Protected , Protected1};