import React, { useEffect } from 'react';
import { etherpadRootUrl } from './config/urls';
import { EtherpadIdStorage , generateAlphanumeric } from '../../lib/localStorage';


const EtherpadEmbed = () => {

  const [ padId, setPadId ] = React.useState('');

  useEffect(() => {

    const etherpadIdStorage = new EtherpadIdStorage();
    const storedPadId = etherpadIdStorage.getPadId();


    if( storedPadId == '' ){
      const hash = generateAlphanumeric( 10);
      etherpadIdStorage.setPadId( hash );
    }else{
      setPadId( storedPadId );
    }

    console.log( padId );
  }, [padId]);
  
  return (
    <iframe
      src={`${etherpadRootUrl}/p/${padId}`}
      title="Etherpad"
      className="w-full h-full border-0"
    ></iframe>
  );
};

export default EtherpadEmbed;
