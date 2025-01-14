'use client'
import React ,{useState, useEffect} from "react";
const ConsoleComponentProps6 = ({ code }) => {
    const [output, setOutput] = useState("");

    useEffect(() => {
        let capturedOutput = '';
        const originalConsoleLog = console.log;

        console.log = (...args) => {
            capturedOutput += args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ') + '\n';
            originalConsoleLog.apply(console, args);
        };

        try {
            // Directly evaluate the code string
            eval(code);

            // After execution, if there's no captured output but there's a result
            if (capturedOutput.trim() === '' && typeof result !== 'undefined') {
                capturedOutput = typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result);
            }
        } catch (err) {
            capturedOutput = `Error: ${err.message}`;
        } finally {
            console.log = originalConsoleLog; // Restore the original console.log function
            setOutput(capturedOutput); // Update the state with the captured output or error
        }
    }, [code]); // Re-run this effect if the `code` prop changes

    return (
        <div className="console-output">
            {output}
        </div>
    );
};
export default ConsoleComponentProps6