import fl from './follow.module.css';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
const Follow = (props) => {

    let renderflrs;
    let renderflgs;
    if (props.handleflr) {
        try {

            renderflrs = props.flrlist.map((item) => {
                return (<div className={fl.contain_follows}>
                    <div className={fl.img_name}>
                        <img src={item.Photo} />
                        <h>{item.Username}</h>
                    </div>
                    <Link to={`/profile/${item.Username}`}>
                        <button onClick={props.handleflr || props.handleflg}>Go to</button>
                    </Link>
                </div>)
            })
        } catch (error) {
            console.log(error);
        }
    }
    else if (props.handleflg) {
        try {

            renderflgs = props.flglist.map((item) => {
                return (<div className={fl.contain_follows}>
                    <div className={fl.img_name}>
                        <img src={item.Photo} />
                        <h>{item.Username}</h>
                    </div>
                    <Link to={`/profile/${item.Username}`}>
                        <button onClick={props.handleflr || props.handleflg}>Go to</button>
                    </Link>
                </div>)
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={fl.parent}>
            <div className={fl.main_follow_box}>
                <X
                    onClick={props.handleflr || props.handleflg}
                    className={fl.x}
                    style={{ width: '20px', padding: '10px', margin: '0px' }}
                />
                <h3>{props.handleflg ? 'Following' : 'Followers'}</h3>
                {renderflrs} {renderflgs}

            </div>
        </div>
    )
}


export default Follow;