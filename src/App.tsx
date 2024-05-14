import { useState } from 'react';
import * as c2a from 'circom-2-arithc';
import './App.css'

const defaultSrc = [
  'pragma circom 2.0.0;',
  '',
  '// Two element sum',
  'template sum () {',
  '  signal input a;',
  '  signal input b;',
  '  signal output out;',
  '',
  '  out <== a + b;',
  '}',
  '',
  'component main = sum();',
].join('\n');

function App() {
  const [inputs, setInputs] = useState('[3, 5]');
  const [src, setSrc] = useState(defaultSrc);

  const [calcState, setCalcState] = useState<{
    inputs: string,
    src: string,
    outputs: string,
  }>();

  let outputs: string | undefined = undefined;

  if (calcState?.inputs === inputs && calcState?.src === src) {
    outputs = calcState.outputs;
  }

  const evaluate = async () => {
    try {
      await c2a.init();
      const circuit = c2a.Circuit.compile({ '/src/main.circom': src });
      const inputArray = new Uint32Array(JSON.parse(inputs));
      
      setCalcState({
        inputs,
        src,
        outputs: '[' + [...circuit.evalArray(inputArray)].join(', ') + ']',
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : JSON.stringify(e);
      setCalcState({ inputs, src, outputs: msg });
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1em',
      alignContent: 'left',
      fontFamily: 'monospace',
    }}>
      <h1>circom-2-arithc demo</h1>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '1em',
        placeItems: 'center',
        fontSize: '1.5rem',
      }}>
        <div>Inputs:&nbsp;</div>
        <div><input
          type="text"
          value={inputs}
          style={{ fontSize: '1.5rem', fontFamily: 'monospace' }}
          onInput={(e) => setInputs((e.target as HTMLInputElement).value)}
        /></div>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '1em',
        placeItems: 'center',
        fontSize: '1.5rem',
        height: '3rem',
      }}>
        <div>Outputs:</div>
        {outputs === undefined
          ? <div><button onClick={() => evaluate()}>eval</button></div>
          : <div style={{ fontFamily: 'monospace' }}>{outputs}</div>
        }
      </div>
      <div>
        <textarea
          style={{ width: '100%', height: '400px' }}
          onInput={(e) => setSrc((e.target as HTMLTextAreaElement).value)}
        >{src}</textarea>
      </div>
    </div>
  )
}

export default App
