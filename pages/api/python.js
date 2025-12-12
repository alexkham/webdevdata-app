// // app/api/python/route.js
// import { spawn } from 'child_process';
// import { NextResponse } from 'next/server';

// export async function POST(request) {
//   try {
//     // First validate the request
//     if (!request.body) {
//       return NextResponse.json({ error: 'No request body' }, { status: 400 });
//     }

//     const body = await request.json();
    
//     if (!body.code) {
//       return NextResponse.json({ error: 'No code provided' }, { status: 400 });
//     }

//     // Execute Python code
//     const output = await new Promise((resolve, reject) => {
//       const python = spawn('python', ['-c', body.code]);
//       let stdoutData = '';
//       let stderrData = '';

//       python.stdout.on('data', (data) => {
//         stdoutData += data.toString();
//       });

//       python.stderr.on('data', (data) => {
//         stderrData += data.toString();
//       });

//       python.on('close', (code) => {
//         if (code !== 0) {
//           reject(new Error(stderrData || 'Python execution failed'));
//         } else {
//           resolve(stdoutData);
//         }
//       });

//       // Handle process errors
//       python.on('error', (err) => {
//         reject(new Error(`Failed to start Python process: ${err.message}`));
//       });

//       // Set timeout
//       setTimeout(() => {
//         python.kill();
//         reject(new Error('Execution timeout'));
//       }, 10000); // 10 second timeout
//     });

//     return NextResponse.json({ output });

//   } catch (error) {
//     console.error('Python execution error:', error);
//     return NextResponse.json(
//       { error: error.message || 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }



// pages/api/python.js
import { spawn } from 'child_process';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }

    const output = await new Promise((resolve, reject) => {
      const python = spawn('python', ['-c', code]);
      let stdoutData = '';
      let stderrData = '';

      python.stdout.on('data', (data) => {
        stdoutData += data.toString();
      });

      python.stderr.on('data', (data) => {
        stderrData += data.toString();
      });

      python.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(stderrData || 'Python execution failed'));
        } else {
          resolve(stdoutData);
        }
      });

      python.on('error', (err) => {
        reject(new Error(`Failed to start Python process: ${err.message}`));
      });

      setTimeout(() => {
        python.kill();
        reject(new Error('Execution timeout'));
      }, 10000);
    });

    return res.status(200).json({ output });

  } catch (error) {
    console.error('Python execution error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}