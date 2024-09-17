const ErrorMessage = ({
    message,
    subtext
}: {
    message: string;
    subtext?: string | string[];
}) => (
    <div className="flex flex-col justify-center items-center">
        <span className="text-2xl font-bold">{message}</span>
        {subtext &&
            (Array.isArray(subtext) ? (
                subtext.map((text, i) => <span key={i}>{text}</span>)
            ) : (
                <p className="text-lg">{subtext}</p>
            ))}
    </div>
);

export default ErrorMessage;
