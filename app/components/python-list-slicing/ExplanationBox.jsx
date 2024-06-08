import Head from 'next/head';
import explanations from "./explanations";
import './MyArrayComponent.css';

const ExplanationBox = ({ indexCode, start = '', stop = '', step = '', data }) => {
     const stepCode = indexCode % 10;

  let explanation;
  if (stepCode === 0) {
    explanation = explanations['0000'];
  } else {
    explanation = explanations[indexCode] || ' ';
  }

  // Handle omitted values
  const startValue = start === '' ? 'is blank' : `${start}`;
  const stopValue = stop === '' ? 'is blank' : `${stop}`;
  const stepValue = step === '' ? 'is blank' : `${step}`;

  // Replace placeholders with actual values using a function
  explanation = explanation.replace(/{{(.*?)}}/g, (match, placeholder) => {
    switch (placeholder) {
      case 'start':
        return startValue;
      case 'stop':
        return stopValue;
      case 'step':
        return stepValue;
      case 'dataLength':
        return data.length;
      case 'dataArray':
        return JSON.stringify(data);
      case 'lastIndex':
        return data.length - 1;
      default:
        return match;
    }
  });

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Roboto"
          rel="stylesheet"
        />
      </Head>
      <div className="explanation" style={{ fontFamily: 'Roboto, sans-serif' }}>
        {explanation.split('\n').map((line, index) => (
          <div key={index} className="explanation-line">
            {line}
          </div>
        ))}
      </div>
    </>
  );
};

export default ExplanationBox;