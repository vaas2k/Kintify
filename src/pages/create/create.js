import c from './create.module.css';
import TextInput from '../../components/textinput/textinput';
import { useState } from 'react';
import { Replace } from 'lucide-react';
import { useFormik } from 'formik';
import PostSchema from '../../schema/postschema';
import { createPost, Post_Notification } from '../../api/internal';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const Create = () => {

  const navigate = useNavigate();

  const [selectedMedia, setSelectedMedia] = useState('');
  const [previewMedia, setPreview] = useState('');
  const [mediaType, setMediaType] = useState('');
  const user = useSelector((state) => { return state.user });

  const { checked, values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      title: '',
      description: '',
      link: '',
      allowcomment: false,
      tags: ''
    },

    validationSchema: PostSchema,
  });

  // converting string into array of strings
  function createTags() {
    const tags = [];
    let newword = ''
    for (let i = 0; i < values.tags.length; i++) {
      if (values.tags[i] === ' ') {
        tags.push(newword);
        newword = '';
        continue
      }
      newword += values.tags[i];
    }
    if (values.tags[values.tags.length - 1] !== ' ') {
      tags.push(newword);
    }
    return tags;
    //---------------------------------------->
  }

  async function handleuplaod() {

    const tags = createTags();

    // sending request to backend server
    const post = {
      title: values.title,
      description: values.description,
      userlinks: values.link ||  'null',
      tags: tags,
      allowcomment: values.allowcomment,
      photo: mediaType === 'image' ? previewMedia : 'null',
      video: mediaType === 'video' ? previewMedia : 'null',
      author: user._id,
      authorName: user.username,
      authorPhoto: user.photo
    }

    console.log(post);

    try {
      let response = await createPost(post);
      if (response.status === 200) {
        console.log(response.data);
        navigate('/home');
      }
      else if (response.status !== 200) {
        console.log(response.data);
      }

    } catch (error) {
      console.log(error);
    }

  }

  function handleFileChange(e) {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setSelectedMedia(file);
    }

    setMediaType(file.type.split('/')[0]);
  }


  return (
    <div className={c.mainpost}>
      <h2 className={c.pop}>Create Post</h2>


      <div className={c.post}>
        {previewMedia && <label htmlFor='mediaInput' className={c.replacebutton}><div className={c.imgreplace}>
          <Replace />
          <input
            type="file"
            id="mediaInput"
            name="media"
            accept="image/jpg, image/jpeg, image/png, video/mp4"
            onChange={handleFileChange}
          />
        </div>
        </label>}

        {previewMedia ?
          <>
            {mediaType === 'image' ? (<img src={previewMedia} alt='SelectedMedia' className={c.previewimg} />)
              :
              (<video controls className={c.previewvid}>
                <source src={previewMedia} type={selectedMedia.type} />
                Your browser does not support the video tag.
              </video>)
            }
          </>

          :
          (<label htmlFor="mediaInput" className={c.uploadButton}>
            <div className={c.imgupload}>
              <p>Upload Media</p>
              <input
                type="file"
                id="mediaInput"
                name="media"
                accept="image/jpg, image/jpeg, image/png, video/mp4"
                onChange={handleFileChange}
              />
            </div>
          </label>)}



        <div className={c.postform}>
          <form className={c.postform1}>
            <h4>Title</h4>
            <TextInput
              name='title'
              values={values.title}
              placeholder='title'
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.title && touched.title ? 1 : undefined}
              errormessage={errors.title}
            />
            <h4>Description</h4>
            <textarea
              style={{ width: '250px', height: '200px' }}
              name='description'
              values={values.description}
              placeholder='description'
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.description && touched.description ? 1 : undefined}
              errormessage={errors.description}
            />
            <h4>Link</h4>
            <TextInput
              name='link'
              values={values.link || 'nill'}
              placeholder='link'
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.link && touched.link ? 1 : undefined}
              errormessage={errors.link}
            />
            <h4>Tags</h4>
            <TextInput
              name='tags'
              values={values.tags}
              placeholder='tags'
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.tags && touched.tags ? 1 : undefined}
              errormessage={errors.tags}
            />
            <br />
            <label htmlFor="allowup" className={c.allow}>
              Allow Comment
              <input
                id='allowup'
                type='checkbox'
                name='allowcomment'
                value={true}
                onChange={handleChange}
                checked={values.allowcomment}
              />
            </label>
          </form>
          <div className={c.createbutton}>
            <button onClick={() => !previewMedia ? alert('please select any media') : handleuplaod()}>
              Create
            </button></div>
        </div>

      </div>
    </div>
  );
}


export default Create;