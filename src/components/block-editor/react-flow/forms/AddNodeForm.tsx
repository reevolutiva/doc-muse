import "./AddNodeForm.css"
import { useState } from 'react';

const AddNodeForm = ( { nodes, setNodes } ) => {

    const [edit, setEdit] = useState(false);

    const onSubmitHandler = ( e ) => {
      e.preventDefault();
  
    }
  
    const onChangeSelectorHandler = ( e ) => {
      e.preventDefault();
      setEdit(true);
    }

    const onChangeInputHanlder = ( e ) =>{
        const { value } = e.target;
        
    }
  
    return (
      <form className="add-node-form" onSubmit={ e => onSubmitHandler(e)}>
        <select name="block" id="block-selector" onChange={ e => onChangeSelectorHandler(e) } >
          <option value="paragraph">Paragraph</option>
          <option value="heading-1">Heading 1</option>
          <option value="heading-2">Heading 2</option>
          <option value="heading-3">Heading 3</option>
          <option value="image">Image</option>
        </select>
        {
            edit && <input type="text" className="shadow-inner bg-gray-100 rounded" onChange={ e => onChangeInputHanlder(e) }/>
        }
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Add Node</button>
      </form>
    )
  
  }

 export { AddNodeForm  };