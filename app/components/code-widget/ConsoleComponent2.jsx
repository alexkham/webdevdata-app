const ConsoleComponent2 = ({ logs }) => {
    return (
        <div className="console-output">
            {logs.map((log, index) => (
                <div key={index}>{log}</div>
            ))}
        </div>
    );
};

export  default ConsoleComponent2;
