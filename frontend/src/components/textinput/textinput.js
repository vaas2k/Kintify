import t from './text.module.css';

const TextInput = (props) => {
    return (
        <div className={t.text}>
            <input {...props} />
            {props.error && (
                <p className={t.errorMessage}>{props.errormessage}</p>
            )}
        </div>
    );
}

export default TextInput;