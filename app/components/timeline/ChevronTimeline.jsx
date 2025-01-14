import React, { useState } from 'react';

const ChevronTimeline = () => {
  const [selectedStep, setSelectedStep] = useState(null);

  const steps = [
    { id: 'step1', label: 'Første stiftet' },
    { id: 'step2', label: 'Mottatt aksjer' },
    { id: 'step3', label: 'Portefølje' },
    { id: 'step4', label: 'Solgte aksjer' },
    { id: 'step5', label: 'Realisasjon' }
  ];

  const baseColor = '#2c5282'; // Darker blue color

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: '1500px',
      margin: '20px auto',
      position: 'relative'
    }}>
      {steps.map((step, index) => (
        <div key={step.id} style={{ 
          position: 'relative', 
          width: '200px', 
          height: '40px',
          marginLeft:'30px',
          marginRight: '-30px', // Negative margin to overlap chevrons
          zIndex: selectedStep === step.id ? steps.length : steps.length - index
        }}>
          <input
            type="radio"
            id={step.id}
            name="timeline"
            checked={selectedStep === step.id}
            onChange={() => setSelectedStep(step.id)}
            style={{ display: 'none' }}
          />
          <label htmlFor={step.id} style={{ 
            display: 'block',
            width: '100%',
            height: '100%',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'visible'
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              backgroundColor: baseColor,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontWeight: '500',
              fontSize: '13px',
              transition: 'all 0.3s',
              clipPath: index === 0
                ? 'polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%)'
                : 'polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%, 15% 50%)',
              opacity: selectedStep === step.id ? 1 : 0.7,
              transform: selectedStep === step.id ? 'scale(1.05)' : 'scale(1)'
            }}>
              <span style={{ padding: '0 10px', textAlign: 'center' }}>{step.label}</span>
            </div>
          </label>
        </div>
      ))}
    </div>
  );
};

export default ChevronTimeline;