import foo from './footer.module.css';

const Footer = () => {

    return(
        <div className={foo.foot}>
            <h3>Content</h3>
            <h3>API's</h3>
            <h3>About us</h3>
            <h3>News</h3>
        </div>
    );
}

export default Footer;