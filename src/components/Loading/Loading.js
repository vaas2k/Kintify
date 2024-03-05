import { Hypnosis } from "react-cssfx-loading";

const Loader = () => {

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

export default Loader;