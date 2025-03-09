export const Question = ({ text }) => (
    <div className=" hover:bg-gray-500 px-4">
        <div className="rounded-xl p-2  bg-gray-700 text-white w-fit">
            {text}
        </div>
    </div>
);

export const Response = ({ text }) => (
    text.length > 0 ? (
        <div className="px-4 hover:bg-gray-500">
            <div className="p-2 text-white">
                {text}
            </div>
        </div>
    ) : null
);
