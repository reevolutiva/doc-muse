import "./AddNodeForm.css"
import { useState } from 'react';

const AddNodeForm = ( { nodes, setNodes, addNode } ) => {

    const [edit, setEdit] = useState(false);
    const [nodeType, setNodeType] = useState('');
    const [nodeContent, setNodeContent] = useState('');

    const onSubmitHandler = ( e ) => {
      e.preventDefault();
      addNode(nodeType, nodeContent);
    }
  
    const onChangeSelectorHandler = ( e ) => {
      e.preventDefault();
      setNodeType(e.target.value);
      setEdit(true);
    }

    const onChangeInputHandler = ( e ) =>{
        setNodeContent(e.target.value);
    }
  
    return (
      <form className="add-node-form" onSubmit={ e => onSubmitHandler(e)}>
        <select name="block" id="block-selector" onChange={ e => onChangeSelectorHandler(e) } >
          <option value="paragraph">Paragraph</option>
          <option value="heading">Heading</option>
          <option value="deleterNode">Deleter Node</option>
          <option value="imageNode">Image</option>
          <option value="subtitleNode">Subtitle</option>
        </select>
        {
            edit && <input type="text" className="shadow-inner bg-gray-100 rounded" onChange={ e => onChangeInputHandler(e) }/>
        }
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Add Node</button>
      </form>
    )
}

export { AddNodeForm };