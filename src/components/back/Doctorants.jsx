import React, { useState } from 'react';
import Child1 from './Doctorant/Child1';
import Child2 from './Doctorant/Child2';
import Child3 from './Doctorant/Child3';
import Child4 from './Doctorant/Child4';

const Doctorants = () => {
  const [visibleComponent, setVisibleComponent] = useState('child1');

  const handleShowComponent = (componentName) => {
    setVisibleComponent(componentName);
  };

  return (
    <div>
      <button className='btn btn-info mb-3' onClick={() => handleShowComponent('child1')}>Afficher Child 1</button>
      <button className='btn btn-success mb-3' onClick={() => handleShowComponent('child2')}>Afficher Child 2</button>
      <button className='btn btn-warning mb-3' onClick={() => handleShowComponent('child3')}>Afficher Child 3</button>
      <button className='btn btn-info mb-3' onClick={() => handleShowComponent('child4')}>Afficher Child 4</button>
      {/* Afficher les composants enfants en fonction du bouton cliqué */}
      {visibleComponent === 'child1' && <Child1 />}
      {visibleComponent === 'child2' && <Child2 />}
      {visibleComponent === 'child3' && <Child3 />}
      {visibleComponent === 'child4' && <Child4 />}
    </div>
  );
};

export default Doctorants;
