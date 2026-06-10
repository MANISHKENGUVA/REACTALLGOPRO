import {GETLOANCOLLECTION,GETCONFIGCOLLECTION} from './db.js';




export const runWFEngine = () => {
  console.log('WF Engine started');
  const loanCollection = GETLOANCOLLECTION();
  const configCollection = GETCONFIGCOLLECTION();
  console.log('loanCollection', loanCollection);
  console.log('configCollection', configCollection);
  
  if (configCollection && !Object.keys(loanCollection.loanEVENTS || {}).length) {
    console.log('No events found, initializing with config');
    console.log('Config collection:', configCollection?.startState);
    
    // BORROWER-DETAILS-V1-PERSONAL-INFO-V1
    // Actor: BORROWER
    // Module: DETAILS
    // NodeVersion: V1
    // StageNode: PERSONAL-INFO
    // StageNodeVersion: V1
    
    const payLoad = {
      node: configCollection?.startState,
      nodeResolved: null
    };
  }
};
