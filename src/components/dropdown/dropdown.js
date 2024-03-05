import d from './drop.module.css';

const DropDown = (props) => {

  return (
    <div className={d.drop}>
      <ul className={props.type === 'icons' ? d.ddmenu : d.dropmenu} style={{
        position: 'absolute',
        left: `${props.left1}px`,
        top: `${props.top1}px`,
        right: `${props.right1}px`
      }}>
        <li id='li1'>{props.s1}</li>
        <li id='li2'>{props.s2}</li>
        <li id='li3'>{props.s3}</li>
        <li id='li4'>{props.s4}</li>
      </ul>
    </div>
  );
}

export default DropDown;